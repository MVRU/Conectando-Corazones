import type { HistorialDeCambios } from '$lib/types/HistorialDeCambios';

export const mockHistorialCambios: HistorialDeCambios[] = [
	{
		id_cambio: 1,
		tipo_objeto: 'Usuario',
		id_objeto: 4,
		accion: 'actualizado',
		atributo_afectado: 'estado',
		valor_anterior: 'activo',
		valor_nuevo: 'inactivo',
		justificacion: 'Usuario suspendido por incumplimiento de compromisos',
		created_at: new Date('2024-12-10'),
		usuario_id: 1
	},
	{
		id_cambio: 2,
		tipo_objeto: 'Reporte',
		id_objeto: 3,
		accion: 'resuelto',
		atributo_afectado: 'estado',
		valor_anterior: 'pendiente',
		valor_nuevo: 'resuelto',
		justificacion: 'Se verificó la documentación y se confirmó el uso correcto de los fondos',
		created_at: new Date('2024-11-25'),
		usuario_id: 1
	},
	{
		id_cambio: 3,
		tipo_objeto: 'Resena',
		id_objeto: 101,
		accion: 'aprobado',
		atributo_afectado: 'aprobado',
		valor_anterior: null,
		valor_nuevo: 'true',
		justificacion: 'Reseña aprobada tras revisión de contenido',
		created_at: new Date('2024-12-15'),
		usuario_id: 1
	},
	{
		id_cambio: 4,
		tipo_objeto: 'Resena',
		id_objeto: 104,
		accion: 'rechazado',
		atributo_afectado: 'aprobado',
		valor_anterior: null,
		valor_nuevo: 'false',
		justificacion: 'Contenido inapropiado con lenguaje ofensivo',
		created_at: new Date('2024-12-14'),
		usuario_id: 1
	},
	{
		id_cambio: 5,
		tipo_objeto: 'Proyecto',
		id_objeto: 2,
		accion: 'actualizado',
		atributo_afectado: 'estado',
		valor_anterior: 'en_curso',
		valor_nuevo: 'en_auditoria',
		justificacion: 'Proyecto enviado a auditoría por reporte de fraude',
		created_at: new Date('2024-11-20'),
		usuario_id: 1
	},
	{
		id_cambio: 6,
		tipo_objeto: 'Usuario',
		id_objeto: 7,
		accion: 'actualizado',
		atributo_afectado: 'estado',
		valor_anterior: 'activo',
		valor_nuevo: 'suspendido',
		justificacion: 'Comportamiento inapropiado reportado por múltiples usuarios',
		created_at: new Date('2024-12-05'),
		usuario_id: 1
	},
	{
		id_cambio: 7,
		tipo_objeto: 'Reporte',
		id_objeto: 6,
		accion: 'resuelto',
		atributo_afectado: 'estado',
		valor_anterior: 'pendiente',
		valor_nuevo: 'resuelto',
		justificacion: 'Se contactó al usuario y se le aplicó una advertencia',
		created_at: new Date('2024-11-18'),
		usuario_id: 1
	},
	{
		id_cambio: 8,
		tipo_objeto: 'Proyecto',
		id_objeto: 1,
		accion: 'creado',
		atributo_afectado: '',
		valor_anterior: null,
		valor_nuevo: null,
		justificacion: null,
		created_at: new Date('2025-03-01'),
		usuario_id: 2
	},
	{
		id_cambio: 9,
		tipo_objeto: 'Usuario',
		id_objeto: 8,
		accion: 'actualizado',
		atributo_afectado: 'rol',
		valor_anterior: 'colaborador',
		valor_nuevo: 'colaborador',
		justificacion: 'Actualización de perfil de usuario',
		created_at: new Date('2024-12-12'),
		usuario_id: 1
	},
	{
		id_cambio: 10,
		tipo_objeto: 'Categoria',
		id_objeto: 21,
		accion: 'creado',
		atributo_afectado: '',
		valor_anterior: null,
		valor_nuevo: 'Nueva categoría: Tecnología',
		justificacion: 'Agregada nueva categoría para proyectos tecnológicos',
		created_at: new Date('2024-12-01'),
		usuario_id: 1
	}
];
