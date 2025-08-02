/*
 * Está en "data" porque es una lista de datos estáticos
    -*- No son "mocks" porque no simulan nada; son fuentes fijas de verdad (truthy constants).
    -*- Como no cambian (o muy raramente) tampoco se deberían consultar a una API constantemente.
**/

import type { Province } from '$lib/types/Province';

// ! Provincias argentinas según código AFIP/ARCA + ISO 3166-2:AR

export const provinces: Province[] = [
    {
        id: 0,
        name: 'Ciudad Autónoma de Buenos Aires',
        shortName: 'CABA',
        isoCode: 'AR-C',
        capital: 'Ciudad Autónoma de Buenos Aires',
        region: 'Pampeana',
    },
    {
        id: 1,
        name: 'Buenos Aires',
        shortName: 'Bs. As.',
        isoCode: 'AR-B',
        capital: 'La Plata',
        region: 'Pampeana',
    },
    {
        id: 2,
        name: 'Catamarca',
        isoCode: 'AR-K',
        capital: 'San Fernando del Valle de Catamarca',
        region: 'Noroeste',
    },
    {
        id: 3,
        name: 'Córdoba',
        isoCode: 'AR-X',
        capital: 'Córdoba',
        region: 'Pampeana',
    },
    {
        id: 4,
        name: 'Corrientes',
        isoCode: 'AR-W',
        capital: 'Corrientes',
        region: 'Noreste',
    },
    {
        id: 5,
        name: 'Entre Ríos',
        isoCode: 'AR-E',
        capital: 'Paraná',
        region: 'Pampeana',
    },
    {
        id: 6,
        name: 'Jujuy',
        isoCode: 'AR-Y',
        capital: 'San Salvador de Jujuy',
        region: 'Noroeste',
    },
    {
        id: 7,
        name: 'Mendoza',
        isoCode: 'AR-M',
        capital: 'Mendoza',
        region: 'Cuyo',
    },
    {
        id: 8,
        name: 'La Rioja',
        isoCode: 'AR-F',
        capital: 'La Rioja',
        region: 'Noroeste',
    },
    {
        id: 9,
        name: 'Salta',
        isoCode: 'AR-A',
        capital: 'Salta',
        region: 'Noroeste',
    },
    {
        id: 10,
        name: 'San Juan',
        isoCode: 'AR-J',
        capital: 'San Juan',
        region: 'Cuyo',
    },
    {
        id: 11,
        name: 'San Luis',
        isoCode: 'AR-D',
        capital: 'San Luis',
        region: 'Cuyo',
    },
    {
        id: 12,
        name: 'Santa Fe',
        isoCode: 'AR-S',
        capital: 'Santa Fe de la Vera Cruz',
        region: 'Pampeana',
    },
    {
        id: 13,
        name: 'Santiago del Estero',
        isoCode: 'AR-G',
        capital: 'Santiago del Estero',
        region: 'Noroeste',
    },
    {
        id: 14,
        name: 'Tucumán',
        isoCode: 'AR-T',
        capital: 'San Miguel de Tucumán',
        region: 'Noroeste',
    },
    {
        id: 15,
        name: 'Chaco',
        isoCode: 'AR-H',
        capital: 'Resistencia',
        region: 'Noreste',
    },
    {
        id: 16,
        name: 'Chubut',
        isoCode: 'AR-U',
        capital: 'Rawson',
        region: 'Patagónica',
    },
    {
        id: 17,
        name: 'Formosa',
        isoCode: 'AR-P',
        capital: 'Formosa',
        region: 'Noreste',
    },
    {
        id: 18,
        name: 'Misiones',
        isoCode: 'AR-N',
        capital: 'Posadas',
        region: 'Noreste',
    },
    {
        id: 19,
        name: 'Neuquén',
        isoCode: 'AR-Q',
        capital: 'Neuquén',
        region: 'Patagónica',
    },
    {
        id: 20,
        name: 'La Pampa',
        isoCode: 'AR-L',
        capital: 'Santa Rosa',
        region: 'Pampeana',
    },
    {
        id: 21,
        name: 'Río Negro',
        isoCode: 'AR-R',
        capital: 'Viedma',
        region: 'Patagónica',
    },
    {
        id: 22,
        name: 'Santa Cruz',
        isoCode: 'AR-Z',
        capital: 'Río Gallegos',
        region: 'Patagónica',
    },
    {
        id: 23,
        name: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
        shortName: 'Tierra del Fuego',
        isoCode: 'AR-V',
        capital: 'Ushuaia',
        region: 'Patagónica',
    }
];