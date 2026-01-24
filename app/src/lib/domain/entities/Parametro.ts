export type TipoParametro = 'string' | 'integer' | 'float' | 'boolean' | 'json';

export class Parametro {
    id_parametro: string;
    nombre: string;
    valor: string;
    tipo: TipoParametro;
    descripcion: string;

    constructor(data: Partial<Parametro>) {
        if (!data.id_parametro) throw new Error('El ID del parámetro es requerido');
        if (!data.nombre) throw new Error('El nombre es requerido');
        if (data.valor === undefined || data.valor === null) throw new Error('El valor es requerido');

        this.id_parametro = data.id_parametro;
        this.nombre = data.nombre;
        this.valor = data.valor;
        this.tipo = (data.tipo as TipoParametro) || 'string';
        this.descripcion = data.descripcion || '';
    }
}
