import { Usuario } from '$lib/domain/entities/Usuario';
import type {
	Usuario as PrismaUsuario,
	Localidad as PrismaLocalidad,
	Provincia as PrismaProvincia,
	Contacto as PrismaContacto,
	Categoria as PrismaCategoria,
	TipoParticipacion as PrismaTipoParticipacion,
	Consentimiento as PrismaConsentimiento
} from '@prisma/client';
import { Categoria } from '$lib/domain/entities/Categoria';
import { TipoParticipacion } from '$lib/domain/entities/TipoParticipacion';

type UsuarioWithRelations = PrismaUsuario & {
	localidad?: (PrismaLocalidad & { provincia?: PrismaProvincia | null }) | null;
	contactos?: PrismaContacto[];
	categorias_preferidas?: { categoria: PrismaCategoria }[];
	tipos_participacion_preferidos?: { tipo_participacion: PrismaTipoParticipacion }[];
	consentimientos?: PrismaConsentimiento[];
};

export class UsuarioMapper {
	static toDomain(prismaUsuario: UsuarioWithRelations): Usuario {
		const rolesPermitidos = ['institucion', 'colaborador', 'administrador'] as const;
		const rol = rolesPermitidos.includes(prismaUsuario.rol as any)
			? (prismaUsuario.rol as 'institucion' | 'colaborador' | 'administrador')
			: 'colaborador';

		return new Usuario({
			id_usuario: prismaUsuario.id_usuario,
			username: prismaUsuario.username,
			auth_user_id: prismaUsuario.auth_user_id || undefined,
			password: prismaUsuario.password || undefined,
			nombre: prismaUsuario.nombre,
			apellido: prismaUsuario.apellido,
			fecha_nacimiento: prismaUsuario.fecha_nacimiento || undefined,
			estado: prismaUsuario.estado,
			created_at: prismaUsuario.created_at || undefined,
			rol: rol,
			url_foto: prismaUsuario.url_foto,
			estado_verificacion: prismaUsuario.estado_verificacion || undefined,
			descripcion: prismaUsuario.descripcion || undefined,
			localidad_id: prismaUsuario.localidad_id || undefined,

			nombre_legal: prismaUsuario.nombre_legal || undefined,
			tipo_institucion: prismaUsuario.tipo_institucion || undefined,
			tipo_colaborador: prismaUsuario.tipo_colaborador || undefined,
			razon_social: prismaUsuario.razon_social || undefined,
			con_fines_de_lucro: prismaUsuario.con_fines_de_lucro || undefined,

			// Relaciones
			localidad: prismaUsuario.localidad as any, // TODO: Mapear LocalidadEntity si es necesario estricto
			contactos: prismaUsuario.contactos as any, // TODO: Mapear ContactoEntity
			categorias_preferidas: prismaUsuario.categorias_preferidas
				?.map((cp) => new Categoria(cp.categoria))
				.filter(
					(cat, index, self) => index === self.findIndex((c) => c.id_categoria === cat.id_categoria)
				),
			tipos_participacion_preferidas: prismaUsuario.tipos_participacion_preferidos
				?.map(
					(tp) =>
						new TipoParticipacion({
							...tp.tipo_participacion,
							descripcion: tp.tipo_participacion.descripcion as any
						})
				)
				.filter(
					(tipo, index, self) =>
						index === self.findIndex((t) => t.id_tipo_participacion === tipo.id_tipo_participacion)
				),
			consentimientos: prismaUsuario.consentimientos as any, // TODO: Mapear ConsentimientoEntity
			verificaciones: (prismaUsuario as any).verificaciones // Se asume que viene el objeto plano de Prisma
		});
	}
}
