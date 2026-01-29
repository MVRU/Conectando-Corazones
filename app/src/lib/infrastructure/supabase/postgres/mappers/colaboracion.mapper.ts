import type { Colaboracion as PrismaColaboracion } from '@prisma/client';
import { Colaboracion } from '$lib/domain/entities/Colaboracion';
import { UsuarioMapper } from './usuario.mapper';

export class ColaboracionMapper {
	static toDomain(
		prismaColaboracion: PrismaColaboracion & {
			colaborador?: any;
			colaboraciones_tipo_participacion?: any[];
		}
	): Colaboracion {
		return new Colaboracion({
			id_colaboracion: prismaColaboracion.id_colaboracion,
			estado: prismaColaboracion.estado as 'pendiente' | 'aprobada' | 'rechazada' | 'anulada',
			justificacion: prismaColaboracion.justificacion ?? undefined,
			created_at: prismaColaboracion.created_at ?? undefined,
			mensaje: prismaColaboracion.mensaje ?? undefined,
			proyecto_id: prismaColaboracion.proyecto_id ?? undefined,
			colaborador_id: prismaColaboracion.colaborador_id ?? undefined,
			colaborador: prismaColaboracion.colaborador
				? UsuarioMapper.toDomain(prismaColaboracion.colaborador)
				: undefined
		});
	}

	static toPrisma(colaboracion: Colaboracion): any {
		return {
			estado: colaboracion.estado,
			justificacion: colaboracion.justificacion ?? null,
			mensaje: colaboracion.mensaje ?? null,
			proyecto_id: colaboracion.proyecto_id ?? null,
			colaborador_id: colaboracion.colaborador_id ?? null,
			created_at: colaboracion.created_at ?? new Date()
		};
	}
}
