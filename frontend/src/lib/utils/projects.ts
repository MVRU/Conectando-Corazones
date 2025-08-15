/*
* DECISIÓN DE DISEÑO: centraliza la validación de IDs de proyectos.
*/

import { error } from '@sveltejs/kit';
import type { Proyecto } from '$lib/types/Proyecto';

export function encontrarProyectoPorId(idParam: string, lista: Proyecto[]): Proyecto {
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