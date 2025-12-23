import type { Reporte } from '$lib/types/Reporte';

export const mockReportes: Reporte[] = [
	{
		id_reporte: 1,
		tipo_objeto: 'Proyecto',
		id_objeto: 1,
		motivo: 'Información falsa',
		descripcion: 'El proyecto menciona que necesita 1000 libros pero en realidad solo necesita 200. La información es engañosa.',
		created_at: new Date('2024-12-01'),
		estado: 'pendiente',
		reportante_id: 4,
		usuario_id: undefined
	},
	{
		id_reporte: 2,
		tipo_objeto: 'Usuario',
		id_objeto: 7,
		motivo: 'Comportamiento inapropiado',
		descripcion: 'El usuario ha estado enviando mensajes ofensivos a otros colaboradores en el chat del proyecto.',
		created_at: new Date('2024-12-05'),
		estado: 'pendiente',
		reportante_id: 4,
		usuario_id: 7
	},
	{
		id_reporte: 3,
		tipo_objeto: 'Proyecto',
		id_objeto: 2,
		motivo: 'Fraude',
		descripcion: 'Sospecho que el proyecto no está utilizando los fondos recaudados para el propósito declarado. No hay evidencias de las actividades mencionadas.',
		created_at: new Date('2024-11-20'),
		estado: 'resuelto',
		fecha_resolucion: new Date('2024-11-25'),
		comentario_resolucion: 'Se verificó la documentación y se confirmó el uso correcto de los fondos. El proyecto es legítimo.',
		reportante_id: 5,
		admin_id: 1,
		usuario_id: undefined
	},
	{
		id_reporte: 4,
		tipo_objeto: 'Usuario',
		id_objeto: 8,
		motivo: 'Spam',
		descripcion: 'El usuario está publicando múltiples proyectos similares con información duplicada, parece ser spam.',
		created_at: new Date('2024-12-10'),
		estado: 'pendiente',
		reportante_id: 2,
		usuario_id: 8
	},
	{
		id_reporte: 5,
		tipo_objeto: 'Proyecto',
		id_objeto: 3,
		motivo: 'Información falsa',
		descripcion: 'Las fechas de cierre del proyecto no coinciden con las mencionadas en la descripción. Hay inconsistencia en la información.',
		created_at: new Date('2024-12-08'),
		estado: 'pendiente',
		reportante_id: 6,
		usuario_id: undefined
	},
	{
		id_reporte: 6,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		motivo: 'Comportamiento inapropiado',
		descripcion: 'El colaborador no cumplió con sus compromisos en el proyecto y abandonó sin avisar, afectando el progreso.',
		created_at: new Date('2024-11-15'),
		estado: 'resuelto',
		fecha_resolucion: new Date('2024-11-18'),
		comentario_resolucion: 'Se contactó al usuario y se le aplicó una advertencia. El caso está cerrado.',
		reportante_id: 2,
		admin_id: 1,
		usuario_id: 4
	},
	{
		id_reporte: 7,
		tipo_objeto: 'Proyecto',
		id_objeto: 4,
		motivo: 'Fraude',
		descripcion: 'El proyecto solicita donaciones pero no proporciona información clara sobre cómo se utilizarán los fondos. Muy sospechoso.',
		created_at: new Date('2024-12-12'),
		estado: 'pendiente',
		reportante_id: 5,
		usuario_id: undefined
	},
	{
		id_reporte: 8,
		tipo_objeto: 'Usuario',
		id_objeto: 9,
		motivo: 'Spam',
		descripcion: 'Usuario creando múltiples cuentas para inflar las estadísticas de sus proyectos.',
		created_at: new Date('2024-12-03'),
		estado: 'rechazado',
		fecha_resolucion: new Date('2024-12-05'),
		comentario_resolucion: 'No se encontraron evidencias de múltiples cuentas. El reporte fue rechazado.',
		reportante_id: 3,
		admin_id: 1,
		usuario_id: 9
	}
];
