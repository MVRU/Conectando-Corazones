import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { Usuario } from '$lib/domain/entities/Usuario';

export class ActualizarUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number, cambios: Partial<Usuario>): Promise<Usuario> {
		const usuarioExistente = await this.usuarioRepository.findById(id);
		if (!usuarioExistente) {
			throw new Error('Usuario no encontrado');
		}

		// Evitar cambios en el rol
		if (cambios.rol && cambios.rol !== usuarioExistente.rol) {
			throw new Error('No se permite cambiar el rol del usuario.');
		}

		// Actualizamos campos permitidos en la entidad existente
		if (cambios.nombre) usuarioExistente.nombre = cambios.nombre;
		if (cambios.apellido) usuarioExistente.apellido = cambios.apellido;
		if (cambios.fecha_nacimiento)
			usuarioExistente.fecha_nacimiento = new Date(cambios.fecha_nacimiento);
		if (cambios.descripcion) usuarioExistente.descripcion = cambios.descripcion;
		if (cambios.localidad_id) usuarioExistente.localidad_id = cambios.localidad_id;
		if (cambios.url_foto) usuarioExistente.url_foto = cambios.url_foto;

		// Relaciones y preferencias
		if (cambios.contactos) usuarioExistente.contactos = cambios.contactos;
		if (cambios.categorias_preferidas)
			usuarioExistente.categorias_preferidas = cambios.categorias_preferidas;
		if (cambios.tipos_participacion_preferidas)
			usuarioExistente.tipos_participacion_preferidas = cambios.tipos_participacion_preferidas;

		// Campos específicos
		if (cambios.nombre_legal) usuarioExistente.nombre_legal = cambios.nombre_legal;
		if (cambios.tipo_institucion) usuarioExistente.tipo_institucion = cambios.tipo_institucion;
		if (cambios.tipo_colaborador) usuarioExistente.tipo_colaborador = cambios.tipo_colaborador;
		if (cambios.razon_social) usuarioExistente.razon_social = cambios.razon_social;
		if (cambios.con_fines_de_lucro !== undefined)
			usuarioExistente.con_fines_de_lucro = cambios.con_fines_de_lucro;

		// Validar invariantes nuevamente
		usuarioExistente.validarInvariantes();

		return await this.usuarioRepository.update(usuarioExistente);
	}
}
