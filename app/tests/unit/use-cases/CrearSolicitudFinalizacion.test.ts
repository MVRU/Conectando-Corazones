import { describe, it, expect, vi } from 'vitest';
import { CrearSolicitudFinalizacion } from '$lib/domain/use-cases/proyectos/CrearSolicitudFinalizacion';
import type { EvidenciaRepository } from '$lib/domain/repositories/EvidenciaRepository';
import type { ProyectoRepository } from '$lib/domain/repositories/ProyectoRepository';
import type { SolicitudFinalizacionRepository } from '$lib/domain/repositories/SolicitudFinalizacionRepository';
import type { HistorialDeCambiosRepository } from '$lib/domain/repositories/HistorialDeCambiosRepository';

describe('CrearSolicitudFinalizacion', () => {
	const historialRepo = {
		create: vi.fn().mockResolvedValue({})
	} as unknown as HistorialDeCambiosRepository;

	it('lanza error si el proyecto no existe', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue(null)
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn(),
			countRechazadasByProyectoId: vi.fn(),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn()
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [1])).rejects.toThrow('Proyecto no encontrado.');
	});

	it('lanza error si la institución no es dueña del proyecto', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 999,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn(),
			countRechazadasByProyectoId: vi.fn(),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn()
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [1])).rejects.toThrow(
			'No tiene permisos para solicitar el cierre de este proyecto.'
		);
	});

	it('lanza error si el proyecto no está en pendiente_solicitud_cierre', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 10,
				estado: 'en_curso',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn(),
			countRechazadasByProyectoId: vi.fn(),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn()
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [1])).rejects.toThrow(
			'El proyecto debe estar en estado "pendiente_solicitud_cierre" para solicitar el cierre.'
		);
	});

	it('lanza error si ya existe una solicitud pendiente', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 10,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn().mockResolvedValue({ estado: 'pendiente' }),
			countRechazadasByProyectoId: vi.fn(),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn()
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [1])).rejects.toThrow(
			'Ya existe una solicitud de finalización pendiente para este proyecto.'
		);
	});

	it('lanza error si el proyecto alcanzó el límite de rechazadas (>= 3)', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 10,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn().mockResolvedValue(null),
			countRechazadasByProyectoId: vi.fn().mockResolvedValue(3),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn().mockResolvedValue([{ id_evidencia: 1 }])
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [1])).rejects.toThrow(
			'Este proyecto alcanzó el límite de 3 solicitudes de finalización rechazadas.'
		);
	});

	it('lanza error si no hay evidencia_ids', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 10,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn().mockResolvedValue(null),
			countRechazadasByProyectoId: vi.fn().mockResolvedValue(0),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn()
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [])).rejects.toThrow(
			'Debe seleccionar al menos una evidencia para respaldar la solicitud.'
		);
	});

	it('lanza error si alguna evidencia no pertenece al proyecto', async () => {
		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: 123,
				institucion_id: 10,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn().mockResolvedValue(null),
			countRechazadasByProyectoId: vi.fn().mockResolvedValue(0),
			create: vi.fn()
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn().mockResolvedValue([{ id_evidencia: 1 }])
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		await expect(useCase.execute(10, 123, [999])).rejects.toThrow(
			'Alguna de las evidencias seleccionadas no pertenece a este proyecto.'
		);
	});

	it('happy path: crea solicitud con estado pendiente y llama al repo con los IDs correctos', async () => {
		const idInstitucion = 10;
		const idProyecto = 123;
		const evidenciaIds = [1, 2];

		const proyectoRepo = {
			findById: vi.fn().mockResolvedValue({
				id_proyecto: idProyecto,
				institucion_id: idInstitucion,
				estado: 'pendiente_solicitud_cierre',
				titulo: 'Proyecto',
				descripcion: 'Desc'
			})
		} as unknown as ProyectoRepository;

		const solicitudRepo = {
			findByProyectoId: vi.fn().mockResolvedValue(null),
			countRechazadasByProyectoId: vi.fn().mockResolvedValue(1),
			create: vi.fn().mockResolvedValue({
				id_solicitud: 500,
				proyecto_id: idProyecto,
				evidencia_ids: evidenciaIds,
				estado: 'pendiente'
			})
		} as unknown as SolicitudFinalizacionRepository;

		const evidenciaRepo = {
			findAllByProyecto: vi.fn().mockResolvedValue([{ id_evidencia: 1 }, { id_evidencia: 2 }])
		} as unknown as EvidenciaRepository;

		const useCase = new CrearSolicitudFinalizacion(
			solicitudRepo,
			proyectoRepo,
			evidenciaRepo,
			historialRepo
		);

		const result = await useCase.execute(idInstitucion, idProyecto, evidenciaIds);

		expect(result).toEqual({
			id_solicitud: 500,
			proyecto_id: idProyecto,
			evidencia_ids: evidenciaIds,
			estado: 'pendiente'
		});

		expect(solicitudRepo.create).toHaveBeenCalledTimes(1);
		expect(solicitudRepo.create).toHaveBeenCalledWith({
			proyecto_id: idProyecto,
			evidencia_ids: evidenciaIds,
			estado: 'pendiente'
		});
	});
});

