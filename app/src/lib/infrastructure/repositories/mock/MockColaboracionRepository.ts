// import type { ColaboracionRepository } from '$lib/domain/repositories/ColaboracionRepository';
// import { Colaboracion } from '$lib/domain/entities/Colaboracion';
// import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';

// export class MockColaboracionRepository implements ColaboracionRepository {
// 	async findById(id: number): Promise<Colaboracion | null> {
// 		const colab = mockColaboraciones.find((c) => c.id_colaboracion === id);
// 		return colab ? new Colaboracion(colab) : null;
// 	}

// 	async findByProyecto(proyectoId: number): Promise<Colaboracion[]> {
// 		return mockColaboraciones
// 			.filter((c) => c.proyecto_id === proyectoId)
// 			.map((c) => new Colaboracion(c));
// 	}

// 	async findByColaborador(colaboradorId: number): Promise<Colaboracion[]> {
// 		return mockColaboraciones
// 			.filter((c) => c.colaborador_id === colaboradorId)
// 			.map((c) => new Colaboracion(c));
// 	}

// 	async findByProyectoAndColaborador(
// 		proyectoId: number,
// 		colaboradorId: number
// 	): Promise<Colaboracion | null> {
// 		const colab = mockColaboraciones.find(
// 			(c) => c.proyecto_id === proyectoId && c.colaborador_id === colaboradorId
// 		);
// 		return colab ? new Colaboracion(colab) : null;
// 	}

// 	async create(colaboracion: Colaboracion): Promise<Colaboracion> {
// 		const newId = Math.max(...mockColaboraciones.map((c) => c.id_colaboracion || 0), 0) + 1;
// 		const newColab = {
// 			...colaboracion,
// 			id_colaboracion: newId,
// 			created_at: new Date()
// 		};
// 		mockColaboraciones.push(newColab as any);
// 		return new Colaboracion(newColab);
// 	}

// 	async update(id: number, colaboracion: Partial<Colaboracion>): Promise<Colaboracion> {
// 		const index = mockColaboraciones.findIndex((c) => c.id_colaboracion === id);
// 		if (index === -1) {
// 			throw new Error('Colaboración no encontrada');
// 		}

// 		mockColaboraciones[index] = {
// 			...mockColaboraciones[index],
// 			...colaboracion
// 		} as any;

// 		return new Colaboracion(mockColaboraciones[index]);
// 	}

// 	async delete(id: number): Promise<void> {
// 		const index = mockColaboraciones.findIndex((c) => c.id_colaboracion === id);
// 		if (index !== -1) {
// 			mockColaboraciones.splice(index, 1);
// 		}
// 	}

// 	// Métodos legacy para compatibilidad
// 	async getColaboracion(proyectoId: number, usuarioId: number): Promise<Colaboracion | null> {
// 		return this.findByProyectoAndColaborador(proyectoId, usuarioId);
// 	}

// 	async getAportesPorColaboracion(colaboracionId: number): Promise<any[]> {
// 		const { mockColaboracionTipoParticipacion } = await import(
// 			'$lib/infrastructure/mocks/mock-colaboracion-tipo-participacion'
// 		);
// 		return mockColaboracionTipoParticipacion.filter((c) => c.colaboracion_id === colaboracionId);
// 	}

// 	async getEvidencias(participacionPermitidaId: number): Promise<any[]> {
// 		const { mockEvidencias } = await import('$lib/infrastructure/mocks/mock-evidencias');
// 		return mockEvidencias.filter(
// 			(e) =>
// 				e.participacion_permitida?.id_participacion_permitida === participacionPermitidaId ||
// 				e.id_participacion_permitida === participacionPermitidaId
// 		);
// 	}

// 	async getColaboracionesPorProyecto(proyectoId: number): Promise<Colaboracion[]> {
// 		return mockColaboraciones
// 			.filter((c) => c.proyecto_id === proyectoId && c.estado === 'aprobada')
// 			.map((c) => new Colaboracion(c));
// 	}

// 	async findByProyectoId(proyectoId: number): Promise<Colaboracion[]> {
// 		return this.getColaboracionesPorProyecto(proyectoId);
// 	}
// }
