import type { Colaboracion } from '$lib/types/Colaboracion';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

const getColaborador = (id: number) =>
    Object.values(mockUsuarios).find((u) => u.id_usuario === id);

export const mockColaboraciones: Colaboracion[] = [
    {
        id_colaboracion: 1,
        estado: 'aprobada',
        created_at: new Date('2025-03-05'),
        proyecto_id: 1,
        colaborador_id: 4,
        colaborador: getColaborador(4)
    },
    {
        id_colaboracion: 2,
        estado: 'pendiente',
        created_at: new Date('2025-03-10'),
        proyecto_id: 1,
        colaborador_id: 5,
        colaborador: getColaborador(5)
    },
    {
        id_colaboracion: 3,
        estado: 'aprobada',
        created_at: new Date('2025-02-15'),
        proyecto_id: 2,
        colaborador_id: 6,
        colaborador: getColaborador(6)
    },
    {
        id_colaboracion: 4,
        estado: 'aprobada',
        created_at: new Date('2025-01-25'),
        proyecto_id: 3,
        colaborador_id: 7,
        colaborador: getColaborador(7)
    },
    {
        id_colaboracion: 5,
        estado: 'aprobada',
        created_at: new Date('2025-04-05'),
        proyecto_id: 4,
        colaborador_id: 8,
        colaborador: getColaborador(8)
    },
    {
        id_colaboracion: 6,
        estado: 'aprobada',
        created_at: new Date('2025-03-20'),
        proyecto_id: 5,
        colaborador_id: 4,
        colaborador: getColaborador(4)
    },
    {
        id_colaboracion: 7,
        estado: 'aprobada',
        created_at: new Date('2025-02-28'),
        proyecto_id: 6,
        colaborador_id: 5,
        colaborador: getColaborador(5)
    },
    {
        id_colaboracion: 8,
        estado: 'aprobada',
        created_at: new Date('2025-05-10'),
        proyecto_id: 7,
        colaborador_id: 6,
        colaborador: getColaborador(6)
    },
    {
        id_colaboracion: 9,
        estado: 'aprobada',
        created_at: new Date('2025-04-15'),
        proyecto_id: 8,
        colaborador_id: 7,
        colaborador: getColaborador(7)
    }
];