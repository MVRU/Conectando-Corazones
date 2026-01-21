import type { Reporte } from '$lib/domain/types/Reporte';
import { MotivoReporte } from '$lib/domain/types/Reporte';

export const mockReportes: Reporte[] = [
	{
		id_reporte: 1,
		tipo_objeto: 'Proyecto',
		id_objeto: 4,
		motivo: MotivoReporte.FRAUDE,
		descripcion:
			'Este proyecto parece no tener actividad real desde hace meses, pero siguen pidiendo donaciones.',
		created_at: new Date('2025-11-15T10:30:00'),
		estado: 'pendiente',
		reportante_id: 2,
		admin_id: null
	},
	{
		id_reporte: 2,
		tipo_objeto: 'Usuario',
		id_objeto: 3,
		motivo: MotivoReporte.CONDUCTA_INAPROPIADA,
		descripcion: 'El usuario envía mensajes ofensivos en las reseñas.',
		created_at: new Date('2025-12-01T14:20:00'),
		estado: 'resuelto',
		fecha_resolucion: new Date('2025-12-02T09:00:00'),
		comentario_resolucion: 'Agradecemos tu paciencia. El usuario ha sido advertido via email.',
		reportante_id: 4,
		admin_id: 1
	},
	{
		id_reporte: 3,
		tipo_objeto: 'Proyecto',
		id_objeto: 19,
		motivo: MotivoReporte.OTRO,
		descripcion:
			'El proyecto no muestra actualizaciones desde hace mucho tiempo y no responden mensajes.',
		created_at: new Date('2026-01-05T10:00:00'),
		estado: 'pendiente',
		reportante_id: 2,
		admin_id: null
	},
	{
		id_reporte: 4,
		tipo_objeto: 'Usuario',
		id_objeto: 19,
		motivo: MotivoReporte.FRAUDE,
		descripcion: 'Esta fundación parece estar creando proyectos falsos copiados de otros sitios.',
		created_at: new Date('2025-12-10T16:30:00'),
		estado: 'resuelto',
		fecha_resolucion: new Date('2025-12-12T11:00:00'),
		comentario_resolucion:
			'Usuario investigado y advertido. Se han dado de baja los proyectos duplicados.',
		reportante_id: 2,
		admin_id: 1
	},
	{
		id_reporte: 5,
		tipo_objeto: 'Proyecto',
		id_objeto: 14,
		motivo: MotivoReporte.CONTENIDO_FALSO,
		descripcion: 'Las fotos de los avances parecen sacadas de internet, dudo que sean reales.',
		created_at: new Date('2025-11-20T09:15:00'),
		estado: 'rechazado',
		fecha_resolucion: new Date('2025-11-21T14:00:00'),
		comentario_resolucion:
			'Hemos verificado la autenticidad de las imágenes con metadatos y visitas en terreno. El reporte es inválido.',
		reportante_id: 2,
		admin_id: 1
	},
	{
		id_reporte: 6,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		motivo: MotivoReporte.CONDUCTA_INAPROPIADA,
		descripcion: 'Comentarios agresivos en el chat de colaboración del proyecto.',
		created_at: new Date('2026-01-02T18:45:00'),
		estado: 'pendiente',
		reportante_id: 2,
		admin_id: null
	}
];
