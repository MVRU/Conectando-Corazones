import type { ParametroRepository } from '../../repositories/ParametroRepository';
import type { Parametro } from '../../entities/Parametro';

export class GetParametroById {
    constructor(private repo: ParametroRepository) { }

    async execute(id: number): Promise<Parametro | null> {
        return this.repo.findById(id);
    }
}
