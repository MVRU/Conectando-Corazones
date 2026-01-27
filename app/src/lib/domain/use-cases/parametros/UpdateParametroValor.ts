import type { ParametroRepository } from '../../repositories/ParametroRepository';
import type { Parametro, TipoParametro } from '../../entities/Parametro';

export class UpdateParametroValor {
    constructor(private repo: ParametroRepository) { }

    async execute(id: number, nuevoValor: string): Promise<Parametro> {
        if (nuevoValor === undefined || nuevoValor === null) throw new Error('Valor requerido');
        if (nuevoValor.trim() === '') throw new Error('El valor no puede estar vacío');

        const existe = await this.repo.findById(id);
        if (!existe) throw new Error('Parámetro no encontrado');

        this.validarValor(nuevoValor, existe.tipo);

        return this.repo.updateValor(id, nuevoValor);
    }

    private validarValor(nuevoValor: string, tipo: TipoParametro): void {
        switch (tipo) {
            case 'integer':
                if (!/^-?\d+$/.test(nuevoValor)) {
                    throw new Error(`El valor '${nuevoValor}' no es un entero válido.`);
                }
                break;
            case 'float':
                if (isNaN(parseFloat(nuevoValor))) {
                    throw new Error(`El valor '${nuevoValor}' no es un número decimal válido.`);
                }
                break;
            case 'boolean': {
                const lower = nuevoValor.trim().toLowerCase();
                if (lower !== 'true' && lower !== 'false') {
                    throw new Error(`El valor '${nuevoValor}' no es un booleano válido (true/false).`);
                }
                break;
            }
            case 'json':
                try {
                    JSON.parse(nuevoValor);
                } catch {
                    throw new Error(`El valor no es un JSON válido.`);
                }
                break;
            case 'string':
            default:
                break;
        }
    }
}
