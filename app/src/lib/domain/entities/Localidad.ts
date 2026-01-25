// Entidad de dominio: Localidad
import { Provincia } from './Provincia';

export class Localidad {
    id_localidad: number;
    codigo_postal: string;
    nombre: string;
    id_provincia: number;
    provincia?: Provincia;

    constructor(data: Partial<Localidad>) {
        // Invariante: nombre no puede ser nulo ni vacío
        if (!data.nombre || data.nombre.trim() === '') {
            throw new Error('El nombre de la localidad es requerido');
        }

        // Invariante: debe tener id_provincia
        if (data.id_provincia === undefined || data.id_provincia === null) {
            throw new Error('La localidad debe pertenecer a una provincia');
        }

        // Invariante: codigo_postal debe ser string válido
        if (typeof data.codigo_postal !== 'string') {
            throw new Error('El código postal debe ser un string válido');
        }

        this.id_localidad = data.id_localidad ?? 0;
        this.codigo_postal = data.codigo_postal;
        this.nombre = data.nombre.trim();
        this.id_provincia = data.id_provincia;

        if (data.provincia) {
            this.provincia = new Provincia(data.provincia);
        }
    }
}
