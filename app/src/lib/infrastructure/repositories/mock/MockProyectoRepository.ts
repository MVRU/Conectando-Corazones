import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import { Proyecto } from '$lib/domain/entities/Proyecto';
import type { Proyecto as ProyectoType } from '$lib/domain/types/Proyecto';
import type { EstadoDescripcion } from '$lib/domain/types/Estado';
import { mockProyectos } from '$lib/infrastructure/mocks/mock-proyectos';
import { mockUsuarios } from '$lib/infrastructure/mocks/mock-usuarios';
import { mockProyectoCategorias } from '$lib/infrastructure/mocks/mock-proyecto-categorias';
import { mockColaboraciones } from '$lib/infrastructure/mocks/mock-colaboraciones';
import { mockProyectoUbicaciones } from '$lib/infrastructure/mocks/mock-proyecto-ubicaciones';
import type { Categoria } from '$lib/domain/types/Categoria';
import type { Colaboracion } from '$lib/domain/types/Colaboracion';
import type { ProyectoUbicacion } from '$lib/domain/types/ProyectoUbicacion';
import type { Institucion } from '$lib/domain/types/Usuario';

// ---------- Helpers ----------
const isDefined = <T>(x: T | null | undefined): x is T => x != null;

const findCategoriasByProyectoId = (projectId: number): Categoria[] => {
	return mockProyectoCategorias
		.filter((pc) => pc.proyecto_id === projectId)
		.map((pc) => pc.categoria)
		.filter(isDefined);
};

const findColaboracionesByProyectoId = (projectId: number): Colaboracion[] => {
	return mockColaboraciones.filter((c) => c.proyecto_id === projectId);
};

const findUbicacionesByProyectoId = (projectId: number): ProyectoUbicacion[] => {
	return mockProyectoUbicaciones.filter((u) => u.proyecto_id === projectId);
};

const isInstitucion = (possibleInstitucion: unknown): possibleInstitucion is Institucion => {
	return (
		!!possibleInstitucion &&
		typeof possibleInstitucion === 'object' &&
		'nombre_legal' in possibleInstitucion &&
		'tipo_institucion' in possibleInstitucion
	);
};

const findInstitucionById = (institucionId: number): Institucion | undefined => {
	const usuario = Object.values(mockUsuarios).find((u) => u.id_usuario === institucionId);
	return isInstitucion(usuario) ? usuario : undefined;
};

const hydrateProyecto = (proyectoBase: ProyectoType): Proyecto => {
	const projectId = proyectoBase.id_proyecto ?? 0;

	const colaboraciones = findColaboracionesByProyectoId(projectId);
	const categorias = findCategoriasByProyectoId(projectId);
	const ubicaciones = findUbicacionesByProyectoId(projectId);
	const institucion = proyectoBase.institucion_id
		? findInstitucionById(proyectoBase.institucion_id)
		: undefined;

	return new Proyecto({
		...proyectoBase,
		categorias,
		colaboraciones,
		colaboracion_ids: colaboraciones
			.map((c) => c.id_colaboracion)
			.filter((id): id is number => id !== undefined),
		ubicaciones,
		institucion
	});
};

export class MockProyectoRepository implements ProyectoRepository {
	async findAll(): Promise<Proyecto[]> {
		return mockProyectos.map(hydrateProyecto);
	}

	async findById(id: number): Promise<Proyecto | null> {
		const proyecto = mockProyectos.find((p) => p.id_proyecto === id);
		return proyecto ? hydrateProyecto(proyecto) : null;
	}

	async create(proyecto: Proyecto): Promise<Proyecto> {
		const newProyectoData = {
			...proyecto,
			id_proyecto: Date.now(),
			estado: 'en_curso'
		} as ProyectoType;
		mockProyectos.push(newProyectoData);
		return hydrateProyecto(newProyectoData);
	}

	async update(proyecto: Proyecto): Promise<Proyecto> {
		const id = proyecto.id_proyecto;
		const index = mockProyectos.findIndex((p) => p.id_proyecto === id);
		if (index === -1) {
			throw new Error('Proyecto no encontrado');
		}

		mockProyectos[index] = {
			...mockProyectos[index],
			titulo: proyecto.titulo,
			descripcion: proyecto.descripcion,
			resumen: proyecto.resumen,
			aprendizajes: proyecto.aprendizajes,
			url_portada: proyecto.url_portada,
			beneficiarios: proyecto.beneficiarios
		};

		return hydrateProyecto(mockProyectos[index]);
	}

	async updateEstado(id: number, nuevoEstado: EstadoDescripcion): Promise<Proyecto> {
		const index = mockProyectos.findIndex((p) => p.id_proyecto === id);
		if (index === -1) {
			throw new Error('Proyecto no encontrado');
		}
		mockProyectos[index].estado = nuevoEstado;
		return hydrateProyecto(mockProyectos[index]);
	}
}
