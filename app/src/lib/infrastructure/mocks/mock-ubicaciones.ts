import type {
	UbicacionDisyuncion,
	UbicacionPresencial,
	UbicacionVirtual
} from '$lib/domain/types/Ubicacion';
import { mockLocalidades } from '$lib/infrastructure/mocks/mock-localidades';

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
		modalidad: 'presencial',
		calle: 'Av. Pellegrini',
		numero: '2000',
		referencia: 'Huerta Escolar Rosario',
		localidad_id: 4,
		localidad: getLocalidad(4),
		url_google_maps: 'https://maps.google.com/?q=Rosario'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 9,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Ruta Nacional 9',
		numero: 'Km 1200',
		referencia: 'Comunidad Puna',
		localidad_id: 18,
		localidad: getLocalidad(18),
		url_google_maps: 'https://maps.google.com/?q=Jujuy'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 10,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Av. Corrientes',
		numero: '1500',
		referencia: 'Sede CABA',
		localidad_id: 3,
		localidad: getLocalidad(3),
		url_google_maps: 'https://maps.google.com/?q=CABA'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 11,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Bv. San Juan',
		numero: '400',
		referencia: 'Barrio Güemes',
		localidad_id: 5,
		localidad: getLocalidad(5),
		url_google_maps: 'https://maps.google.com/?q=Cordoba'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 12,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Av. Calchaquí',	
		numero: '3050',
		referencia: 'Refugio Animales',
		localidad_id: 24,
		localidad: getLocalidad(24),
		url_google_maps: 'https://maps.google.com/?q=Quilmes'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 13,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Ruta Provincial 4',
		numero: 'S/N',
		referencia: 'Escuela Rural',
		localidad_id: 19,
		localidad: getLocalidad(19),
		url_google_maps: 'https://maps.google.com/?q=Catamarca'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 14,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Camino de las 100 Curvas',
		numero: 'S/N',
		referencia: 'Reserva Natural',
		localidad_id: 25,
		localidad: getLocalidad(25),
		url_google_maps: 'https://maps.google.com/?q=VillaCarlosPaz'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 15,
		tipo_ubicacion: 'taller',
		modalidad: 'presencial',
		calle: 'San Luis',
		numero: '1200',
		referencia: 'Taller Comunitario',
		localidad_id: 4,
		localidad: getLocalidad(4),
		url_google_maps: 'https://maps.google.com/?q=Rosario'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 16,
		tipo_ubicacion: 'recorrido',
		modalidad: 'presencial',
		calle: 'Plaza Almagro',
		numero: 'S/N',
		referencia: 'Punto de Encuentro',
		localidad_id: 3,
		localidad: getLocalidad(3),
		url_google_maps: 'https://maps.google.com/?q=Almagro'
	} satisfies UbicacionPresencial,
	{
		id_ubicacion: 17,
		tipo_ubicacion: 'principal',
		modalidad: 'presencial',
		calle: 'Calle 1',
		numero: '1250',
		referencia: 'Centro Barrial',
		localidad_id: 2,
		localidad: getLocalidad(2),
		url_google_maps: 'https://maps.google.com/?q=LaPlata'
	} satisfies UbicacionPresencial
];

export const mockUbicaciones: UbicacionDisyuncion[] = ubicacionesBase;

//para obtener ubicación por ID
export const getUbicacion = (id: number): UbicacionDisyuncion | undefined => {
	return mockUbicaciones.find((u) => u.id_ubicacion === id);
};
