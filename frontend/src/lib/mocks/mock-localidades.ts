/*
    *  Está en "mocks" porque hay alrededor de +2.200 ciudades/localidades por provincia...
        -*- Es mejor consultarlas a una API o ver si hay algún dataset que las contenga.
        -*- https://datos.gob.ar/
**/

import type { Localidad } from '$lib/types/Localidad';
import { provincias } from '$lib/data/provincias';

const localidadesBase: Omit<Localidad, 'provincia'>[] = [
    {
        id_localidad: 1,
        nombre: 'Buenos Aires',
        codigo_postal: '1000',
        id_provincia: 1,
    },
    {
        id_localidad: 2,
        nombre: 'La Plata',
        codigo_postal: '1900',
        id_provincia: 1,
    },
    {
        id_localidad: 3,
        nombre: 'CABA',
        codigo_postal: '1000',
        id_provincia: 0,
    },
    {
        id_localidad: 4,
        nombre: 'Rosario',
        codigo_postal: '2000',
        id_provincia: 12,
    },
    {
        id_localidad: 5,
        nombre: 'Córdoba',
        codigo_postal: '5000',
        id_provincia: 3,
    },
    {
        id_localidad: 6,
        nombre: 'Mendoza',
        codigo_postal: '5500',
        id_provincia: 7,
    },
    {
        id_localidad: 7,
        nombre: 'Mar del Plata',
        codigo_postal: '7600',
        id_provincia: 1,
    },
    {
        id_localidad: 8,
        nombre: 'Salta',
        codigo_postal: '4400',
        id_provincia: 9,
    },
    {
        id_localidad: 9,
        nombre: 'San Miguel de Tucumán',
        codigo_postal: '4000',
        id_provincia: 14,
    },
    {
        id_localidad: 10,
        nombre: 'Bariloche',
        codigo_postal: '8400',
        id_provincia: 21,
    },
    {
        id_localidad: 11,
        nombre: 'Neuquén',
        codigo_postal: '8300',
        id_provincia: 19,
    },
    {
        id_localidad: 12,
        nombre: 'Resistencia',
        codigo_postal: '3500',
        id_provincia: 15,
    },
    {
        id_localidad: 13,
        nombre: 'Corrientes',
        codigo_postal: '3400',
        id_provincia: 4,
    },
    {
        id_localidad: 14,
        nombre: 'Posadas',
        codigo_postal: '3300',
        id_provincia: 18,
    },
    {
        id_localidad: 15,
        nombre: 'San Juan',
        codigo_postal: '5400',
        id_provincia: 10,
    },
    {
        id_localidad: 16,
        nombre: 'Ushuaia',
        codigo_postal: '9400',
        id_provincia: 23,
    },
    {
        id_localidad: 17,
        nombre: 'Formosa',
        codigo_postal: '3600',
        id_provincia: 17,
    },
    {
        id_localidad: 18,
        nombre: 'San Salvador de Jujuy',
        codigo_postal: '4600',
        id_provincia: 6,
    },
    {
        id_localidad: 19,
        nombre: 'Catamarca',
        codigo_postal: '4700',
        id_provincia: 2,
    },
    {
        id_localidad: 20,
        nombre: 'Rawson',
        codigo_postal: '9100',
        id_provincia: 16,
    }
];

export const mockLocalidades: Localidad[] = localidadesBase.map((localidad) => ({
    ...localidad,
    provincia: provincias.find((p) => p.id_provincia === localidad.id_provincia)
}));