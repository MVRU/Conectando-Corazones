import type { DocumentData, DocumentSnapshot, Timestamp } from 'firebase/firestore';

import type { Categoria } from '$lib/types/Categoria';
import type { Colaborador, Institucion, Usuario } from '$lib/types/Usuario';
import type { Contacto } from '$lib/types/Contacto';
import type { Direccion } from '$lib/types/Direccion';

// ! DECISIÓN DE DISEÑO: Centralizar los mapeos evita duplicar lógica de parsing entre Firestore y la capa de dominio, manteniendo SRP y facilitando validaciones coherentes.

type RolDisponible = Usuario['rol'];

type SnapshotData = DocumentData & {
        rol?: RolDisponible;
        perfil?: Record<string, unknown>;
};

export type UsuarioSnapshot = DocumentSnapshot<SnapshotData>;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeString(value: unknown, fallback = ''): string {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : fallback;
	}
	return fallback;
}

function sanitizeRol(value: unknown): RolDisponible {
	const roles: RolDisponible[] = ['institucion', 'colaborador', 'administrador'];
	if (typeof value === 'string' && roles.includes(value as RolDisponible)) {
		return value as RolDisponible;
	}
	return 'colaborador';
}

function sanitizeArray<T>(value: unknown): T[] | undefined {
	return Array.isArray(value) ? (value as T[]) : undefined;
}

function sanitizeDate(value: unknown): Date | undefined {
	if (value instanceof Date) {
		return value;
	}
	if (isTimestamp(value)) {
		return value.toDate();
	}
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		if (!Number.isNaN(parsed.getTime())) {
			return parsed;
		}
	}
	return undefined;
}

function isTimestamp(value: unknown): value is Timestamp {
	return (
		typeof value === 'object' && value !== null && typeof (value as Timestamp).toDate === 'function'
	);
}

function extractPerfil(data: SnapshotData): Record<string, unknown> {
	return isRecord(data.perfil) ? data.perfil : {};
}

function buildBaseUsuario(snapshot: DocumentSnapshot<SnapshotData>): Usuario | null {
	if (!snapshot.exists()) {
		return null;
	}
	const data = snapshot.data();
	if (!data) {
		return null;
	}
	const perfil = extractPerfil(data);

	const nombre = sanitizeString(data.nombre ?? perfil.nombre ?? data.displayName);
	const apellido = sanitizeString(data.apellido ?? perfil.apellido);
	const estado = sanitizeString(data.estado, 'activo');
	const createdAt = sanitizeDate(data.createdAt ?? perfil.createdAt);
	const fechaNacimiento = sanitizeDate(data.fecha_nacimiento ?? perfil.fecha_nacimiento);

	const usuario: Usuario = {
		username: sanitizeString(
			data.username ?? data.email ?? perfil.username ?? snapshot.id,
			snapshot.id
		),
		nombre,
		apellido,
		estado,
		rol: sanitizeRol(data.rol ?? perfil.rol),
		url_foto: sanitizeString(
			data.url_foto ?? data.photoURL ?? perfil.url_foto ?? perfil.photoURL ?? ''
		),
		contactos: sanitizeArray<Contacto>(data.contactos ?? perfil.contactos),
		direccion: (isRecord(data.direccion ?? perfil.direccion)
			? (data.direccion ?? perfil.direccion)
			: undefined) as Direccion | undefined,
		categorias_preferidas: sanitizeArray<Categoria>(perfil.categorias_preferidas),
		tipos_participacion_preferidas: sanitizeArray(perfil.tipos_participacion_preferidas),
		consentimientos: sanitizeArray(perfil.consentimientos),
		created_at: createdAt,
		fecha_nacimiento: fechaNacimiento,
		estado_verificacion: sanitizeString(perfil.estado_verificacion ?? data.estado_verificacion)
	};

	return usuario;
}

export function mapUsuario(snapshot: DocumentSnapshot<SnapshotData>): Usuario | null {
	return buildBaseUsuario(snapshot);
}

export function mapColaborador(snapshot: DocumentSnapshot<SnapshotData>): Colaborador | null {
	const base = buildBaseUsuario(snapshot);
	if (!base) {
		return null;
	}
	const data = snapshot.data() ?? ({} as SnapshotData);
	const perfil = extractPerfil(data);
	return {
		...base,
		rol: 'colaborador',
		tipo_colaborador: sanitizeString(perfil.tipo_colaborador ?? data.tipo_colaborador)
	};
}

export function mapInstitucion(snapshot: DocumentSnapshot<SnapshotData>): Institucion | null {
	const base = buildBaseUsuario(snapshot);
	if (!base) {
		return null;
	}
	const data = snapshot.data() ?? ({} as SnapshotData);
	const perfil = extractPerfil(data);
	return {
		...base,
		rol: 'institucion',
		nombre_legal: sanitizeString(perfil.nombre_legal ?? data.nombre_legal ?? base.nombre),
		tipo_institucion: sanitizeString(perfil.tipo_institucion ?? data.tipo_institucion)
	};
}
