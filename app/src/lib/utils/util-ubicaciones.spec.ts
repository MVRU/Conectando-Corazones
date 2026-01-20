import { describe, it, expect } from 'vitest';
import {
	esUbicacionPresencial,
	esUbicacionVirtual,
	construirDireccionCompleta,
	generarUrlGoogleMaps,
	crearUrlGoogleMapsBasica,
	obtenerLocalidadesPorProvincia,
	getLocalidad,
	getProvincia,
	getProvinciaFromLocalidad,
	getCitiesByProvince, // TODO: Actualmente no se usa. ¿Es para implementación futura? Sino borrar.
	getProvinceByCity, // TODO: Actualmente no se usa. ¿Es para implementación futura? Sino borrar.
	searchCities, // TODO: Actualmente no se usa. ¿Es para implementación futura? Sino borrar.
	getAllProvinceNames // TODO: Actualmente no se usa. ¿Es para implementación futura? Sino borrar.
} from './util-ubicaciones';
import type { UbicacionPresencial, UbicacionVirtual } from '$lib/domain/types/Ubicacion';
import type { Localidad } from '$lib/domain/types/Localidad';

describe('util-ubicaciones', () => {
	describe('Type guards', () => {
		const ubicacionPresencial: UbicacionPresencial = {
			modalidad: 'presencial',
			tipo_ubicacion: 'principal',
			calle: 'Av. Corrientes',
			numero: '1234',
			localidad_id: 1,
			localidad: {
				id_localidad: 1,
				nombre: 'Buenos Aires',
				id_provincia: 1,
				codigo_postal: '1000',
				provincia: { id_provincia: 1, nombre: 'CABA' }
			}
		};

		const ubicacionVirtual: UbicacionVirtual = {
			modalidad: 'virtual',
			tipo_ubicacion: 'secundaria',
			url_virtual: 'https://meet.google.com/abc-def-ghi'
		};

		it('esUbicacionPresencial detecta ubicación presencial correctamente', () => {
			expect(esUbicacionPresencial(ubicacionPresencial)).toBe(true);
			expect(esUbicacionPresencial(ubicacionVirtual)).toBe(false);
			expect(esUbicacionPresencial(undefined)).toBe(false);
			expect(esUbicacionPresencial(null as any)).toBe(false);
		});

		it('esUbicacionVirtual detecta ubicación virtual correctamente', () => {
			expect(esUbicacionVirtual(ubicacionVirtual)).toBe(true);
			expect(esUbicacionVirtual(ubicacionPresencial)).toBe(false);
			expect(esUbicacionVirtual(undefined)).toBe(false);
			expect(esUbicacionVirtual(null as any)).toBe(false);
		});
	});

	describe('construirDireccionCompleta', () => {
		it('construye dirección completa con todos los campos', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				}
			};

			expect(construirDireccionCompleta(ubicacion)).toBe('Av. Corrientes 1234, Buenos Aires, CABA');
		});

		it('construye dirección con espacios en blanco y limpia correctamente', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: '  Av. Corrientes  ',
				numero: '  1234  ',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: '  Buenos Aires  ',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: '  CABA  ' }
				}
			};

			expect(construirDireccionCompleta(ubicacion)).toBe('Av. Corrientes 1234, Buenos Aires, CABA');
		});
	});

	describe('generarUrlGoogleMaps', () => {
		it('prioriza url_google_maps manual si existe', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				},
				url_google_maps: 'https://goo.gl/maps/abc123'
			};

			expect(generarUrlGoogleMaps(ubicacion)).toBe('https://goo.gl/maps/abc123');
		});

		it('genera URL de búsqueda automática cuando no hay URL manual', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				}
			};

			const url = generarUrlGoogleMaps(ubicacion)!;
			expect(url.startsWith('https://www.google.com/maps/search/?api=1&query=')).toBe(true);
			expect(decodeURIComponent(url.split('query=')[1])).toBe(
				'Av. Corrientes 1234, Buenos Aires, CABA'
			);
		});

		it('devuelve null si no hay dirección para generar URL', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: '',
				numero: '',
				localidad_id: undefined as any,
				localidad: undefined as any
			};

			expect(generarUrlGoogleMaps(ubicacion)).toBeNull();
		});

		it('ignora URL manual vacía o con solo espacios', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				},
				url_google_maps: '   '
			};

			const url = generarUrlGoogleMaps(ubicacion)!;
			expect(url.startsWith('https://www.google.com/maps/search/?api=1&query=')).toBe(true);
		});

		it('agrega protocolo https:// si falta en URL manual', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				},
				url_google_maps: 'goo.gl/maps/abc123'
			};

			const url = generarUrlGoogleMaps(ubicacion);
			expect(url).toBe('https://goo.gl/maps/abc123');
		});

		it('respeta protocolo existente en URL manual', () => {
			const ubicacion: UbicacionPresencial = {
				modalidad: 'presencial',
				tipo_ubicacion: 'principal',
				calle: 'Av. Corrientes',
				numero: '1234',
				localidad_id: 1,
				localidad: {
					id_localidad: 1,
					nombre: 'Buenos Aires',
					id_provincia: 1,
					codigo_postal: '1000',
					provincia: { id_provincia: 1, nombre: 'CABA' }
				},
				url_google_maps: 'http://maps.google.com/abc'
			};

			const url = generarUrlGoogleMaps(ubicacion);
			expect(url).toBe('http://maps.google.com/abc');
		});
	});

	describe('crearUrlGoogleMapsBasica', () => {
		it('codifica dirección correctamente', () => {
			const url = crearUrlGoogleMapsBasica('Av. Corrientes 1234, Buenos Aires');
			expect(url).toBe('https://maps.google.com/?q=Av.%20Corrientes%201234%2C%20Buenos%20Aires');
		});

		it('codifica caracteres especiales', () => {
			const url = crearUrlGoogleMapsBasica('Calle Ñandú 456, Río Cuarto');
			expect(url).toContain('https://maps.google.com/?q=');
			expect(decodeURIComponent(url.split('?q=')[1])).toBe('Calle Ñandú 456, Río Cuarto');
		});

		it('maneja direcciones vacías', () => {
			const url = crearUrlGoogleMapsBasica('');
			expect(url).toBe('https://maps.google.com/?q=');
		});
	});

	describe('obtenerLocalidadesPorProvincia', () => {
		it('devuelve array de localidades para provincia existente', () => {
			const localidades = obtenerLocalidadesPorProvincia('Buenos Aires');
			expect(Array.isArray(localidades)).toBe(true);
		});

		it('devuelve array vacío para provincia inexistente', () => {
			const localidades = obtenerLocalidadesPorProvincia('Provincia Falsa XYZ');
			expect(localidades).toEqual([]);
		});

		it('filtra correctamente por id_provincia', () => {
			const localidades = obtenerLocalidadesPorProvincia('Buenos Aires');
			if (localidades.length > 0) {
				const primerIdProvincia = localidades[0].id_provincia;
				expect(localidades.every((l) => l.id_provincia === primerIdProvincia)).toBe(true);
			}
		});
	});

	describe('Getters básicos', () => {
		it('getLocalidad devuelve localidad por ID', () => {
			const localidad = getLocalidad(1);
			if (localidad) {
				expect(localidad.id_localidad).toBe(1);
			}
		});

		it('getLocalidad devuelve undefined para ID inexistente', () => {
			const localidad = getLocalidad(999999);
			expect(localidad).toBeUndefined();
		});

		it('getProvincia devuelve provincia por ID', () => {
			const provincia = getProvincia(1);
			if (provincia) {
				expect(provincia.id_provincia).toBe(1);
			}
		});
	});

	describe('getProvinciaFromLocalidad', () => {
		it('obtiene provincia desde localidad válida', () => {
			const localidad: Localidad = {
				id_localidad: 1,
				nombre: 'Buenos Aires',
				id_provincia: 1,
				codigo_postal: '1000',
				provincia: { id_provincia: 1, nombre: 'CABA' }
			};

			const provincia = getProvinciaFromLocalidad(localidad);
			expect(provincia).toBeDefined();
			expect(provincia?.id_provincia).toBe(1);
		});

		it('devuelve undefined si localidad no tiene id_provincia', () => {
			const localidad = {
				id_localidad: 1,
				nombre: 'Test',
				id_provincia: undefined
			} as any;

			expect(getProvinciaFromLocalidad(localidad)).toBeUndefined();
		});

		it('devuelve undefined si localidad es undefined', () => {
			expect(getProvinciaFromLocalidad(undefined)).toBeUndefined();
		});
	});

	describe('getCitiesByProvince', () => {
		it('devuelve array de nombres de ciudades', () => {
			const ciudades = getCitiesByProvince('Buenos Aires');
			expect(Array.isArray(ciudades)).toBe(true);
		});

		it('es case-insensitive', () => {
			const ciudades1 = getCitiesByProvince('Buenos Aires');
			const ciudades2 = getCitiesByProvince('buenos aires');
			const ciudades3 = getCitiesByProvince('BUENOS AIRES');

			expect(ciudades1).toEqual(ciudades2);
			expect(ciudades2).toEqual(ciudades3);
		});

		it('devuelve array vacío para provincia inexistente', () => {
			const ciudades = getCitiesByProvince('Provincia Inexistente');
			expect(ciudades).toEqual([]);
		});
	});

	describe('getProvinceByCity', () => {
		it('devuelve provincia para ciudad existente', () => {
			const provincia = getProvinceByCity('Buenos Aires');
			if (provincia) {
				expect(provincia.nombre).toBeDefined();
			}
		});

		it('es case-insensitive', () => {
			const prov1 = getProvinceByCity('Buenos Aires');
			const prov2 = getProvinceByCity('buenos aires');
			expect(prov1).toEqual(prov2);
		});

		it('devuelve undefined para ciudad inexistente', () => {
			const provincia = getProvinceByCity('Ciudad Inexistente XYZ');
			expect(provincia).toBeUndefined();
		});
	});

	describe('searchCities', () => {
		it('devuelve ciudades que coinciden parcialmente', () => {
			const resultados = searchCities('Buenos');
			expect(Array.isArray(resultados)).toBe(true);
			// Todas deberían contener "Buenos"
			resultados.forEach((ciudad) => {
				expect(ciudad.toLowerCase()).toContain('buenos');
			});
		});

		it('devuelve array vacío para query vacío', () => {
			expect(searchCities('')).toEqual([]);
			expect(searchCities('   ')).toEqual([]);
		});

		it('es case-insensitive', () => {
			const res1 = searchCities('buenos');
			const res2 = searchCities('Buenos');
			const res3 = searchCities('BUENOS');

			expect(res1).toEqual(res2);
			expect(res2).toEqual(res3);
		});
	});

	describe('getAllProvinceNames', () => {
		it('devuelve array de nombres de provincias', () => {
			const provincias = getAllProvinceNames();
			expect(Array.isArray(provincias)).toBe(true);
			expect(provincias.length).toBeGreaterThan(0);
		});

		it('devuelve provincias ordenadas alfabéticamente', () => {
			const provincias = getAllProvinceNames();
			const ordenadas = [...provincias].sort((a, b) => a.localeCompare(b));
			expect(provincias).toEqual(ordenadas);
		});

		it('no contiene duplicados', () => {
			const provincias = getAllProvinceNames();
			const unicos = [...new Set(provincias)];
			expect(provincias.length).toBe(unicos.length);
		});
	});
});
