/*
* DECISIÓN DE DISEÑO: centraliza la validación de IDs de proyectos.
*/

import { error } from '@sveltejs/kit';
import type { Project } from '$lib/types/Project';

export function encontrarProyectoPorId(idParam: string, lista: Project[]): Project {
    const idNumerico = Number(idParam);

    if (!Number.isInteger(idNumerico)) {
        throw error(404, 'ID de proyecto inválido');
    }

    const proyecto = lista.find((p) => p.id === idNumerico);

    if (!proyecto) {
        throw error(404, 'Proyecto no encontrado');
    }

    return proyecto;
}