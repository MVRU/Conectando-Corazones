import type { SolicitudFinalizacion } from '$lib/domain/types/SolicitudFinalizacion';

/**
 * Mock de solicitudes de finalización para testing
 * Incluye diferentes estados: pendiente, aprobada, rechazada
 */
export const mockSolicitudesFinalizacion: SolicitudFinalizacion[] = [
	{
		id_solicitud: 1,
		estado: 'pendiente',
		created_at: new Date('2025-12-15'),
		proyecto_id: 1, // "Un libro, un sueño"
		evidencia_ids: [1]
	},
	{
		id_solicitud: 2,
		estado: 'aprobada',
		created_at: new Date('2025-11-20'),
		proyecto_id: 2, // "Comedores con alma"
		evidencia_ids: [2]
	},
	{
		id_solicitud: 3,
		estado: 'pendiente',
		created_at: new Date('2025-12-28'),
		proyecto_id: 3,
		evidencia_ids: [28]
	},
	{
		id_solicitud: 4,
		estado: 'rechazada',
		created_at: new Date('2025-10-05'),
		proyecto_id: 4,
		evidencia_ids: [4]
	},
	{
		id_solicitud: 5,
		estado: 'aprobada',
		created_at: new Date('2025-09-18'),
		proyecto_id: 5,
		evidencia_ids: [5]
	},
	{
		id_solicitud: 6,
		estado: 'pendiente',
		created_at: new Date('2026-01-02'),
		proyecto_id: 6,
		evidencia_ids: [6]
	},
	{
		id_solicitud: 7,
		estado: 'aprobada',
		created_at: new Date('2025-08-30'),
		proyecto_id: 7,
		evidencia_ids: [7]
	},
	{
		id_solicitud: 8,
		estado: 'rechazada',
		created_at: new Date('2025-12-01'),
		proyecto_id: 8,
		evidencia_ids: [8]
	},
	{
		id_solicitud: 9,
		estado: 'pendiente',
		created_at: new Date('2026-01-05'),
		proyecto_id: 9,
		evidencia_ids: [9, 10]
	},
	// Proyecto 22: "Apoyo escolar en contraturno" (Escuela Esperanza) - 3 solicitudes rechazadas
	{
		id_solicitud: 10,
		estado: 'rechazada',
		created_at: new Date('2025-11-05'),
		proyecto_id: 22,
		evidencia_ids: []
	},
	{
		id_solicitud: 11,
		estado: 'rechazada',
		created_at: new Date('2025-12-10'),
		proyecto_id: 22,
		evidencia_ids: []
	},
	{
		id_solicitud: 12,
		estado: 'rechazada',
		created_at: new Date('2026-01-03'),
		proyecto_id: 22,
		evidencia_ids: []
	},
	{
		id_solicitud: 13,
		estado: 'pendiente',
		created_at: new Date('2026-02-01'),
		proyecto_id: 10,
		evidencia_ids: [29]
	}
];
