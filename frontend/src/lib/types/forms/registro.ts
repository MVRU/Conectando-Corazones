// * DECISIÓN DE DISEÑO: se consolidan los tipos del registro en estructuras reutilizables y documentamos riesgos de compatibilidad con el backend, evitando duplicidades al mapear eventos discriminados por rol

import type { Contacto } from '$lib/types/Contacto';
import type { Colaborador, Institucion, Organizacion, Usuario } from '$lib/types/Usuario';
import type { RegistroRol } from '$lib/services/auth/registration-flow';

export type RegistroCredencialesBase = Pick<
        Usuario,
        'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto'
> & {
        password: string;
        passwordConfirm: string;
        contactos: Contacto[];
};

export type ColaboradorFormData = RegistroCredencialesBase & Pick<Colaborador, 'tipo_colaborador'>;

export type OrganizacionFormData = Pick<Organizacion, 'razon_social'> & {
        con_fines_de_lucro: boolean | null;
};

export type InstitucionFormData = RegistroCredencialesBase & Pick<Institucion, 'nombre_legal' | 'tipo_institucion'>;

export interface ColaboradorFormSubmitDetail {
        colaborador: ColaboradorFormData;
        organizacion: OrganizacionFormData;
        archivoFoto: File | null;
}

export interface InstitucionFormSubmitDetail {
        institucion: InstitucionFormData;
        archivoFoto: File | null;
}

export type RegistroCuentaRol = RegistroRol;

export type RegistroCuentaSubmitDetail =
| {
                rol: 'colaborador';
                payload: Pick<ColaboradorFormSubmitDetail, 'colaborador' | 'organizacion'>;
                archivoFoto: File | null;
        }
| {
                rol: 'institucion';
                payload: Pick<InstitucionFormSubmitDetail, 'institucion'>;
                archivoFoto: File | null;
        };
