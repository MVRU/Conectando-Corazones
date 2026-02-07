import { PostgresProyectoRepository } from '$lib/infrastructure/supabase/postgres/proyecto.repo';
import { prisma } from '$lib/infrastructure/prisma/client';
import { GoogleGenerativeAIService } from '$lib/infrastructure/ai/GoogleGenerativeAIService';

export async function analizarProyecto(idProyecto: number) {
	const repo = new PostgresProyectoRepository();
	const proyecto = await repo.findById(idProyecto);

	if (!proyecto) throw new Error('Proyecto no encontrado');

	// Si ya tiene resumen o aprendizajes, no se vuelve a generar (evita costos innecesarios y duplicidad)
	if (proyecto.resumen || proyecto.aprendizajes) {
		return { success: true, skipped: true };
	}

	if (!proyecto.estaFinalizado()) {
		throw new Error(`El proyecto no está completado (Estado actual: ${proyecto.estado}).`);
	}

	// Si hay demasiadas reseñas, priorizamos las más significativas
	let resenasDocs = await prisma.resena.findMany({
		where: {
			tipo_objeto: 'proyecto',
			id_objeto: idProyecto
		}
	});

	if (resenasDocs.length > 20) {
		resenasDocs = resenasDocs
			.sort((a, b) => {
				// Priorizar puntajes bajos (críticas) para detectar problemas
				if (a.puntaje !== b.puntaje) return a.puntaje - b.puntaje;
				// Luego priorizar las más largas (más contenido informativo)
				return b.contenido.length - a.contenido.length;
			})
			.slice(0, 20);
	}

	const context = {
		titulo: proyecto.titulo,
		descripcion: proyecto.descripcion,
		beneficiarios: proyecto.beneficiarios || 'No especificado',
		progreso: (proyecto.participacion_permitida || []).map((p) => ({
			tipo: p.tipo_participacion?.descripcion || 'General',
			meta: p.objetivo,
			alcanzado: p.actual || 0,
			unidad: p.unidad_medida || 'unidades',
			especie: p.especie || null,
			estado: (p.actual || 0) >= p.objetivo ? 'Meta Alcanzada' : 'No Alcanzada'
		})),
		resenas: resenasDocs.map((r) => ({
			contenido: r.contenido,
			puntaje: r.puntaje
		}))
	};

	try {
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
	} catch (error) {
		return { success: false, error: 'Fallo en servicio de IA' };
	}
}
