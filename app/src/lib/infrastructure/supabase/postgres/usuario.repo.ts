import type { UsuarioRepository } from '$lib/domain/repositories/UsuarioRepository';
import { Usuario } from '$lib/domain/entities/Usuario';
import { prisma } from '$lib/infrastructure/prisma/client';
import { UsuarioMapper } from './mappers/usuario.mapper';

export class PostgresUsuarioRepository implements UsuarioRepository {
	private includeOptions = {
		localidad: { include: { provincia: true } },
		contactos: true,
		categorias_preferidas: { include: { categoria: true } },
		tipos_participacion_preferidos: { include: { tipo_participacion: true } },
		consentimientos: true
	};

	async findById(id: number): Promise<Usuario | null> {
		const usuario = await prisma.usuario.findUnique({
			where: { id_usuario: id },
			include: this.includeOptions
		});

		if (!usuario) return null;
		return UsuarioMapper.toDomain(usuario);
	}

	async findByUsername(username: string): Promise<Usuario | null> {
		const usuario = await prisma.usuario.findUnique({
			where: { username },
			include: this.includeOptions
		});

		if (!usuario) return null;
		return UsuarioMapper.toDomain(usuario);
	}

	async create(usuario: Usuario): Promise<Usuario> {
		const created = await prisma.usuario.create({
			data: {
				username: usuario.username,
				password: usuario.password,
				nombre: usuario.nombre,
				apellido: usuario.apellido,
				fecha_nacimiento: usuario.fecha_nacimiento,
				estado: usuario.estado,
				rol: usuario.rol,
				url_foto: usuario.url_foto,
				estado_verificacion: usuario.estado_verificacion,
				descripcion: usuario.descripcion,
				localidad_id: usuario.localidad_id,
				// Propiedades específicas
				nombre_legal: usuario.nombre_legal || null,
				tipo_institucion: usuario.tipo_institucion || null,
				tipo_colaborador: usuario.tipo_colaborador || null,
				razon_social: usuario.razon_social || null,
				con_fines_de_lucro: usuario.con_fines_de_lucro
			},
			include: this.includeOptions
		});
		return UsuarioMapper.toDomain(created);
	}

	async update(usuario: Usuario): Promise<Usuario> {
		if (!usuario.id_usuario) throw new Error('ID requerido para actualizar');

		const updated = await prisma.usuario.update({
			where: { id_usuario: usuario.id_usuario },
			data: {
				nombre: usuario.nombre,
				apellido: usuario.apellido,
				fecha_nacimiento: usuario.fecha_nacimiento,
				url_foto: usuario.url_foto,
				descripcion: usuario.descripcion,
				localidad_id: usuario.localidad_id,
				// Propiedades específicas
				nombre_legal: usuario.nombre_legal || null,
				tipo_institucion: usuario.tipo_institucion || null,
				tipo_colaborador: usuario.tipo_colaborador || null,
				razon_social: usuario.razon_social || null,
				con_fines_de_lucro: usuario.con_fines_de_lucro
			},
			include: this.includeOptions
		});
		return UsuarioMapper.toDomain(updated);
	}
}
