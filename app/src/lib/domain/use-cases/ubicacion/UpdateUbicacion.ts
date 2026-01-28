import type {
	UbicacionRepository,
	UbicacionUpdateData
} from '$lib/domain/repositories/UbicacionRepository';
import type { Ubicacion } from '$lib/domain/entities/Ubicacion';

export interface UpdateUbicacionInput {
	id: number;
	referencia?: string;
	url_virtual?: string;
}

export class UpdateUbicacion {
	constructor(private readonly repository: UbicacionRepository) {}

	async execute(input: UpdateUbicacionInput): Promise<Ubicacion> {
		const { id, referencia, url_virtual } = input;

		if (!id || id <= 0) {
			throw new Error('El ID de la ubicación debe ser un número positivo');
		}

		const ubicacion = await this.repository.findById(id);
		if (!ubicacion) {
			throw new Error('Ubicación no encontrada');
		}

		const estados = await this.repository.getEstadosProyectosAsociados(id);
		if (!estados.includes('en_curso')) {
			throw new Error('Solo se pueden editar ubicaciones de proyectos que estén "en curso"');
		}

		const updateData: UbicacionUpdateData = {};

		if (referencia !== undefined) {
			if (!ubicacion.puedeEditarReferencia()) {
				throw new Error('Solo se puede editar la referencia en ubicaciones presenciales');
			}

			const ref = referencia.trim();
			if (ref.length > 200) {
				throw new Error('La referencia no puede superar los 200 caracteres');
			}

			updateData.referencia = ref;
		}

		if (url_virtual !== undefined) {
			if (!ubicacion.puedeEditarUrlVirtual()) {
				throw new Error('Solo se puede editar la URL virtual en ubicaciones virtuales');
			}

			const url = url_virtual.trim();
			if (url.length > 0) {
				try {
					const parsedUrl = new URL(url);
					if (parsedUrl.protocol !== 'https:') {
						throw new Error('La URL virtual debe utilizar el protocolo seguro HTTPS');
					}
				} catch (e) {
					if (e instanceof Error && e.message.includes('HTTPS')) {
						throw e;
					}
					throw new Error('La URL virtual no es válida');
				}
			}
			updateData.url_virtual = url;
		}

		if (Object.keys(updateData).length === 0) {
			throw new Error('No se proporcionaron campos para actualizar');
		}

		return this.repository.update(id, updateData);
	}
}
