// Entidad de dominio: Provincia

export class Provincia {
    id_provincia: number;
    nombre: string;
    nombre_corto?: string;
    codigo_iso?: string;

    constructor(data: Partial<Provincia>) {
        // Invariante: nombre no puede ser nulo ni vacío
        if (!data.nombre || data.nombre.trim() === '') {
            throw new Error('El nombre de la provincia es requerido');
        }

        this.id_provincia = data.id_provincia ?? 0;
        this.nombre = data.nombre.trim();
        this.nombre_corto = data.nombre_corto;
        this.codigo_iso = data.codigo_iso;
    }
}
