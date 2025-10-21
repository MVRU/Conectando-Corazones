import type { Direccion } from '$lib/types/Direccion';
import type { Contacto } from '$lib/types/Contacto';

// Tipo específico para el formulario de edición de perfil
export interface EditarPerfilForm {
    nombre: string;
    apellido: string;
    url_foto: string;
    contactos: Contacto[];
    direccion: DireccionFormulario;
}

// Tipo para la dirección en el formulario (simplificado para formularios)
export interface DireccionFormulario {
	calle: string;
	numero: string;
	piso: string;
	departamento: string;
	referencia: string;
	idProvincia: string;
	idLocalidad: string;
}

// Función helper para crear un formulario vacío
export function crearFormularioVacio(): EditarPerfilForm {
	return {
        nombre: '',
        apellido: '',
        url_foto: '',
        contactos: [],
		direccion: {
			calle: '',
			numero: '',
			piso: '',
			departamento: '',
			referencia: '',
			idProvincia: '',
			idLocalidad: ''
		}
	};
}
