/*
* DECISIÓN DE DISEÑO: centraliza la diferentes helpers y utils para proyectos
*/

import { error } from '@sveltejs/kit';
import type { Proyecto } from '$lib/types/Proyecto';
import { getProvinciaFromLocalidad } from '$lib/utils/util-ubicaciones';

const ESTADO_PRIORIDAD: Record<string, number> = {
    'En curso': 0,
    'Pendiente de solicitud de cierre': 1,
    'En revisión': 2,
    'En auditoría': 3,
    'Completado': 4,
    'Cancelado': 5
};

export function encontrarProyectoPorId(idParam: string, lista: Proyecto[]): Proyecto {
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

function estadoTemporizadorProyecto(p: Proyecto): string { // FIX: esta lógica hay que sacarla
    const hoy = new Date();
    const inicio = p.created_at ? new Date(p.created_at) : null;
    const cierre = p.fecha_fin_tentativa ? new Date(p.fecha_fin_tentativa) : null;

    if (!inicio || !cierre) return 'Abierto';
    if (hoy > cierre) return 'Completado';
    if (hoy >= inicio && hoy <= cierre) return 'En curso';
    return 'Abierto';
}

export function filtrarProyectos(
    proyectos: Proyecto[],
    filtros: string[],
    searchQuery: string,
    estado: string,
    urgencia: string,
    provincia: string,
    reverseMap: Record<string, string>
): Proyecto[] {
    let resultado = [...proyectos];

    if (!filtros.includes('Todos')) {
        const tiposEsperados = filtros.filter((f) => f !== 'Todos').map((f) => reverseMap[f]);

        resultado = resultado.filter((p) =>
            p.participacion_permitida?.some(
                (pp) =>
                    pp.tipo_participacion?.descripcion &&
                    tiposEsperados.includes(pp.tipo_participacion.descripcion)
            )
        );
    }

    if (estado !== 'Todos') {
        resultado = resultado.filter((p) => estadoTemporizadorProyecto(p) === estado);
    }

    if (urgencia !== 'Todas') {
        // TODO: Implementar urgencia cuando esté en el tipo
    }

    if (provincia !== 'Todas') {
        resultado = resultado.filter(
            (p) => getProvinciaFromLocalidad(p.direccion?.localidad)?.nombre === provincia
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
        const estadoA = estadoTemporizadorProyecto(a);
        const estadoB = estadoTemporizadorProyecto(b);
        const prioridadEstadoA = ESTADO_PRIORIDAD[estadoA] ?? 3;
        const prioridadEstadoB = ESTADO_PRIORIDAD[estadoB] ?? 3;

        if (prioridadEstadoA !== prioridadEstadoB) {
            return prioridadEstadoA - prioridadEstadoB;
        }

        const fechaA = new Date(a.created_at || '').getTime();
        const fechaB = new Date(b.created_at || '').getTime();
        return fechaA - fechaB;
    });

    return resultado;
}