import type { ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
import { getUbicacion } from '$lib/mocks/mock-ubicaciones';

const ubicacionesBase: ProyectoUbicacion[] = [
	{
		id_proyecto_ubicacion: 1,
		proyecto_id: 1,
		ubicacion_id: 1,
		ubicacion: getUbicacion(1)
	},
	{
		id_proyecto_ubicacion: 2,
		proyecto_id: 1,
		ubicacion_id: 2,
		ubicacion: getUbicacion(2)
	},
	{
		id_proyecto_ubicacion: 3,
		proyecto_id: 2,
		ubicacion_id: 3,
		ubicacion: getUbicacion(3)
	},
	{
		id_proyecto_ubicacion: 4,
		proyecto_id: 2,
		ubicacion_id: 4,
		ubicacion: getUbicacion(4)
	},
	{
		id_proyecto_ubicacion: 5,
		proyecto_id: 3,
		ubicacion_id: 5,
		ubicacion: getUbicacion(5)
	},
	{
		id_proyecto_ubicacion: 6,
		proyecto_id: 4,
		ubicacion_id: 6,
		ubicacion: getUbicacion(6)
	},
	{
		id_proyecto_ubicacion: 7,
		proyecto_id: 5,
		ubicacion_id: 7,
		ubicacion: getUbicacion(7)
	},
	{
		id_proyecto_ubicacion: 8,
		proyecto_id: 1,
		ubicacion_id: 7,
		ubicacion: getUbicacion(7)
	},
	{
		id_proyecto_ubicacion: 9,
		proyecto_id: 9,
		ubicacion_id: 8,
		ubicacion: getUbicacion(8)
	},
];

export const mockProyectoUbicaciones: ProyectoUbicacion[] = ubicacionesBase;
