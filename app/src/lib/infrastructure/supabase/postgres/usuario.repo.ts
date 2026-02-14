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
		consentimientos: true,
		verificaciones: true
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

	async findByEmail(email: string): Promise<Usuario | null> {
		const usuario = await prisma.usuario.findFirst({
			where: {
				contactos: {
					some: {
						tipo_contacto: 'email',
						valor: email
					}
				}
			},
			include: this.includeOptions
		});

		if (!usuario) return null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return UsuarioMapper.toDomain(usuario as any);
	}

	/**
	 * Versión optimizada para autenticación - solo carga datos esenciales
	 * Reduce el tiempo de carga en hooks.server.ts
	 */
	async findByUsernameBasic(username: string): Promise<Usuario | null> {
		const usuario = await prisma.usuario.findUnique({
			where: { username },
			select: {
				id_usuario: true,
				username: true,
				password: true,
				nombre: true,
				apellido: true,
				fecha_nacimiento: true,
				estado: true,
				rol: true,
				url_foto: true,
				estado_verificacion: true,
				descripcion: true,
				localidad_id: true,
				nombre_legal: true,
				tipo_institucion: true,
				tipo_colaborador: true,
				razon_social: true,
				con_fines_de_lucro: true,
				// Solo relaciones mínimas necesarias para la sesión
				contactos: true,
				verificaciones: true
			}
		});

		if (!usuario) return null;
		return UsuarioMapper.toDomain(usuario as any);
	}

	async findByAuthId(authId: string): Promise<Usuario | null> {
		const usuario = await prisma.usuario.findUnique({
			where: { auth_user_id: authId },
			include: this.includeOptions
		});

		if (!usuario) return null;
		return UsuarioMapper.toDomain(usuario);
	}

	async create(usuario: Usuario): Promise<Usuario> {
		const created = await prisma.usuario.create({
			data: {
				username: usuario.username,
				auth_user_id: usuario.auth_user_id,
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
				con_fines_de_lucro: usuario.con_fines_de_lucro,
				contactos: usuario.contactos?.length
					? {
							create: usuario.contactos.map((c) => ({
								tipo_contacto: c.tipo_contacto,
								valor: c.valor,
								etiqueta: c.etiqueta
							}))
						}
					: undefined
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
				con_fines_de_lucro: usuario.con_fines_de_lucro,
				// Actualización de contactos: Reemplazar existentes con los nuevos
				contactos: usuario.contactos
					? {
							deleteMany: {}, // Borra los anteriores del usuario
							create: usuario.contactos.map((c) => ({
								tipo_contacto: c.tipo_contacto,
								valor: c.valor,
								etiqueta: c.etiqueta
							}))
						}
					: undefined,
				// Preferencias: Categorías
				categorias_preferidas: usuario.categorias_preferidas
					? {
							deleteMany: {},
							create: Array.from(
								new Map(
									usuario.categorias_preferidas
										.filter((c) => c.id_categoria !== undefined)
										.map((c) => [c.id_categoria, c])
								).values()
							).map((c) => ({
								categoria: { connect: { id_categoria: c.id_categoria } }
							}))
						}
					: undefined,
				// Preferencias: Tipos de Participación
				tipos_participacion_preferidos: usuario.tipos_participacion_preferidas
					? {
							deleteMany: {},
							create: Array.from(
								new Map(
									usuario.tipos_participacion_preferidas
										.filter((t) => t.id_tipo_participacion !== undefined)
										.map((t) => [t.id_tipo_participacion, t])
								).values()
							).map((t) => ({
								tipo_participacion: { connect: { id_tipo_participacion: t.id_tipo_participacion } }
							}))
						}
					: undefined
			},
			include: this.includeOptions
		});
		return UsuarioMapper.toDomain(updated);
	}
}
