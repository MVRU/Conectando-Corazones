import type { ParametroRepository } from '../../repositories/ParametroRepository';
import type { Parametro } from '../../entities/Parametro';

export class GetParametroById {
    constructor(private repo: ParametroRepository) { }

    async execute(id: string): Promise<Parametro | null> {
        if (!id) throw new Error('ID requerido');
        return this.repo.findById(id);
    }
}
