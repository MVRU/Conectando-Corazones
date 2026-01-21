// TODO: corregir todo esto

import type { ResenaRepository } from '$lib/domain/repositories/ResenaRepository';
import type { Resena } from '$lib/domain/types/Resena';
import { filtrarResenasPorTipo } from '$lib/utils/resenas';

export class ObtenerResenasPerfil {
	constructor(private resenaRepository: ResenaRepository) {}

	async execute(idUsuario: number | undefined): Promise<Resena[]> {
		if (!idUsuario) return [];
		const resenas = await this.resenaRepository.findByUsuario(idUsuario);
		return filtrarResenasPorTipo(resenas, 'usuario', idUsuario);
	}

	async yaReseno(username: string, idUsuarioResenado: number | undefined): Promise<boolean> {
		if (!username || !idUsuarioResenado) return false;

		const allResenas = await this.resenaRepository.findAll();

		const resenasDelUsuario = allResenas.filter(
			(r) =>
				r.tipo_objeto === 'usuario' && r.id_objeto === idUsuarioResenado && r.username === username
		);

		return resenasDelUsuario.length > 0;
	}
}
