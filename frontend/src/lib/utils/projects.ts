/*
* DECISIÓN DE DISEÑO: centraliza la validación de IDs de proyectos.
*/
import type { Project } from '$lib/types/Project';

export function encontrarProyectoPorId(idParam: string, lista: Project[]): Project | null {
    const idNumerico = Number(idParam);
    if (!Number.isInteger(idNumerico)) return null;
    return lista.find((p) => p.id === idNumerico) ?? null;
}