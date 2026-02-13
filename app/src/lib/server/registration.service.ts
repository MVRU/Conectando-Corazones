import { supabaseAdmin } from '$lib/infrastructure/supabase/admin-client';
import { PostgresUsuarioRepository } from '$lib/infrastructure/supabase/postgres/usuario.repo';
import { CrearUsuario } from '$lib/domain/use-cases/usuarios/CrearUsuario';
import type { Contacto } from '$lib/domain/types/Contacto';

export interface RegistroInput {
	email: string;
	password: string;
	rol: 'colaborador' | 'institucion';
	perfil: {
		username: string;
		nombre: string;
		apellido: string;
		fecha_nacimiento?: string | null;
		url_foto?: string;
		contactos: Contacto[];

		// Campos específicos
		tipo_colaborador?: string;
		nombre_legal?: string;
		tipo_institucion?: string;
	};
	metadata?: {
		organizacion?: {
			razon_social?: string;
			con_fines_de_lucro?: '' | 'true' | 'false';
		};
		[key: string]: any;
	};
}

export class RegistrationService {
	private usuarioRepo: PostgresUsuarioRepository;
	private crearUsuarioUseCase: CrearUsuario;

	constructor() {
		this.usuarioRepo = new PostgresUsuarioRepository();
		this.crearUsuarioUseCase = new CrearUsuario(this.usuarioRepo);
	}

	async registrar(input: RegistroInput) {
		let authUserId: string | null = null;

		try {
			// 1. Crear usuario en Supabase Auth
			const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
				email: input.email,
				password: input.password,
				email_confirm: true,
				user_metadata: {
					username: input.perfil.username,
					nombre: input.perfil.nombre,
					apellido: input.perfil.apellido,
					rol: input.rol
				}
			});

			if (authError) {
				console.error('Error creando usuario en Supabase Auth:', authError);
				throw new Error(`Error Auth: ${authError.message}`);
			}

			if (!authData.user) {
				throw new Error('No se pudo crear el usuario en Auth (respuesta vacía)');
			}

			authUserId = authData.user.id;

			// 2. Crear usuario en Base de Datos Local
			// Asegurar que el email esté en contactos
			const contactos = [...input.perfil.contactos];
			if (!contactos.some((c) => c.tipo_contacto === 'email' && c.valor === input.email)) {
				contactos.push({
					tipo_contacto: 'email',
					valor: input.email,
					etiqueta: 'Principal'
				});
			}

			const usuarioCreado = await this.crearUsuarioUseCase.execute({
				username: input.perfil.username,
				auth_user_id: authUserId,
				password: input.password,

				nombre: input.perfil.nombre,
				apellido: input.perfil.apellido,
				fecha_nacimiento: input.perfil.fecha_nacimiento
					? new Date(input.perfil.fecha_nacimiento)
					: undefined,
				estado: 'activo',
				rol: input.rol,
				url_foto: input.perfil.url_foto ?? '',
				contactos: contactos,

				// Específicos Colaborador
				tipo_colaborador: input.perfil.tipo_colaborador,
				razon_social: input.metadata?.organizacion?.razon_social,
				con_fines_de_lucro: input.metadata?.organizacion?.con_fines_de_lucro === 'true',

				// Específicos Institución
				nombre_legal: input.perfil.nombre_legal,
				tipo_institucion: input.perfil.tipo_institucion
			});

			// Eliminar password del objeto retornado
			const { password: _, ...usuarioSafe } = usuarioCreado;

			return usuarioSafe;
		} catch (error) {
			console.error('Error en servicio de registro:', error);

			// Rollback: Si se creó en Auth pero falló en DB, borrar de Auth
			if (authUserId) {
				console.warn(`Realizando rollback de usuario Auth ${authUserId}...`);
				await supabaseAdmin.auth.admin
					.deleteUser(authUserId)
					.catch((e) => console.error('CRÍTICO: Falló el rollback en Auth:', e));
			}

			throw error;
		}
	}
}
