import type { Direccion } from '$lib/types/Direccion';
import { mockLocalidades } from '$lib/mocks/mock-localidades';

/*
 * DECISIÓN DE DISEÑO: centraliza las direcciones base para evitar duplicación en joins.
 */
export const mockDirecciones: Direccion[] = [
    {
        id_direccion: 1,
        calle: 'San Martín',
        numero: '456',
        piso: '1',
        departamento: 'A',
        referencia: 'Frente a la plaza principal',
        url_google_maps: 'https://maps.google.com/?q=San+Martín+456',
        localidad_id: mockLocalidades[3].id_localidad,
        localidad: mockLocalidades[3]
    },
    {
        id_direccion: 2,
        calle: 'Calle 8',
        numero: '456',
        referencia: 'Barrio Norte',
        url_google_maps: 'https://maps.google.com/?q=Calle+8+456',
        localidad_id: mockLocalidades[1].id_localidad,
        localidad: mockLocalidades[1]
    },
    {
        id_direccion: 3,
        calle: 'Av. Belgrano',
        numero: '123',
        referencia: 'Frente a la plaza central',
        url_google_maps: 'https://maps.google.com/?q=Av+Belgrano+123',
        localidad_id: mockLocalidades[0].id_localidad,
        localidad: mockLocalidades[0]
    },
    {
        id_direccion: 4,
        calle: 'Av. San Martín',
        numero: '789',
        referencia: 'Esquina con Av. Rivadavia',
        url_google_maps: 'https://maps.google.com/?q=Av+San+Martin+789',
        localidad_id: mockLocalidades[4].id_localidad,
        localidad: mockLocalidades[4]
    },
    {
        id_direccion: 5,
        calle: 'Av. Independencia',
        numero: '321',
        referencia: 'Cerca de la estación',
        url_google_maps: 'https://maps.google.com/?q=Av+Independencia+321',
        localidad_id: mockLocalidades[5].id_localidad,
        localidad: mockLocalidades[5]
    },
    {
        id_direccion: 6,
        calle: 'Calle 8',
        numero: '456',
        referencia: 'Barrio Norte',
        url_google_maps: 'https://maps.google.com/?q=Calle+8+456',
        localidad_id: mockLocalidades[1].id_localidad,
        localidad: mockLocalidades[1]
    },
    {
        id_direccion: 7,
        calle: 'Av. Mitre',
        numero: '654',
        referencia: 'A metros del hospital',
        url_google_maps: 'https://maps.google.com/?q=Av+Mitre+654',
        localidad_id: mockLocalidades[6].id_localidad,
        localidad: mockLocalidades[6]
    },
    {
        id_direccion: 8,
        calle: 'Calle 25',
        numero: '789',
        referencia: 'Barrio Sur',
        url_google_maps: 'https://maps.google.com/?q=Calle+25+789',
        localidad_id: mockLocalidades[7].id_localidad,
        localidad: mockLocalidades[7]
    }
];