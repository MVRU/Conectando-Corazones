import type { ArchivoRepository } from '../repositories/ArchivoRepository';

export class EliminarArchivo {
	constructor(private archivoRepo: ArchivoRepository) {}

	async execute(archivoId: number, usuarioSolicitanteId: number): Promise<void> {
		const archivo = await this.archivoRepo.findById(archivoId);

		if (!archivo) {
			throw new Error('El archivo no existe.');
		}

		if (archivo.usuario_id !== usuarioSolicitanteId) {
			throw new Error('No tenés permisos para eliminar este archivo. Solo el dueño puede hacerlo.');
		}

		// TODO: acá debería ir la lógica para borrar de Supabase Storage también,
		// pero como el contrato dice que el backend maneja los metadatos,
		// asumimos que quien llama a esto (controller) orquestará o este método deberá extenderse
		// con un StorageService en infraestructura.
		// Por ahora cumplimos la regla de negocio de la DB.

		await this.archivoRepo.delete(archivoId);
	}
}
