import { json } from '@sveltejs/kit';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { ListarParticipacionesPorProyecto } from '$lib/domain/use-cases/participaciones-permitidas/ListarParticipacionesPorProyecto';
import { GuardarParticipacionPermitida } from '$lib/domain/use-cases/participaciones-permitidas/GuardarParticipacionPermitida';
import { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';

const repo = new PostgresParticipacionPermitidaRepository();

export async function GET({ params }) {
	const id_proyecto = parseInt(params.id_proyecto);
	if (isNaN(id_proyecto)) return json({ error: 'ID de proyecto no válido' }, { status: 400 });

	const useCase = new ListarParticipacionesPorProyecto(repo);
	const participaciones = await useCase.execute(id_proyecto);
	return json(participaciones);
}

export async function POST({ params, request }) {
	const id_proyecto = parseInt(params.id_proyecto);
	if (isNaN(id_proyecto)) return json({ error: 'ID de proyecto no válido' }, { status: 400 });

	try {
		const data = await request.json();
		const participacion = new ParticipacionPermitida({
			...data,
			id_proyecto
		});

		const useCase = new GuardarParticipacionPermitida(repo);
		const created = await useCase.execute(participacion);
		return json(created, { status: 201 });
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
}
