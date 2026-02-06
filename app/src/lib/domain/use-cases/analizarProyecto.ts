import { prisma } from '$lib/infrastructure/prisma/client';
import { GoogleGenerativeAIService } from '$lib/infrastructure/ai/GoogleGenerativeAIService';

export async function analizarProyecto(idProyecto: number) {
    const proyecto = await prisma.proyecto.findUnique({
        where: { id_proyecto: idProyecto },
        include: {
            estado: true,
            participacion_permitida: {
                include: { tipo_participacion: true }
            },
            colaboraciones: {
                where: { estado: 'aprobada' },
                include: {
                    colaboraciones_tipo_participacion: {
                        include: { participacion_permitida: { include: { tipo_participacion: true } } }
                    }
                }
            }
        }
    });

    if (!proyecto) throw new Error('Proyecto no encontrado');

    // Solo analiza si el proyecto está completado
    if (proyecto.estado?.descripcion !== 'completado') {
        throw new Error('El proyecto debe estar en estado completado para realizar el análisis.');
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
        objetivos: proyecto.participacion_permitida.map(p => ({
            tipo: p.tipo_participacion?.descripcion || 'General',
            meta: p.objetivo,
            unidad: p.unidad_medida || 'unidades'
        })),
        colaboraciones: proyecto.colaboraciones.flatMap(c =>
            c.colaboraciones_tipo_participacion.map(ctp => ({
                mensaje: c.mensaje || '',
                estado: c.estado,
                tipo_participacion: ctp.participacion_permitida?.tipo_participacion?.descripcion || 'Varios',
                cantidad: ctp.cantidad
            }))
        ),
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
