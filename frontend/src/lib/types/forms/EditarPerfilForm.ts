import type { Contacto } from '$lib/types/Contacto';

// Tipo específico para el formulario de edición de perfil
export interface EditarPerfilForm {
    nombre: string;
    apellido: string;
    url_foto: string;
    descripcion: string;
    contactos: Contacto[];
}


// Función helper para crear un formulario vacío
export function crearFormularioVacio(): EditarPerfilForm {
	return {
        nombre: '',
        apellido: '',
        url_foto: '',
        descripcion: '',
        contactos: []
	};
}
