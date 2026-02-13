// Endpoint administrativo para reprocesar análisis IA manualmente. Opcional.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analizarProyecto } from '$lib/domain/use-cases/analizarProyecto';

export const config = {
    csrf: false
};

export const POST: RequestHandler = async ({ params }) => {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'ID inválido' }, { status: 400 });
    }

    try {
        await analizarProyecto(id);
        return json({ message: 'Análisis completado y guardado correctamente.' });
    } catch (e) {
        console.error('Error en API analizar proyecto:', e);
        const message = e instanceof Error ? e.message : 'Error interno del servidor';
        return json({ error: message }, { status: 500 });
    }
}
