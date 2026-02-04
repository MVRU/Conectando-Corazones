import { json } from '@sveltejs/kit';
import { PostgresParticipacionPermitidaRepository } from '$lib/infrastructure/supabase/postgres/participacion-permitida.repo';
import { ObtenerParticipacionPorId } from '$lib/domain/use-cases/participaciones-permitidas/ObtenerParticipacionPorId';
import { GuardarParticipacionPermitida } from '$lib/domain/use-cases/participaciones-permitidas/GuardarParticipacionPermitida';
import { EliminarParticipacionPermitida } from '$lib/domain/use-cases/participaciones-permitidas/EliminarParticipacionPermitida';
import { ParticipacionPermitida } from '$lib/domain/entities/ParticipacionPermitida';

const repo = new PostgresParticipacionPermitidaRepository();

export async function GET({ params }) {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	const useCase = new ObtenerParticipacionPorId(repo);
	const participacion = await useCase.execute(id);

	if (!participacion) return json({ error: 'Participación no encontrada' }, { status: 404 });
	return json(participacion);
}

export async function PUT({ params, request }) {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	try {
		const data = await request.json();
		const participacion = new ParticipacionPermitida({
			...data,
			id_participacion_permitida: id
		});

		const useCase = new GuardarParticipacionPermitida(repo);
		const updated = await useCase.execute(participacion);
		return json(updated);
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
}

export async function DELETE({ params }) {
	const id = parseInt(params.id);
	if (isNaN(id)) return json({ error: 'ID no válido' }, { status: 400 });

	try {
		const useCase = new EliminarParticipacionPermitida(repo);
		await useCase.execute(id);
		return new Response(null, { status: 204 });
	} catch (error: any) {
		return json({ error: error.message }, { status: 400 });
	}
}
