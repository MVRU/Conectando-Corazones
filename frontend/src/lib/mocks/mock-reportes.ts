import type { Reporte } from '$lib/types/Reporte';
import { MotivoReporte } from '$lib/types/Reporte';

export const mockReportes: Reporte[] = [
    {
        id_reporte: 1,
        tipo_objeto: 'Proyecto',
        id_objeto: 4,
        motivo: MotivoReporte.FRAUDE,
        descripcion: 'Este proyecto parece no tener actividad real desde hace meses, pero siguen pidiendo donaciones.',
        created_at: new Date('2023-11-15T10:30:00'),
        estado: 'pendiente',
        reportante_id: 2
    },
    {
        id_reporte: 2,
        tipo_objeto: 'Usuario',
        id_objeto: 3,
        motivo: MotivoReporte.CONDUCTA_INAPROPIADA,
        descripcion: 'El usuario envía mensajes ofensivos en las reseñas.',
        created_at: new Date('2023-12-01T14:20:00'),
        estado: 'resuelto',
        fecha_resolucion: new Date('2023-12-02T09:00:00'),
        comentario_resolucion: 'Usuario advertido via email.',
        reportante_id: 4,
        admin_id: 1
    }
];
