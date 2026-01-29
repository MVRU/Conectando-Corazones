import type { TipoParticipacion as PrismaTipoParticipacion } from '@prisma/client';
import { TipoParticipacion } from '$lib/domain/entities/TipoParticipacion';
import type { TipoParticipacionDescripcion } from '$lib/domain/types/TipoParticipacion';

export class TipoParticipacionMapper {
	static toDomain(prismaTipo: PrismaTipoParticipacion): TipoParticipacion {
		return new TipoParticipacion({
			id_tipo_participacion: prismaTipo.id_tipo_participacion,
			descripcion: prismaTipo.descripcion as TipoParticipacionDescripcion
		});
	}
}
