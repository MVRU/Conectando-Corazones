import type { UbicacionDisyuncion, UbicacionPresencial, UbicacionVirtual } from '$lib/types/Ubicacion';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

// para obtener localidad por ID
const getLocalidad = (id: number) => {
	return mockLocalidades.find((l) => l.id_localidad === id);
};

// Ubicaciones base - mixto de presenciales y virtuales
const ubicacionesBase: UbicacionDisyuncion[] = [
	// Ubicaciones presenciales
	{
		id_ubicacion: 1,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'San Martín',
		numero: '456',
		piso: '1',
		departamento: 'A',
		referencia: 'Frente a la plaza principal',
		url_google_maps: 'https://maps.google.com/?q=San+Martín+456',
		localidad_id: 1,
		localidad: getLocalidad(1)
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 2,
		tipo_ubicacion: 'voluntariado',
		modalidad: 'presencial',
		calle: 'Calle 8',
		numero: '456',
		referencia: 'Barrio Norte',
		url_google_maps: 'https://maps.google.com/?q=Calle+8+456',
		localidad_id: 2,
		localidad: getLocalidad(2)
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 3,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Av. Belgrano',
		numero: '789',
		referencia: 'Centro de la ciudad',
		localidad_id: 3,
		localidad: getLocalidad(3)
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 4,
		tipo_ubicacion: 'aqui se reciben las donaciones',
		modalidad: 'presencial',
		calle: 'Rivadavia',
		numero: '123',
		piso: '3',
		departamento: 'B',
		localidad_id: 4,
		localidad: getLocalidad(4)
	} satisfies UbicacionPresencial,
	// Ubicaciones virtuales
	{
		id_ubicacion: 5,
		tipo_ubicacion: 'principal',
		modalidad: 'virtual',
		url_virtual: 'https://meet.google.com/abc-defg-hij'
	} satisfies UbicacionVirtual,
	{
		id_ubicacion: 6,
		tipo_ubicacion: 'voluntariado',
		modalidad: 'virtual',
		url_virtual: 'https://zoom.us/j/123456789'
	} satisfies UbicacionVirtual,
	{
		id_ubicacion: 7,
		tipo_ubicacion: 'reuniones',
		modalidad: 'virtual',
		url_virtual: 'https://teams.microsoft.com/l/meetup-join/19%3a...'
	} satisfies UbicacionVirtual,
	{
		id_ubicacion: 8,
		tipo_ubicacion: 'principal',
		modalidad: 'virtual',
		url_virtual: 'https://biblioteca-digital.conectandocorazones.org'
	} satisfies UbicacionVirtual
];

export const mockUbicaciones: UbicacionDisyuncion[] = ubicacionesBase;

//para obtener ubicación por ID
export const getUbicacion = (id: number): UbicacionDisyuncion | undefined => {
	return mockUbicaciones.find((u) => u.id_ubicacion === id);
};