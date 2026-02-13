import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import { Usuario } from '$lib/domain/entities/Usuario';
import bcrypt from 'bcryptjs';

export class CrearUsuario {
	constructor(private usuarioRepository: UsuarioRepository) {}

	async execute(usuarioData: Partial<Usuario>): Promise<Usuario> {
		const usuario = new Usuario(usuarioData);

		// Validar invariantes de dominio
		usuario.validarInvariantes();

		// Validar username
		if (usuario.username) {
			const existente = await this.usuarioRepository.findByUsername(usuario.username);
			if (existente) {
				throw new Error('El nombre de usuario ya está en uso.');
			}
		}

		// Validar email si existe en contactos
		const emailContacto = usuario.contactos?.find((c) => c.tipo_contacto === 'email');
		if (emailContacto && emailContacto.valor) {
			const emailExistente = await this.usuarioRepository.findByEmail(emailContacto.valor);
			if (emailExistente) {
				throw new Error('El correo electrónico ya está registrado.');
			}
		}

		// Hash password
		if (usuario.password) {
			const salt = await bcrypt.genSalt(10);
			usuario.password = await bcrypt.hash(usuario.password, salt);
		}

		return await this.usuarioRepository.create(usuario);
	}
}
