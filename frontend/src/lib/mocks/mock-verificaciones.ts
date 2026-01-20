import type { Verificacion } from '$lib/types/Verificacion';

export const mockVerificaciones: Verificacion[] = [
	{
		id_verificacion: 1,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-01-20'),
		fecha_vencimiento: new Date('2025-01-20'),
		usuario_id: 2
	},
	{
		id_verificacion: 2,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-02-15'),
		fecha_vencimiento: new Date('2025-02-15'),
		usuario_id: 3
	},
	{
		id_verificacion: 3,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-02-25'),
		fecha_vencimiento: new Date('2025-02-25'),
		usuario_id: 9
	},
	{
		id_verificacion: 4,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-03-15'),
		fecha_vencimiento: new Date('2025-03-15'),
		usuario_id: 10
	},
	{
		id_verificacion: 5,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-02-25'),
		fecha_vencimiento: new Date('2025-02-25'),
		usuario_id: 11
	},
	{
		id_verificacion: 6,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-04-05'),
		fecha_vencimiento: new Date('2025-04-05'),
		usuario_id: 12
	},
	{
		id_verificacion: 7,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-05-05'),
		fecha_vencimiento: new Date('2025-05-05'),
		usuario_id: 13
	},
	{
		id_verificacion: 8,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-06-05'),
		fecha_vencimiento: new Date('2025-06-05'),
		usuario_id: 14
	},
	{
		id_verificacion: 9,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-07-05'),
		fecha_vencimiento: new Date('2025-07-05'),
		usuario_id: 15
	},
	{
		id_verificacion: 10,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-08-05'),
		fecha_vencimiento: new Date('2025-08-05'),
		usuario_id: 16
	},
	{
		id_verificacion: 11,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-08-15'),
		fecha_vencimiento: new Date('2025-08-15'),
		usuario_id: 17
	},
	{
		id_verificacion: 12,
		tipo: 'documental',
		estado: 'aprobada',
		created_at: new Date('2024-08-20'),
		fecha_vencimiento: new Date('2025-08-20'),
		usuario_id: 18
	},
	{
		id_verificacion: 13,
		tipo: 'documental',
		estado: 'rechazada',
		created_at: new Date('2024-09-01'),
		usuario_id: 19
	},
	{
		id_verificacion: 14,
		tipo: 'documental',
		estado: 'pendiente',
		created_at: new Date('2024-09-10'),
		usuario_id: 20
	},
	{
		id_verificacion: 15,
		tipo: 'email_institucional',
		estado: 'aprobada',
		created_at: new Date('2024-10-01'),
		fecha_vencimiento: new Date('2025-10-01'),
		usuario_id: 5
	},
	{
		id_verificacion: 16,
		tipo: 'renaper',
		estado: 'aprobada',
		created_at: new Date('2024-11-01'),
		fecha_vencimiento: new Date('2025-11-01'),
		usuario_id: 4
	},
	{
		id_verificacion: 17,
		tipo: 'email_institucional',
		estado: 'pendiente',
		created_at: new Date('2024-12-01'),
		usuario_id: 7 
	},
	{
		id_verificacion: 18,
		tipo: 'renaper',
		estado: 'pendiente',
		created_at: new Date('2024-12-15'),
		usuario_id: 8 
	},
	{
		id_verificacion: 19,
		tipo: 'email_institucional',
		estado: 'aprobada',
		created_at: new Date('2024-05-10'),
		fecha_vencimiento: new Date('2025-05-10'),
		usuario_id: 6 
	}
];
