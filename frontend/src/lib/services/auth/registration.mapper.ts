// * DECISIÓN DE DISEÑO: esta capa traduce los formularios de registro en los inputs esperados por authStore,
// * evitando dependencias directas de la UI con Firebase y habilitando pruebas unitarias.

/**
 * TODOS:
 * - [ ] Agregar inputs a auth.
*/

import type { Contacto } from '$lib/types/Contacto';
import type {
        ColaboradorFormSubmitDetail,
        InstitucionFormSubmitDetail,
        RegistroCuentaSubmitDetail
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

function normalizarDetalleColaborador(
        detail: ColaboradorFormSubmitDetail | RegistroCuentaSubmitDetail
): ColaboradorFormSubmitDetail {
        if ('rol' in detail) {
                if (detail.rol !== 'colaborador') {
                        throw new Error('El detalle recibido no corresponde a un colaborador.');
                }
                return {
                        colaborador: detail.payload.colaborador,
                        organizacion: detail.payload.organizacion,
                        archivoFoto: detail.archivoFoto
                };
        }
        return detail;
}

function normalizarDetalleInstitucion(
        detail: InstitucionFormSubmitDetail | RegistroCuentaSubmitDetail
): InstitucionFormSubmitDetail {
        if ('rol' in detail) {
                if (detail.rol !== 'institucion') {
                        throw new Error('El detalle recibido no corresponde a una institución.');
                }
                return {
                        institucion: detail.payload.institucion,
                        archivoFoto: detail.archivoFoto
                };
        }
        return detail;
}

export function mapColaboradorFormToRegisterInput(
        detail: ColaboradorFormSubmitDetail | RegistroCuentaSubmitDetail
): RegistroMapeado<RegisterColaboradorInput> {
        const normalizado = normalizarDetalleColaborador(detail);
        const contactos = clonarContactos(normalizado.colaborador.contactos);
        const email = obtenerEmailPrincipal(contactos);
        if (!email) {
                throw new Error('No pudimos identificar un correo electrónico principal válido.');
        }

        const metadata = construirMetadata({
                organizacion:
                        normalizado.colaborador.tipo_colaborador === 'organizacion'
                                ? {
                                          razon_social: sanitizeString(normalizado.organizacion.razon_social),
                                          con_fines_de_lucro: normalizado.organizacion.con_fines_de_lucro
                                  }
                                : undefined,
                fotoPerfilPendiente: normalizado.archivoFoto ? true : undefined
        });

        const input: RegisterColaboradorInput = {
                email: normalizarEmail(email),
                password: normalizado.colaborador.password,
                perfil: {
                        username: sanitizeString(normalizado.colaborador.username),
                        nombre: sanitizeString(normalizado.colaborador.nombre),
                        apellido: sanitizeString(normalizado.colaborador.apellido),
                        fecha_nacimiento: normalizado.colaborador.fecha_nacimiento,
                        url_foto: sanitizeString(normalizado.colaborador.url_foto),
                        contactos,
                        tipo_colaborador: normalizado.colaborador.tipo_colaborador
                },
                metadata
        };

        return {
                input,
                emailPrincipal: email
        };
}

export function mapInstitucionFormToRegisterInput(
        detail: InstitucionFormSubmitDetail | RegistroCuentaSubmitDetail
): RegistroMapeado<RegisterInstitucionInput> {
        const normalizado = normalizarDetalleInstitucion(detail);
        const contactos = clonarContactos(normalizado.institucion.contactos);
        const email = obtenerEmailPrincipal(contactos);
        if (!email) {
                throw new Error('No pudimos identificar un correo electrónico principal válido.');
        }

        const metadata = construirMetadata({
                fotoPerfilPendiente: normalizado.archivoFoto ? true : undefined
        });

        const tipoInstitucion =
                sanitizeOptionalString(normalizado.institucion.tipo_institucion) ?? 'otro';
        const input: RegisterInstitucionInput = {
                email: normalizarEmail(email),
                password: normalizado.institucion.password,
                perfil: {
                        username: sanitizeString(normalizado.institucion.username),
                        nombre: sanitizeString(normalizado.institucion.nombre),
                        apellido: sanitizeString(normalizado.institucion.apellido),
                        fecha_nacimiento: normalizado.institucion.fecha_nacimiento,
                        url_foto: sanitizeString(normalizado.institucion.url_foto),
                        contactos,
                        nombre_legal:
                                sanitizeOptionalString(normalizado.institucion.nombre_legal) ??
                                sanitizeString(normalizado.institucion.nombre),
                        tipo_institucion: tipoInstitucion
                },
                metadata
        };

        return {
                input,
                emailPrincipal: email
        };
}               