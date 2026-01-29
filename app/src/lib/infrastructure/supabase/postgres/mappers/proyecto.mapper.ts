import type { Proyecto as PrismaProyecto } from '@prisma/client';
import { Proyecto } from '$lib/domain/entities/Proyecto';
import { EstadoMapper } from './estado.mapper';
import { CategoriaMapper } from './categoria.mapper';
import { ParticipacionPermitidaMapper } from './participacion-permitida.mapper';
import { mapUbicacionToDomain } from './ubicacion.mapper';
import type { UbicacionDisyuncion } from '$lib/domain/types/Ubicacion';
import { UsuarioMapper } from './usuario.mapper';
import { ColaboracionMapper } from './colaboracion.mapper';

export class ProyectoMapper {
	static toDomain(
		prismaProyecto: PrismaProyecto & {
			estado?: any;
			proyecto_categorias?: any[];
			participacion_permitida?: any[];
			proyecto_ubicaciones?: any[];
			institucion?: any;
			colaboraciones?: any[];
		}
	): Proyecto {
		return new Proyecto({
			id_proyecto: prismaProyecto.id_proyecto,
			titulo: prismaProyecto.titulo,
			descripcion: prismaProyecto.descripcion,
			resumen: prismaProyecto.resumen ?? undefined,
			aprendizajes: prismaProyecto.aprendizajes ?? undefined,
			url_portada: prismaProyecto.url_portada ?? undefined,
			created_at: prismaProyecto.created_at,
			updated_at: prismaProyecto.updated_at,
			fecha_cierre_postulaciones: prismaProyecto.fecha_cierre_postulaciones,
			fecha_fin_tentativa: prismaProyecto.fecha_fin_tentativa,
			beneficiarios: prismaProyecto.beneficiarios
				? Number(prismaProyecto.beneficiarios)
				: undefined,
			id_chat_firebase: prismaProyecto.id_chat_firebase,
			estado_id: prismaProyecto.estado_id ?? undefined,
			institucion_id: prismaProyecto.institucion_id,

			// Relaciones
			estado_obj: prismaProyecto.estado ? EstadoMapper.toDomain(prismaProyecto.estado) : undefined,

			estado: prismaProyecto.estado?.descripcion, // String para compatibilidad

			categorias: prismaProyecto.proyecto_categorias
				? prismaProyecto.proyecto_categorias
						.map((pc: any) => (pc.categoria ? CategoriaMapper.toDomain(pc.categoria) : null))
						.filter((c) => c !== null)
				: [],

			participacion_permitida: prismaProyecto.participacion_permitida
				? prismaProyecto.participacion_permitida
						.map((pp: any) => (pp ? ParticipacionPermitidaMapper.toDomain(pp) : null))
						.filter((p) => p !== null)
				: [],

			ubicaciones: prismaProyecto.proyecto_ubicaciones
				? prismaProyecto.proyecto_ubicaciones
						.map((pu: any) =>
							pu
								? {
										id_proyecto_ubicacion: pu.id_proyecto_ubicacion,
										proyecto_id: pu.proyecto_id,
										ubicacion_id: pu.ubicacion_id,
										ubicacion: pu.ubicacion
											? (mapUbicacionToDomain(pu.ubicacion) as unknown as UbicacionDisyuncion)
											: undefined
									}
								: null
						)
						.filter((u) => u !== null)
				: [],

			institucion: prismaProyecto.institucion
				? UsuarioMapper.toDomain(prismaProyecto.institucion)
				: undefined,

			colaboraciones: prismaProyecto.colaboraciones
				? prismaProyecto.colaboraciones
						.map((c: any) => (c ? ColaboracionMapper.toDomain(c) : null))
						.filter((c) => c !== null)
				: []
		});
	}
}
