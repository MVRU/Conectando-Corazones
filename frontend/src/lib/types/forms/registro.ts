// * DECISIÓN DE DISEÑO: centralizamos los tipos de forms para evitar duplicar definiciones entre componentes y servicios,
// * garantizando coherencia en validaciones y facilitando futuras integraciones con el backend.

import type { Contacto } from '$lib/types/Contacto';
import type { Colaborador, Institucion, Organizacion, Usuario } from '$lib/types/Usuario';

export type ColaboradorFormData =
        Pick<Usuario, 'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto'> & {
                password: string;
                passwordConfirm: string;
                contactos: Contacto[];
        } & Pick<Colaborador, 'tipo_colaborador'>;

export type OrganizacionFormData = Pick<Organizacion, 'razon_social'> & {
        con_fines_de_lucro: boolean | null;
};

export interface ColaboradorFormSubmitDetail {
        colaborador: ColaboradorFormData;
        organizacion: OrganizacionFormData;
        archivoFoto: File | null;
}

export type InstitucionFormData =
        Pick<Usuario, 'username' | 'nombre' | 'apellido' | 'fecha_nacimiento' | 'url_foto'> & {
                password: string;
                passwordConfirm: string;
                contactos: Contacto[];
        } & Pick<Institucion, 'nombre_legal' | 'tipo_institucion'>;

export interface InstitucionFormSubmitDetail {
        institucion: InstitucionFormData;
        archivoFoto: File | null;
}
