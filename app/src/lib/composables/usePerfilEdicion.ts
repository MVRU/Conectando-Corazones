import { writable, derived, get } from 'svelte/store';
import type { EditarPerfilForm } from '$lib/domain/types/forms/EditarPerfilForm';
import type {
	Usuario,
	Institucion,
	Organizacion,
	Unipersonal,
	Administrador
} from '$lib/domain/types/Usuario';
import type { Localidad } from '$lib/domain/types/Localidad';
import { validarDescripcionProyecto } from '$lib/utils/util-proyecto-form';
import { perfilService } from '$lib/services/perfilService';

type UsuarioCompleto = Usuario | Institucion | Organizacion | Unipersonal | Administrador;

export function usePerfilEdicion() {
	// Estado del formulario
	const datosEdicion = writable<EditarPerfilForm>({
		nombre: '',
		apellido: '',
		url_foto: '',
		descripcion: '',
		contactos: []
	});

	const errorDescripcion = writable<string | null>(null);

	const provinciaSeleccionada = writable<number | undefined>(undefined);

	const localidadesFiltradas = derived(provinciaSeleccionada, ($provinciaSeleccionada) =>
		perfilService.obtenerLocalidadesPorProvincia($provinciaSeleccionada)
	);

	function inicializar(perfilUsuario: UsuarioCompleto): void {
		datosEdicion.set({
			nombre: perfilUsuario.nombre || '',
			apellido: perfilUsuario.apellido || '',
			url_foto: perfilUsuario.url_foto || '',
			descripcion: perfilUsuario.descripcion || '',
			contactos: perfilUsuario.contactos ?? [],
			localidad_id: perfilUsuario.localidad_id
		});

		// Inicializar provincia seleccionada si existe localidad
		if (perfilUsuario.localidad?.id_provincia !== undefined) {
			provinciaSeleccionada.set(perfilUsuario.localidad.id_provincia);
		} else {
			provinciaSeleccionada.set(undefined);
		}

		errorDescripcion.set(null);
	}

	function validarDescripcion(descripcion: string): string | null {
		if (!descripcion || descripcion.trim().length === 0) {
			return null;
		}
		return validarDescripcionProyecto(descripcion, { min: 0, max: 500 });
	}

	function actualizarDescripcion(descripcion: string): void {
		datosEdicion.update((d) => ({ ...d, descripcion }));
		const error = validarDescripcion(descripcion);
		errorDescripcion.set(error);
	}

	function cambiarProvincia(idProvincia: number | undefined): void {
		provinciaSeleccionada.set(idProvincia);
		// Resetear localidad al cambiar provincia
		datosEdicion.update((d) => ({ ...d, localidad_id: undefined }));
	}

	function cambiarFoto(event: Event): boolean {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return false;

		const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!tiposPermitidos.includes(file.type)) {
			alert('Por favor selecciona un archivo JPG, PNG o GIF válido.');
			return false;
		}

		const maxSize = 5 * 1024 * 1024; // 5MB en bytes
		if (file.size > maxSize) {
			alert('El archivo es demasiado grande. Máximo 5MB.');
			return false;
		}

		const urlFoto = URL.createObjectURL(file);
		datosEdicion.update((d) => ({ ...d, url_foto: urlFoto }));

		return true;
	}

	function prepararDatosParaGuardar(): {
		valido: boolean;
		datos?: EditarPerfilForm & { localidad?: Localidad };
		error?: string;
	} {
		const datos = get(datosEdicion);

		// Validar descripción antes de guardar
		if (datos.descripcion && datos.descripcion.trim().length > 0) {
			const error = validarDescripcion(datos.descripcion);
			if (error) {
				errorDescripcion.set(error);
				return { valido: false, error };
			}
		}

		// Buscar localidad expandida si existe localidad_id
		const localidadExpandida = perfilService.obtenerLocalidadPorId(datos.localidad_id);

		// Retornar datos validados y preparados
		return {
			valido: true,
			datos: {
				...datos,
				localidad: localidadExpandida
			}
		};
	}

	/**
	 * Resetea el formulario a su estado inicial
	 */
	function reset(): void {
		datosEdicion.set({
			nombre: '',
			apellido: '',
			url_foto: '',
			descripcion: '',
			contactos: []
		});
		errorDescripcion.set(null);
		provinciaSeleccionada.set(undefined);
	}

	return {
		datosEdicion,
		provinciaSeleccionada,

		errorDescripcion: { subscribe: errorDescripcion.subscribe },
		localidadesFiltradas: { subscribe: localidadesFiltradas.subscribe },

		datos: { subscribe: datosEdicion.subscribe },

		// Acciones
		inicializar,
		validarDescripcion,
		actualizarDescripcion,
		cambiarProvincia,
		cambiarFoto,
		prepararDatosParaGuardar,
		reset,

		actualizarCampo: <K extends keyof EditarPerfilForm>(campo: K, valor: EditarPerfilForm[K]) => {
			datosEdicion.update((d) => ({ ...d, [campo]: valor }));
		}
	};
}
