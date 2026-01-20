import type { ColaboracionTipoParticipacion } from '$lib/types/ColaboracionTipoParticipacion';

export const mockColaboracionTipoParticipacion: ColaboracionTipoParticipacion[] = [
	// Colaboraciones para Proyecto 1 (Un libro, un sueño)
	// Maria G (id_colaboracion: 1) donó 5 libros
	{
		id_colaboracion_tipo_participacion: 1,
		colaboracion_id: 1,
		participacion_permitida_id: 1, // libros
		cantidad: 5
	},
	// Maria G (id_colaboracion: 1) es voluntaria docente (1 persona)
	{
		id_colaboracion_tipo_participacion: 2,
		colaboracion_id: 1,
		participacion_permitida_id: 2, // docentes
		cantidad: 1
	},

	// Colaboraciones para Proyecto 2 (Comedores con alma)
	// Fundacion Manos Unidas (id_colaboracion: 3) donó 20 personas (voluntarios)
	{
		id_colaboracion_tipo_participacion: 3,
		colaboracion_id: 3,
		participacion_permitida_id: 1, // voluntarios
		cantidad: 10
	}
];
