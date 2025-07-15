/*
    *  Está en "mocks" porque hay alrededor de +2.200 ciudades/localidades por provincia...
        -*- Es mejor consultarlas a una API o ver si hay algún dataset que las contenga.
        -*- https://datos.gob.ar/
**/

import type { Location } from '$lib/types/Location';
import { provinces } from '$lib/data/provinces';

export const locations: Location[] = [
    {
        id: 1,
        name: 'Buenos Aires',
        postalCode: '1000',
        province: provinces.find((p) => p.name === 'Buenos Aires')!
    },
    {
        id: 2,
        name: 'La Plata',
        postalCode: '1900',
        province: provinces.find((p) => p.name === 'Buenos Aires')!
    },
    {
        id: 3,
        name: 'CABA',
        postalCode: '1000',
        province: provinces.find((p) => p.name === 'Ciudad Autónoma de Buenos Aires')!
    },
    {
        id: 4,
        name: 'Rosario',
        postalCode: '2000',
        province: provinces.find((p) => p.name === 'Santa Fe')!
    },
    {
        id: 5,
        name: 'Córdoba',
        postalCode: '5000',
        province: provinces.find((p) => p.name === 'Córdoba')!
    },
    {
        id: 6,
        name: 'Mendoza',
        postalCode: '5500',
        province: provinces.find((p) => p.name === 'Mendoza')!
    },
    {
        id: 7,
        name: 'Mar del Plata',
        postalCode: '7600',
        province: provinces.find((p) => p.name === 'Buenos Aires')!
    },
    {
        id: 8,
        name: 'Salta',
        postalCode: '4400',
        province: provinces.find((p) => p.name === 'Salta')!
    },
    {
        id: 9,
        name: 'San Miguel de Tucumán',
        postalCode: '4000',
        province: provinces.find((p) => p.name === 'Tucumán')!
    },
    {
        id: 10,
        name: 'Bariloche',
        postalCode: '8400',
        province: provinces.find((p) => p.name === 'Río Negro')!
    },
    {
        id: 11,
        name: 'Neuquén',
        postalCode: '8300',
        province: provinces.find((p) => p.name === 'Neuquén')!
    },
    {
        id: 12,
        name: 'Resistencia',
        postalCode: '3500',
        province: provinces.find((p) => p.name === 'Chaco')!
    },
    {
        id: 13,
        name: 'Corrientes',
        postalCode: '3400',
        province: provinces.find((p) => p.name === 'Corrientes')!
    },
    {
        id: 14,
        name: 'Posadas',
        postalCode: '3300',
        province: provinces.find((p) => p.name === 'Misiones')!
    },
    {
        id: 15,
        name: 'San Juan',
        postalCode: '5400',
        province: provinces.find((p) => p.name === 'San Juan')!
    },
    {
        id: 16,
        name: 'Ushuaia',
        postalCode: '9400',
        province: provinces.find((p) => p.name === 'Tierra del Fuego')!
    },
    {
        id: 17,
        name: 'Formosa',
        postalCode: '3600',
        province: provinces.find((p) => p.name === 'Formosa')!
    },
    {
        id: 18,
        name: 'San Salvador de Jujuy',
        postalCode: '4600',
        province: provinces.find((p) => p.name === 'Jujuy')!
    },
    {
        id: 19,
        name: 'Catamarca',
        postalCode: '4700',
        province: provinces.find((p) => p.name === 'Catamarca')!
    },
    {
        id: 20,
        name: 'Rawson',
        postalCode: '9100',
        province: provinces.find((p) => p.name === 'Chubut')!
    }
];

export default locations;