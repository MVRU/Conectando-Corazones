import type { ParametroRepository } from '../../repositories/ParametroRepository';
import type { Parametro } from '../../entities/Parametro';

export class GetAllParametros {
    constructor(private repo: ParametroRepository) { }

    async execute(filtro?: string): Promise<Parametro[]> {
        return this.repo.findAll(filtro);
    }
}
