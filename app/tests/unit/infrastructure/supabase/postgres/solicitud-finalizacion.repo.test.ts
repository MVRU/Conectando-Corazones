import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostgresSolicitudFinalizacionRepository } from '$lib/infrastructure/supabase/postgres/solicitud-finalizacion.repo';

vi.mock('$lib/infrastructure/prisma/client', () => {
	return {
		prisma: {
			solicitudFinalizacion: {
				findMany: vi.fn()
			}
		}
	};
});

describe('PostgresSolicitudFinalizacionRepository', () => {
	it('findRechazadasByProyectoId debe mapear registros y devolver evidencia_ids vacío', async () => {
		const mockedClient = await import('$lib/infrastructure/prisma/client');
		const findManyMock = (mockedClient.prisma.solicitudFinalizacion as any).findMany as any;

		findManyMock.mockResolvedValue([
			{ id_solicitud: 1, proyecto_id: 69, estado: 'rechazada', created_at: new Date('2026-03-01') },
			{ id_solicitud: 2, proyecto_id: 69, estado: 'rechazada', created_at: new Date('2026-03-02') }
		]);

		const repo = new PostgresSolicitudFinalizacionRepository();
		const result = await repo.findRechazadasByProyectoId(69);

		expect(findManyMock).toHaveBeenCalledTimes(1);
		expect(findManyMock).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { proyecto_id: 69, estado: 'rechazada' }
			})
		);

		expect(result).toEqual([
			{
				id_solicitud: 1,
				proyecto_id: 69,
				estado: 'rechazada',
				created_at: new Date('2026-03-01'),
				evidencia_ids: []
			},
			{
				id_solicitud: 2,
				proyecto_id: 69,
				estado: 'rechazada',
				created_at: new Date('2026-03-02'),
				evidencia_ids: []
			}
		]);
	});
});

