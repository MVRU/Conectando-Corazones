import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import type { Usuario } from '$lib/domain/entities/Usuario';

export class ActualizarUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(id: number, cambios: Partial<Usuario>): Promise<Usuario> {
		const usuarioExistente = await this.usuarioRepository.findById(id);
		if (!usuarioExistente) {
			throw new Error('Usuario no encontrado');
		}

		// TODO (Marina Milo): Validar disponibilidad de username/email si cambiaron (RN 1.1)
		// TODO (Marina Milo): No permitir modificar campos sensibles como estado_verificacion

		// Evitar cambios en el rol
		if (cambios.rol && cambios.rol !== usuarioExistente.rol) {
			throw new Error('No se permite cambiar el rol del usuario.');
		}

		// Campos requeridos
		if (cambios.nombre) usuarioExistente.nombre = cambios.nombre;
		if (cambios.apellido) usuarioExistente.apellido = cambios.apellido;
		if (cambios.url_foto) usuarioExistente.url_foto = cambios.url_foto;

		// Campos opcionales
		if (cambios.fecha_nacimiento !== undefined)
			usuarioExistente.fecha_nacimiento = cambios.fecha_nacimiento
				? new Date(cambios.fecha_nacimiento)
				: undefined;
		if (cambios.descripcion !== undefined)
			usuarioExistente.descripcion = cambios.descripcion || undefined;
		if (cambios.localidad_id !== undefined)
			usuarioExistente.localidad_id = cambios.localidad_id ?? undefined;

		// Relaciones y preferencias
		if (cambios.contactos) usuarioExistente.contactos = cambios.contactos;
		if (cambios.categorias_preferidas)
			usuarioExistente.categorias_preferidas = cambios.categorias_preferidas;
		if (cambios.tipos_participacion_preferidas)
			usuarioExistente.tipos_participacion_preferidas = cambios.tipos_participacion_preferidas;

		// Campos específicos opcionales
		if (cambios.nombre_legal !== undefined)
			usuarioExistente.nombre_legal = cambios.nombre_legal || '';
		if (cambios.tipo_institucion !== undefined)
			usuarioExistente.tipo_institucion = cambios.tipo_institucion || '';
		if (cambios.tipo_colaborador !== undefined)
			usuarioExistente.tipo_colaborador = cambios.tipo_colaborador || '';
		if (cambios.razon_social !== undefined)
			usuarioExistente.razon_social = cambios.razon_social || '';
		if (cambios.con_fines_de_lucro !== undefined)
			usuarioExistente.con_fines_de_lucro = cambios.con_fines_de_lucro;

		// Validar invariantes nuevamente
		usuarioExistente.validarInvariantes();

		return await this.usuarioRepository.update(usuarioExistente);
	}
}
