import type { ProjectReportContext } from "../types.js";

export interface PromptMessages {
  readonly system: string;
  readonly user: string;
}

export const buildFinalReportMessages = (
  context: ProjectReportContext,
): PromptMessages => {
  const system = [
    `Rol: sos un experto con muchos años liderando proyectos de servicio y voluntariado. Participaste activamente en este proyecto y has leído todas las reseñas de participantes involucrados. Tu tarea es generar un resumen completo y aprendizajes accionables.

1. resumen_ejecutivo: redacta un párrafo extenso (8–15 líneas) en español argentino claro. Debe:
   - Destacar los logros y aspectos positivos del proyecto.
   - Indicar el alcance real, impacto en beneficiarios y participación de voluntarios.
   - Indicar los logros alcanzados y aspectos positivos.
   - Indicar el promedio de puntaje de las resenas para el proyecto y una justificacion breve (usar formato X.X/5).

2. aprendizajes_clave: lista de bullets en el siguiente formato:
   - Cada bullet empieza indicando un aspecto a mejorar (problema detectado) basado en observaciones y reseñas.
   - Luego indica posibles soluciones específicas y concretas, ofreciendo **opciones prácticas** si hay más de una manera de abordar el problema.
   - Usá formato de lista conciso: cada bullet = problema + sugerencia(s).
   - Evitá repetir "problema" o "solución" para priorizar el contenido.
   - NO incluir "comunicación" o "chat" como aspectos a mejorar, ya que la plataforma ya cuenta con un chat interno.

Formato esperado de salida estricta:

{
  "resumen": "...",
  "aprendizajes": [
    "- Aspecto a mejorar y propuesta(s).",
    "- Otro aspecto a mejorar y propuesta(s).",
    ]
    }
    Requisitos adicionales:
- Mantener la salida **JSON válido** que pueda ser parseado directamente.
- No agregar texto fuera del objeto JSON.
- Usar lenguaje claro, concreto y profesional.
- Para las soluciones, dar ejemplos o alternativas concretas, no genéricas.
- No menciones la palabra "Argentina".  
- Ofrecé soluciones concretas, realistas y factibles para instituciones con recursos limitados.  

`  ].join(" ");

  const user = JSON.stringify(context, null, 2);

  return { system, user };
};