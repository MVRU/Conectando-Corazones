import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { prisma } from '$lib/infrastructure/prisma/client';
import { GoogleGenerativeAIService } from '$lib/infrastructure/ai/GoogleGenerativeAIService';

export async function analizarProyecto(idProyecto: number) {
    const repo = new PostgresProyectoRepository();
    const proyecto = await repo.findById(idProyecto);

    if (!proyecto) throw new Error('Proyecto no encontrado');

    if (!proyecto.estaFinalizado()) {
        throw new Error(`El proyecto no está completado (Estado actual: ${proyecto.estado}).`);
    }

    const resenas = await prisma.resena.findMany({
        where: {
            tipo_objeto: 'proyecto',
            id_objeto: idProyecto
        }
    });

    const context = {
        titulo: proyecto.titulo,
        descripcion: proyecto.descripcion,
        progreso: (proyecto.participacion_permitida || []).map(p => ({
            tipo: p.tipo_participacion?.descripcion || 'General',
            meta: p.objetivo,
            alcanzado: p.actual || 0,
            unidad: p.unidad_medida || 'unidades',
            estado: (p.actual || 0) >= p.objetivo ? 'Meta Alcanzada' : 'No Alcanzada'
        })),
        resenas: resenas.map(r => ({
            contenido: r.contenido,
            puntaje: r.puntaje
        }))
    };

    // Ejecución IA
    const aiService = new GoogleGenerativeAIService();
    const analisis = await aiService.analyzeProject(context);

    // Persistencia
    await prisma.proyecto.update({
        where: { id_proyecto: idProyecto },
        data: {
            resumen: analisis.resumen,
            aprendizajes: analisis.aprendizajes
        }
    });

    return { success: true };
}
