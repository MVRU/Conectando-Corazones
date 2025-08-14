/*
 * Está en "data" porque es una lista de datos estáticos
    -*- No son "mocks" porque no simulan nada; son fuentes fijas de verdad (truthy constants).
    -*- Como no cambian (o muy raramente) tampoco se deberían consultar a una API constantemente.
**/

import type { Provincia } from '$lib/types/Provincia';

// ! Provincias argentinas según código AFIP/ARCA + ISO 3166-2:AR

export const provincias: Provincia[] = [
    {
        id_provincia: 0,
        nombre: 'Ciudad Autónoma de Buenos Aires',
        nombre_corto: 'CABA',
        codigo_iso: 'AR-C',
    },
    {
        id_provincia: 1,
        nombre: 'Buenos Aires',
        nombre_corto: 'Bs. As.',
        codigo_iso: 'AR-B',
    },
    {
        id_provincia: 2,
        nombre: 'Catamarca',
        codigo_iso: 'AR-K',
    },
    {
        id_provincia: 3,
        nombre: 'Córdoba',
        codigo_iso: 'AR-X',
    },
    {
        id_provincia: 4,
        nombre: 'Corrientes',
        codigo_iso: 'AR-W',
    },
    {
        id_provincia: 5,
        nombre: 'Entre Ríos',
        codigo_iso: 'AR-E',
    },
    {
        id_provincia: 6,
        nombre: 'Jujuy',
        codigo_iso: 'AR-Y',
    },
    {
        id_provincia: 7,
        nombre: 'Mendoza',
        codigo_iso: 'AR-M',
    },
    {
        id_provincia: 8,
        nombre: 'Rioja',
        codigo_iso: 'AR-F',
    },
    {
        id_provincia: 9,
        nombre: 'Salta',
        codigo_iso: 'AR-A',
    },
    {
        id_provincia: 10,
        nombre: 'San Juan',
        codigo_iso: 'AR-J',
    },
    {
        id_provincia: 11,
        nombre: 'San Luis',
        codigo_iso: 'AR-D',
    },
    {
        id_provincia: 12,
        nombre: 'Santa Fe',
        codigo_iso: 'AR-S',
    },
    {
        id_provincia: 13,
        nombre: 'Santiago del Estero',
        codigo_iso: 'AR-G',
    },
    {
        id_provincia: 14,
        nombre: 'Tucumán',
        codigo_iso: 'AR-T',
    },
    {
        id_provincia: 15,
        nombre: 'Chaco',
        codigo_iso: 'AR-H',
    },
    {
        id_provincia: 16,
        nombre: 'Chubut',
        codigo_iso: 'AR-U',
    },
    {
        id_provincia: 17,
        nombre: 'Formosa',
        codigo_iso: 'AR-P',
    },
    {
        id_provincia: 18,
        nombre: 'Misiones',
        codigo_iso: 'AR-N',
    },
    {
        id_provincia: 19,
        nombre: 'Neuquén',
        codigo_iso: 'AR-Q',
    },
    {
        id_provincia: 20,
        nombre: 'La Pampa',
        codigo_iso: 'AR-L',
    },
    {
        id_provincia: 21,
        nombre: 'Río Negro',
        codigo_iso: 'AR-R',
    },
    {
        id_provincia: 22,
        nombre: 'Santa Cruz',
        codigo_iso: 'AR-Z',
    },
    {
        id_provincia: 23,
        nombre: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
        nombre_corto: 'Tierra del Fuego',
        codigo_iso: 'AR-V',
    }
];