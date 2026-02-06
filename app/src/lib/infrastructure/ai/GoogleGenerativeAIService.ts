import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

interface ProjectContext {
    titulo: string;
    descripcion: string;
    resenas: { contenido: string; puntaje: number }[];
    progreso: {
        tipo: string;
        meta: number;
        alcanzado: number;
        unidad: string;
        estado: string;
    }[];
}

export interface AnalysisResult {
    resumen: string;
    aprendizajes: string;
}

export class GoogleGenerativeAIService {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        if (!env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY no está definida en las variables de entorno.');
        }
        this.genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-2.5-flash-lite',
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
    }

    async analyzeProject(context: ProjectContext): Promise<AnalysisResult> {
        const prompt = `
            Actúa como un experto con muchos años liderando proyectos de servicio y voluntariado. Participaste activamente en este proyecto y has leído todas las reseñas de participantes involucrados. Tu tarea es generar un resumen completo y aprendizajes accionables sobre el siguiente proyecto:

            TÍTULO: ${context.titulo}
            DESCRIPCIÓN: ${context.descripcion}
            
            CUMPLIMIENTO DE OBJETIVOS (META vs REAL):
            ${JSON.stringify(context.progreso)}
            
            RESEÑAS:
            ${JSON.stringify(context.resenas)}

            Genera un JSON con EXACTAMENTE estas dos claves:

            1. "resumen": Redacta un párrafo extenso (8–15 líneas) en español argentino claro. Debe:
               - Destacar los logros y aspectos positivos del proyecto.
               - Mencionar explicitamente si se alcanzaron o superaron las metas basándote en los datos de "CUMPLIMIENTO DE OBJETIVOS". Si no se alcanzaron, mencionarlo constructivamente.
               - Indicar el alcance real, impacto en beneficiarios y participación de voluntarios.
               - Indicar los logros alcanzados.
               - Indicar el promedio de puntaje de las reseñas para el proyecto y una justificación breve (usar formato X.X/5).

            2. "aprendizajes": Lista de bullets en el siguiente formato:
               - Cada bullet empieza indicando un aspecto a mejorar (problema detectado) basado en observaciones y reseñas.
               - Luego indica posibles soluciones específicas y concretas, ofreciendo **opciones prácticas** si hay más de una manera de abordar el problema.
               - Usá formato de lista conciso: cada bullet = problema + sugerencia(s).
               - Evitá repetir "problema" o "solución" para priorizar el contenido.
               - Ofrecé soluciones concretas, realistas y factibles para instituciones con recursos limitados.
               - NO incluir "comunicación" o "chat" como aspectos a mejorar, ya que la plataforma ya cuenta con un chat interno.
               
            Formato esperado de salida estricta:
            {
              "resumen": "...",
              "aprendizajes": [
                "- Aspecto a mejorar y propuesta(s).",
                "- Otro aspecto a mejorar y propuesta(s)."
              ]
            }

            IMPORTANTE: Responde ÚNICAMENTE con el objeto JSON válido.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            const rawResult = JSON.parse(text);

            let aprendizajesString = "";
            if (Array.isArray(rawResult.aprendizajes)) {
                aprendizajesString = rawResult.aprendizajes.join('\n');
            } else if (typeof rawResult.aprendizajes === 'string') {
                aprendizajesString = rawResult.aprendizajes;
            }

            return {
                resumen: rawResult.resumen,
                aprendizajes: aprendizajesString
            };

        } catch (error) {
            console.error('Error Google AI:', error);
            throw new Error('Fallo al generar análisis de IA');
        }
    }
}
