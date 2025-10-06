// * DECISIÓN DE DISEÑO: esta capa traduce los formularios de registro en los inputs esperados por authStore,
// * evitando dependencias directas de la UI con Firebase y habilitando pruebas unitarias.

/**
 * TODOS:
 * - [ ] Agregar inputs a auth.
        */

import type { Contacto } from '$lib/types/Contacto';
import type {
        ColaboradorFormSubmitDetail,
        InstitucionFormSubmitDetail
} from '$lib/types/forms/registro';
import type {
        RegisterColaboradorInput,
        RegisterInstitucionInput
} from '$lib/stores/auth';

interface RegistroMapeado<TInput> {
        input: TInput;
        emailPrincipal: string;
}

function sanitizeString(value: unknown): string {
        return typeof value === 'string' ? value.trim() : '';
}

function sanitizeOptionalString(value: unknown): string | undefined {
        const trimmed = sanitizeString(value);
        return trimmed.length > 0 ? trimmed : undefined;
}

function normalizarEmail(email: string): string {
        return sanitizeString(email).toLowerCase();
}

function clonarContactos(contactos: Contacto[] = []): Contacto[] {
        return contactos.map((contacto) => ({ ...contacto }));
}

function obtenerEmailPrincipal(contactos: Contacto[]): string | null {
        for (const contacto of contactos) {
                if (!contacto) continue;
                const valor = sanitizeString(contacto.valor);
                if (!valor) continue;
                const tipo = sanitizeString(contacto.tipo_contacto || 'email').toLowerCase();
                const etiqueta = sanitizeString(contacto.etiqueta || 'principal').toLowerCase();
                if (tipo.includes('mail') && etiqueta === 'principal') {
                        return valor.toLowerCase();
                }
        }
        return null;
}

function construirMetadata(base: Record<string, unknown>): Record<string, unknown> | undefined {
        const entries = Object.entries(base).filter(([, value]) => value !== undefined);
        if (entries.length === 0) {
                return undefined;
        }
        return Object.fromEntries(entries);
}

export function mapColaboradorFormToRegisterInput(
        detail: ColaboradorFormSubmitDetail
): RegistroMapeado<RegisterColaboradorInput> {
        const contactos = clonarContactos(detail.colaborador.contactos);
        const email = obtenerEmailPrincipal(contactos);
        if (!email) {
                throw new Error('No pudimos identificar un correo electrónico principal válido.');
        }

        const metadata = construirMetadata({
                organizacion:
                        detail.colaborador.tipo_colaborador === 'organizacion'
                                ? {
                                          razon_social: sanitizeString(detail.organizacion.razon_social),
                                          con_fines_de_lucro: detail.organizacion.con_fines_de_lucro
                                  }
                                : undefined,
                fotoPerfilPendiente: detail.archivoFoto ? true : undefined
        });

        const input: RegisterColaboradorInput = {
                email: normalizarEmail(email),
                password: detail.colaborador.password,
                perfil: {
                        username: sanitizeString(detail.colaborador.username),
                        nombre: sanitizeString(detail.colaborador.nombre),
                        apellido: sanitizeString(detail.colaborador.apellido),
                        fecha_nacimiento: detail.colaborador.fecha_nacimiento,
                        url_foto: sanitizeString(detail.colaborador.url_foto),
                        contactos,
                        tipo_colaborador: detail.colaborador.tipo_colaborador
                },
                metadata
        };

        return {
                input,
                emailPrincipal: email
        };
}

export function mapInstitucionFormToRegisterInput(
        detail: InstitucionFormSubmitDetail
): RegistroMapeado<RegisterInstitucionInput> {
        const contactos = clonarContactos(detail.institucion.contactos);
        const email = obtenerEmailPrincipal(contactos);
        if (!email) {
                throw new Error('No pudimos identificar un correo electrónico principal válido.');
        }

        const metadata = construirMetadata({
                fotoPerfilPendiente: detail.archivoFoto ? true : undefined
        });

        const tipoInstitucion = sanitizeOptionalString(detail.institucion.tipo_institucion) ?? 'otro';
        const input: RegisterInstitucionInput = {
                email: normalizarEmail(email),
                password: detail.institucion.password,
                perfil: {
                        username: sanitizeString(detail.institucion.username),
                        nombre: sanitizeString(detail.institucion.nombre),
                        apellido: sanitizeString(detail.institucion.apellido),
                        fecha_nacimiento: detail.institucion.fecha_nacimiento,
                        url_foto: sanitizeString(detail.institucion.url_foto),
                        contactos,
                        nombre_legal:
                                sanitizeOptionalString(detail.institucion.nombre_legal) ??
                                sanitizeString(detail.institucion.nombre),
                        tipo_institucion: tipoInstitucion
                },
                metadata
        };

        return {
                input,
                emailPrincipal: email
        };
}
