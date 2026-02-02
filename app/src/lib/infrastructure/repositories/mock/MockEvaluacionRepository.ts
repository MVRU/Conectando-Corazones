// import type { Evaluacion } from '$lib/domain/types/Evaluacion';
// import { mockEvaluaciones } from '$lib/infrastructure/mocks/mock-evaluaciones';

// export class MockEvaluacionRepository {
// 	private evaluaciones: Evaluacion[] = [...mockEvaluaciones];

// 	async findBySolicitudAndColaborador(
// 		solicitudId: number,
// 		colaboradorId: number
// 	): Promise<Evaluacion | null> {
// 		return (
// 			this.evaluaciones.find(
// 				(e) => e.solicitud_id === solicitudId && e.colaborador_id === colaboradorId
// 			) || null
// 		);
// 	}

// 	async findBySolicitudId(solicitudId: number): Promise<Evaluacion[]> {
// 		return this.evaluaciones.filter((e) => e.solicitud_id === solicitudId);
// 	}

// 	async updateVoto(
// 		id: number,
// 		voto: 'aprobado' | 'rechazado',
// 		justificacion?: string
// 	): Promise<Evaluacion> {
// 		const index = this.evaluaciones.findIndex((e) => e.id_evaluacion === id);
// 		if (index === -1) {
// 			throw new Error('Evaluación no encontrada');
// 		}

// 		this.evaluaciones[index] = {
// 			...this.evaluaciones[index],
// 			voto,
// 			justificacion: justificacion || null,
// 			created_at: new Date()
// 		};

// 		return this.evaluaciones[index];
// 	}

// 	async save(evaluacion: Evaluacion): Promise<Evaluacion> {
// 		const id = this.evaluaciones.length + 1;
// 		const newEvaluacion = { ...evaluacion, id_evaluacion: id };
// 		this.evaluaciones.push(newEvaluacion);
// 		return newEvaluacion;
// 	}
// }
