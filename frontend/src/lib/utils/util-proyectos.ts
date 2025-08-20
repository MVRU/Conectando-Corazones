/*
* DECISIÓN DE DISEÑO: centraliza la diferentes helpers y utils para proyectos
*/

import { error } from '@sveltejs/kit';
import type { Proyecto } from '$lib/types/Proyecto';
import { PRIORIDAD_TIPO, type ProyectoUbicacion } from '$lib/types/ProyectoUbicacion';
import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';
import { ESTADO_LABELS, type EstadoDescripcion } from '$lib/types/Estado';

const ESTADO_PRIORIDAD: Record<EstadoDescripcion, number> = {
    en_curso: 0,
    pendiente_solicitud_cierre: 1,
    en_revision: 2,
    en_auditoria: 3,
    completado: 4,
    cancelado: 5
};

export function getProyectoById(idParam: string, lista: Proyecto[]): Proyecto {
    const idNumerico = Number(idParam);

    if (!Number.isInteger(idNumerico)) {
        throw error(404, 'ID de proyecto inválido');
    }

    const proyecto = lista.find((p) => p.id_proyecto === idNumerico);

    if (!proyecto) {
        throw error(404, 'Proyecto no encontrado');
    }

    return proyecto;
}

export function filtrarProyectos(
    proyectos: Proyecto[],
    filtros: string[],
    searchQuery: string,
    estado: string,
    provincia: string
): Proyecto[] {
    let resultado = [...proyectos];

    if (!filtros.includes('Todos')) {
        const tiposEsperados = filtros.filter((f) => f !== 'Todos');
        resultado = resultado.filter((p) =>
            p.participacion_permitida?.some(
                (pp) =>
                    pp.tipo_participacion?.descripcion &&
                    tiposEsperados.includes(pp.tipo_participacion.descripcion)
            )
        );
    }

    if (estado !== 'Todos') {
        resultado = resultado.filter((p) => ESTADO_LABELS[p.estado?.descripcion ?? 'en_curso'] === estado);
    }

    if (provincia !== 'Todas') {
        resultado = resultado.filter(
            (p) => getProvinciaFromLocalidad(p.ubicaciones?.[0]?.localidad)?.nombre === provincia
        );
    }

    if (searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        resultado = resultado.filter(
            (p) =>
                p.titulo.toLowerCase().includes(query) ||
                p.institucion?.nombre_legal?.toLowerCase().includes(query)
        );
    }

    resultado.sort((a, b) => {
        const prioridadEstadoA = ESTADO_PRIORIDAD[a.estado?.descripcion ?? 'en_curso'] ?? 3;
        const prioridadEstadoB = ESTADO_PRIORIDAD[b.estado?.descripcion ?? 'en_curso'] ?? 3;

        if (prioridadEstadoA !== prioridadEstadoB) {
            return prioridadEstadoA - prioridadEstadoB;
        }

        const fechaA = new Date(a.created_at || '').getTime();
        const fechaB = new Date(b.created_at || '').getTime();
        return fechaA - fechaB;
    });

    return resultado;
}

//**
// * Utilidades para Proyecto-Ubicación
//  */

export function seleccionarUbicacion(
    ubicaciones: ProyectoUbicacion[],
    tipoPreferido: string = 'principal'
): ProyectoUbicacion | undefined {
    const especifica = ubicaciones.find((u) => u.tipo_ubicacion === tipoPreferido);
    if (especifica) return especifica;

    for (const tipo of PRIORIDAD_TIPO) {
        const encontrada = ubicaciones.find((u) => u.tipo_ubicacion === tipo);
        if (encontrada) return encontrada;
    }
    return undefined;
}

export const getUbicacionPrincipal = (proyecto: Proyecto): ProyectoUbicacion | undefined =>
    proyecto.ubicaciones?.find((u) => u.tipo_ubicacion === 'principal') ?? proyecto.ubicaciones?.[0];