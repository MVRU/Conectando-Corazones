import { derived, get, writable } from 'svelte/store';
import type { User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

import type {
        Administrador,
        Colaborador,
        Institucion,
        Organizacion,
        Unipersonal,
        Usuario
} from '$lib/types/Usuario';
import type { Contacto } from '$lib/types/Contacto';
import { validarCorreo, validarUsername } from '$lib/utils/validaciones';
import {
        completeProfile,
        getUserDocument,
        googleProvider,
        logout as firebaseLogout,
        onAuthStateChangedSafe,
        registerWithEmail,
        signInWithEmail,
        signInWithProvider
} from '$lib/services/firebase/auth.service';
import { getFirebaseAuth, getFirebaseFirestore } from '$lib/services/firebase/firebase.client';
import {
        mapColaborador,
        mapInstitucion,
        mapUsuario,
        type UsuarioSnapshot
} from '$lib/services/firebase/mappers';

/**
 * ! DECISIÓN DE DISEÑO: El store se sincroniza directamente con Firebase Auth/Firestore para garantizar un origen de verdad único,
 * -*- delegando al SDK la persistencia de sesión y separando la lógica de formularios de la de autenticación.
 * -?- Limitación: recordarSesion usa la misma persistencia global (local) hasta que se implemente un selector dinámico.
 */

const USERS_COLLECTION = 'users';
const COLABORADORES_COLLECTION = 'colaboradores';
const INSTITUCIONES_COLLECTION = 'instituciones';

// Tipo unión para todos los tipos de usuario posibles
type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

type UsuarioRol = Usuario['rol'];

type MetadataPlano = Record<string, unknown>;

type ColaboradorPerfilInput =
        Omit<Partial<Colaborador>, 'rol' | 'username' | 'nombre' | 'apellido'> &
        Pick<Colaborador, 'username' | 'nombre' | 'apellido'>;

type InstitucionPerfilInput =
        Omit<Partial<Institucion>, 'rol' | 'username' | 'nombre' | 'apellido' | 'nombre_legal' | 'tipo_institucion'> &
        Pick<Institucion, 'username' | 'nombre' | 'apellido' | 'nombre_legal' | 'tipo_institucion'>;

// Estado de autenticación
interface AuthState {
        firebaseUser: FirebaseUser | null;
        perfil: UsuarioCompleto | null;
        isAuthenticated: boolean;
        isLoading: boolean;
        error: string | null;
}

// Estado inicial
const initialState: AuthState = {
        firebaseUser: null,
        perfil: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
};

// Store principal de autenticación
export const authStore = writable<AuthState>(initialState);

// Stores derivados para facilitar el acceso
export const firebaseUser = derived(authStore, ($auth) => $auth.firebaseUser);
export const perfil = derived(authStore, ($auth) => $auth.perfil);
export const usuario = perfil;
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(authStore, ($auth) => $auth.isLoading);
export const authError = derived(authStore, ($auth) => $auth.error);

// Stores derivados para roles
export const usuarioRol = derived(authStore, ($auth) => $auth.perfil?.rol ?? null);
export const isAdmin = derived(authStore, ($auth) => $auth.perfil?.rol === 'administrador');
export const isInstitucion = derived(authStore, ($auth) => $auth.perfil?.rol === 'institucion');
export const isColaborador = derived(authStore, ($auth) => $auth.perfil?.rol === 'colaborador');

// Estado de verificación
export const isVerified = derived(authStore, ($auth) => $auth.perfil?.estado === 'activo');

export interface RegisterColaboradorInput {
        email: string;
        password: string;
        perfil: ColaboradorPerfilInput;
        metadata?: MetadataPlano;
}

export interface RegisterInstitucionInput {
        email: string;
        password: string;
        perfil: InstitucionPerfilInput;
        metadata?: MetadataPlano;
}

const DEFAULT_APELLIDO = 'Pendiente';

function sanitizeOptionalString(value: unknown): string | undefined {
        if (typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeEmailValue(email: string): string {
        return email.trim().toLowerCase();
}

function sanitizeContacts(contacts?: Contacto[]): Contacto[] | undefined {
        if (!Array.isArray(contacts)) return undefined;
        const sanitized: Contacto[] = [];
        for (const raw of contacts) {
                if (!raw) continue;
                const valor = sanitizeOptionalString(raw.valor);
                if (!valor) continue;
                const tipo = sanitizeOptionalString(raw.tipo_contacto) ?? 'email';
                const etiqueta = sanitizeOptionalString(raw.etiqueta);
                const contactoSanitizado: Contacto = {
                        ...raw,
                        tipo_contacto: tipo,
                        valor
                };
                if (etiqueta) {
                        contactoSanitizado.etiqueta = etiqueta;
                } else {
                        delete (contactoSanitizado as Partial<Contacto>).etiqueta;
                }
                sanitized.push(contactoSanitizado);
        }
        return sanitized.length > 0 ? sanitized : undefined;
}
function stripUndefined<T extends Record<string, unknown>>(data: T): T {
        return Object.fromEntries(
                Object.entries(data).filter(([, value]) => value !== undefined)
        ) as T;
}

function sanitizeMetadata(metadata?: MetadataPlano): MetadataPlano | undefined {
        if (!metadata) return undefined;
        const sanitized = stripUndefined({ ...metadata });
        return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

interface BuildUserDocumentPayloadInput {
        rol: UsuarioRol;
        email: string;
        perfil: Record<string, unknown>;
        defaults?: Partial<Record<'username' | 'nombre' | 'apellido', string>>;
        extras?: Record<string, unknown>;
}

interface UserDocumentPayload {
        document: Record<string, unknown>;
        perfil: Record<string, unknown>;
}

function createUserDocumentPayload(input: BuildUserDocumentPayloadInput): UserDocumentPayload {
        const normalizedEmail = sanitizeEmailValue(input.email);
        const defaults = input.defaults ?? {};
        const username =
                sanitizeOptionalString(input.perfil.username) ??
                sanitizeOptionalString(defaults.username) ??
                normalizedEmail.split('@')[0];
        const nombre =
                sanitizeOptionalString(input.perfil.nombre) ??
                sanitizeOptionalString(defaults.nombre) ??
                username;
        const apellido =
                sanitizeOptionalString(input.perfil.apellido) ??
                sanitizeOptionalString(defaults.apellido) ??
                DEFAULT_APELLIDO;
        const estado = sanitizeOptionalString(input.perfil.estado) ?? 'activo';
        const contactos = sanitizeContacts(input.perfil.contactos as Contacto[] | undefined);
        const urlFoto = sanitizeOptionalString(input.perfil.url_foto);
        const perfilPayload = stripUndefined({
                ...input.perfil,
                username,
                nombre,
                apellido,
                rol: input.rol,
                estado,
                url_foto: urlFoto,
                contactos,
                email: sanitizeOptionalString((input.perfil as { email?: string }).email) ?? normalizedEmail
        });
        const document = stripUndefined({
                rol: input.rol,
                email: normalizedEmail,
                username,
                nombre,
                apellido,
                estado,
                url_foto: urlFoto,
                contactos,
                perfil: perfilPayload,
                ...stripUndefined(input.extras ?? {})
        });
        return { document, perfil: perfilPayload };
}

function extractEmailFromContacts(rawContacts: unknown): string | undefined {
        if (!Array.isArray(rawContacts)) return undefined;
        for (const item of rawContacts) {
                if (typeof item !== 'object' || item === null) continue;
                const value = sanitizeOptionalString((item as Record<string, unknown>).valor);
                const tipo = sanitizeOptionalString((item as Record<string, unknown>).tipo_contacto);
                if (value && (!tipo || tipo.includes('mail') || tipo === 'email')) {
                        return value.toLowerCase();
                }
        }
        return undefined;
}

function extractEmailFromRecord(record?: Record<string, unknown>): string | undefined {
        if (!record) return undefined;
        const candidates = ['email', 'correo', 'correo_institucional', 'email_institucional'];
        for (const key of candidates) {
                const value = record[key];
                if (typeof value === 'string' && value.trim().length > 0) {
                        return value.trim().toLowerCase();
                }
        }
        return extractEmailFromContacts(record.contactos);
}

async function resolveEmailFromIdentifier(identificador: string): Promise<string | null> {
        const credencial = identificador.trim();
        if (!credencial) {
                return null;
        }
        if (validarCorreo(credencial)) {
                return credencial.toLowerCase();
        }
        if (!validarUsername(credencial)) {
                        return null;
        }
        try {
                const firestore = await getFirebaseFirestore();
                const snapshot = await getDocs(
                        query(collection(firestore, USERS_COLLECTION), where('username', '==', credencial), limit(1))
                );
                if (snapshot.empty) {
                        return null;
                }
                const data = snapshot.docs[0]?.data() as Record<string, unknown> | undefined;
                return (
                        extractEmailFromRecord(data) ??
                        extractEmailFromRecord((data?.perfil as Record<string, unknown>) ?? undefined) ??
                        null
                );
        } catch (error) {
                console.error('Error al resolver email por username', error);
                return null;
        }
}

async function fetchPerfil(uid: string): Promise<UsuarioCompleto | null> {
        const snapshot = (await getUserDocument(uid)) as UsuarioSnapshot;
        if (!snapshot.exists()) {
                return null;
        }
        const rol = snapshot.data()?.rol as UsuarioRol | undefined;
        if (rol === 'institucion') {
                return mapInstitucion(snapshot);
        }
        if (rol === 'colaborador') {
                return mapColaborador(snapshot);
        }
        return mapUsuario(snapshot);
}

function handleAuthError(error: unknown, fallback: string): string {
        const message = error instanceof Error ? error.message : fallback;
        authStore.update((state) => ({ ...state, isLoading: false, error: message }));
        return message;
}

async function syncPerfil(user: FirebaseUser | null): Promise<void> {
        if (!user) {
                authStore.set(initialState);
                return;
        }
        authStore.update((state) => ({
                ...state,
                firebaseUser: user,
                isAuthenticated: true,
                isLoading: true,
                error: null
        }));
        try {
                const perfil = await fetchPerfil(user.uid);
                authStore.update((state) => ({
                        ...state,
                        firebaseUser: user,
                        perfil,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                }));
        } catch (error) {
                handleAuthError(error, 'Error al cargar el perfil');
        }
}

async function ensureProfileForProvider(user: FirebaseUser, rol: UsuarioRol): Promise<void> {
        const snapshot = await getUserDocument(user.uid);
        if (snapshot.exists()) {
                const data = snapshot.data();
                if (!data?.rol) {
                        await completeProfile({ uid: user.uid, data: { rol }, merge: true });
                }
                return;
        }
        const email = user.email ? sanitizeEmailValue(user.email) : null;
        if (!email) {
                throw new Error('El proveedor no entregó un correo electrónico verificable.');
        }
        const displayName = sanitizeOptionalString(user.displayName);
        const [nombreRaw, ...resto] = displayName ? displayName.split(' ') : [];
        const nombre = sanitizeOptionalString(nombreRaw);
        const apellido = sanitizeOptionalString(resto.join(' '));
        const baseUsername = email.split('@')[0];
        const contactos: Contacto[] = [
                {
                        tipo_contacto: 'email',
                        valor: email,
                        etiqueta: 'principal'
                }
        ];
        const { document, perfil } = createUserDocumentPayload({
                rol,
                email,
                perfil: {
                        username: baseUsername,
                        nombre: nombre ?? baseUsername,
                        apellido: apellido ?? DEFAULT_APELLIDO,
                        url_foto: sanitizeOptionalString(user.photoURL),
                        contactos
                },
                defaults: { username: baseUsername, nombre: baseUsername, apellido: DEFAULT_APELLIDO }
        });
        await completeProfile({ uid: user.uid, data: document, merge: false });
        if (rol === 'colaborador') {
                await completeProfile({
                        uid: user.uid,
                        collection: COLABORADORES_COLLECTION,
                        data: { ...perfil, rol },
                        merge: false
                });
        }
        if (rol === 'institucion') {
                await completeProfile({
                        uid: user.uid,
                        collection: INSTITUCIONES_COLLECTION,
                        data: { ...perfil, rol },
                        merge: false
                });
        }
}

let unsubscribeAuthListener: (() => void) | null = null;

async function initializeAuthListener(): Promise<void> {
        if (unsubscribeAuthListener) {
                return;
        }
        try {
                unsubscribeAuthListener = await onAuthStateChangedSafe((user) => {
                        void syncPerfil(user);
                });
        } catch (error) {
                console.error('Error al inicializar el listener de autenticación', error);
        }
}

if (typeof window !== 'undefined') {
        void initializeAuthListener();
}

interface RegisterExtras {
        metadata?: MetadataPlano;
        documentExtras?: Record<string, unknown>;
}

async function executeRegister(
        rol: UsuarioRol,
        email: string,
        password: string,
        perfilInput: Record<string, unknown>,
        extrasInput: RegisterExtras = {}
): Promise<UsuarioCompleto | null> {
        authStore.update((state) => ({ ...state, isLoading: true, error: null }));
        try {
                const displayNameBase = `${sanitizeOptionalString(perfilInput.nombre) ?? ''} ${
                        sanitizeOptionalString(perfilInput.apellido) ?? ''
                }`;
                const displayName = sanitizeOptionalString(displayNameBase);
                const user = await registerWithEmail({
                        email,
                        password,
                        displayName: displayName ?? undefined
                });
                const extras = stripUndefined({
                        ...(extrasInput.documentExtras ? stripUndefined(extrasInput.documentExtras) : {}),
                        metadata: sanitizeMetadata(extrasInput.metadata)
                });
                const { document, perfil } = createUserDocumentPayload({
                        rol,
                        email,
                        perfil: perfilInput,
                        extras
                });
                await completeProfile({ uid: user.uid, data: document, merge: false });
                if (rol === 'colaborador') {
                        await completeProfile({
                                uid: user.uid,
                                collection: COLABORADORES_COLLECTION,
                                data: { ...perfil, rol },
                                merge: false
                        });
                }
                if (rol === 'institucion') {
                        await completeProfile({
                                uid: user.uid,
                                collection: INSTITUCIONES_COLLECTION,
                                data: { ...perfil, rol },
                                merge: false
                        });
                }
                await syncPerfil(user);
                return get(authStore).perfil;
        } catch (error) {
                handleAuthError(error, 'Error durante el registro');
                throw error;
        }
}

// Funciones para manejar la autenticación
export const authActions = {
        /**
         * Iniciar sesión (acepta email o username como "identificador")
         */
        async login(
                identificador: string,
                password: string,
                recordarSesion: boolean = false
        ): Promise<UsuarioCompleto | null> {
                const credencial = identificador?.trim();
                if (!credencial || !password) {
                        authStore.update((s) => ({ ...s, error: 'Credenciales inválidas' }));
                        return null;
                }

                authStore.update((state) => ({ ...state, isLoading: true, error: null }));

                try {
                        const email = await resolveEmailFromIdentifier(credencial);
                        if (!email) {
                                authStore.update((state) => ({ ...state, isLoading: false, error: 'Credenciales inválidas' }));
                                return null;
                        }
                        await signInWithEmail({ email, password });
                        const authInstance = await getFirebaseAuth();
                        await syncPerfil(authInstance.currentUser ?? null);
                        return get(authStore).perfil;
                } catch (error) {
                        handleAuthError(error, 'Error al iniciar sesión');
                        throw error;
                } finally {
                        if (!recordarSesion) {
                                // TODO: Exponer selector de persistencia cuando se gestione sesión temporal.
                        }
                }
        },

        /**
         * Cerrar sesión
         */
        async logout(): Promise<void> {
                try {
                        await firebaseLogout();
                } catch (error) {
                        console.error('Error al cerrar sesión', error);
                } finally {
                        authStore.set(initialState);
                }
        },

        /**
         * Verificar sesión al cargar la app
         */
        async checkAuth(): Promise<void> {
                authStore.update((state) => ({ ...state, isLoading: true }));
                try {
                        const auth = await getFirebaseAuth();
                        await syncPerfil(auth.currentUser ?? null);
                } catch (error) {
                        handleAuthError(error, 'Error al verificar autenticación');
                }
        },

        /**
         * Registrar colaborador/a con email y contraseña
         */
        async registerColaborador(input: RegisterColaboradorInput): Promise<UsuarioCompleto | null> {
                const email = sanitizeEmailValue(input.email);
                const tipoColaborador = sanitizeOptionalString(input.perfil.tipo_colaborador) ?? 'unipersonal';
                const perfilInput = {
                        ...input.perfil,
                        tipo_colaborador: tipoColaborador
                };
                return executeRegister('colaborador', email, input.password, perfilInput, {
                        metadata: input.metadata,
                        documentExtras: { tipo_colaborador: tipoColaborador }
                });
        },

        /**
         * Registrar institución con email y contraseña
         */
        async registerInstitucion(input: RegisterInstitucionInput): Promise<UsuarioCompleto | null> {
                const email = sanitizeEmailValue(input.email);
                const nombreLegal = sanitizeOptionalString(input.perfil.nombre_legal) ?? input.perfil.nombre;
                const tipoInstitucion = sanitizeOptionalString(input.perfil.tipo_institucion) ?? 'otra';
                const perfilInput = {
                        ...input.perfil,
                        nombre_legal: nombreLegal,
                        tipo_institucion: tipoInstitucion
                };
                return executeRegister('institucion', email, input.password, perfilInput, {
                        metadata: input.metadata,
                        documentExtras: {
                                nombre_legal: nombreLegal,
                                tipo_institucion: tipoInstitucion
                        }
                });
        },

        /**
         * Iniciar sesión con Google asignando un rol por defecto
         */
        async signInWithGoogle(rol: UsuarioRol = 'colaborador'): Promise<UsuarioCompleto | null> {
                authStore.update((state) => ({ ...state, isLoading: true, error: null }));
                try {
                        const user = await signInWithProvider(googleProvider);
                        await ensureProfileForProvider(user, rol);
                        await syncPerfil(user);
                        return get(authStore).perfil;
                } catch (error) {
                        handleAuthError(error, 'Error al autenticar con Google');
                        throw error;
                }
        },

        /**
         * Limpiar estado de error
         */
        clearError() {
                authStore.update((state) => ({ ...state, error: null }));
        },

        /**
         * Actualizar datos del usuario en memoria
         */
        updateUsuario(perfilData: Partial<Usuario>) {
                authStore.update((state) => ({
                        ...state,
                        perfil: state.perfil ? ({ ...state.perfil, ...perfilData } as UsuarioCompleto) : null
                }));
        }
};

/**
 * Verificar permisos por rol
 */
export function hasPermission(permission: string): boolean {
        const state = get(authStore);
        const rol = state.perfil?.rol;
        if (rol === 'administrador') return true;

        if (rol === 'institucion') {
                const institucionPermissions = ['crear_proyecto', 'editar_proyecto', 'ver_proyectos_propios'];
                return institucionPermissions.includes(permission);
        }

        if (rol === 'colaborador') {
                const colaboradorPermissions = ['ver_proyectos', 'hacer_donacion', 'ver_perfil'];
                return colaboradorPermissions.includes(permission);
        }

        return false;
}

/**
 * Verificar acceso a rutas por rol
 */
export function canAccessRoute(route: string): boolean {
        const routePermissions: Record<string, string[]> = {
                '/admin': ['administrador'],
                '/institucion': ['institucion', 'administrador'],
                '/colaborador': ['colaborador', 'administrador'],
                '/proyectos/crear': ['institucion', 'administrador'],
                '/perfil': ['institucion', 'colaborador', 'administrador']
        };

        const requiredRoles = routePermissions[route] ?? [];
        const state = get(authStore);

        return requiredRoles.length === 0 || (!!state.perfil && requiredRoles.includes(state.perfil.rol));
}
