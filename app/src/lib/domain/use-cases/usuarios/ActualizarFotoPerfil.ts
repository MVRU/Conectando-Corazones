import { Archivo } from '../../entities/Archivo';
import type { Usuario } from '../../entities/Usuario';
import type { ArchivoRepository } from '../../repositories/ArchivoRepository';
import type { UsuarioRepository } from '../../repositories/UsuarioRepository';

export class ActualizarFotoPerfil {
	constructor(
		private usuarioRepo: UsuarioRepository,
		private archivoRepo: ArchivoRepository
	) {}

	async execute(input: {
		usuarioId: number;
		url: string;
		nombreArchivo: string;
		tipoMime: string;
		tamanio: number;
	}): Promise<Usuario> {
		const usuario = await this.usuarioRepo.findById(input.usuarioId);
		if (!usuario) {
			throw new Error('Usuario no encontrado');
		}

		// 1. Crear registro de Archivo
		const nuevoArchivo = new Archivo({
			nombre_original: input.nombreArchivo,
			url: input.url,
			tipo_mime: input.tipoMime,
			tamanio_bytes: input.tamanio,
			descripcion: 'Foto de perfil',
			usuario_id: input.usuarioId,
			created_at: new Date()
		});

		await this.archivoRepo.create(nuevoArchivo);

		// 2. Actualizar Usuario con la nueva URL
		// Mantenemos los demás datos del usuario intactos
		const usuarioActualizado = {
			...usuario,
			url_foto: input.url
		} as Usuario; // Casting necesario para asegurar tipo

		return await this.usuarioRepo.update(usuarioActualizado);
	}
}
