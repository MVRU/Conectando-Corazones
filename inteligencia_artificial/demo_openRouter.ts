const payload = {
  project: {
    id: "p-2025-012",
    titulo: "Campaña de Biblioteca Comunitaria",
    descripcion: "Renovación de biblioteca y donación de 500 libros a escuelas locales, con talleres educativos y participación de voluntarios.",
    personas_alcanzadas: 350
  },
  categoria: {
    descripcion: "Educación y cultura"
  },
  tipoParticipacion: [
    { descripcion: "Voluntariado" },
    { descripcion: "Especie"},
    { descripcion: "Monetaria"}
  ],
  participacionPermitida: [
    { actual: 500, unidad_medida: "unidades", objetivo: 500, especie: "Libros" },
    { actual: 60, unidad_medida: "horas", objetivo: 60, especie: "Voluntariado" },
    { actual: 7000, unidad_medida: "ARS", objetivo: 10000, especie: "Monetaria" }
  ],
  resenas: [
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "La coordinación del equipo fue excelente y todos los voluntarios se mostraron muy motivados. Se logró que los estudiantes tuvieran acceso a libros y espacios de lectura adecuados, lo cual generó un gran entusiasmo. Además, durante el taller de cuentacuentos improvisamos una pequeña representación que encantó a los niños.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Tuve algunos inconvenientes con la entrega de materiales, que llegaron más tarde de lo esperado, pero la creatividad del equipo permitió que los talleres continuaran sin problemas. Destaco la dedicación de los voluntarios y la energía positiva que contagió a todos los estudiantes.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "✨ Aspectos positivos: La participación de los voluntarios fue destacable y muy organizada.\n⚡ Desafíos: Algunos talleres quedaron cortos de tiempo.\n🌍 Impacto: Los niños aprendieron nuevas habilidades de lectura y se mostraron muy entusiasmados.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Me encantó cómo los estudiantes participaron activamente en todas las actividades. La logística fue un poco complicada en el transporte de libros, pero al final todo llegó bien. Una anécdota divertida: un grupo de niños ayudó a ordenar los libros y se sintió parte del proyecto.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "El taller de lectura tuvo gran éxito, con mucha interacción de los estudiantes. Hubo desafíos en la difusión del proyecto entre los padres, lo que limitó la asistencia en algunos momentos. Aun así, el impacto fue notable y la comunidad quedó muy contenta.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "La coordinación con las escuelas fue muy buena. Se cumplieron los objetivos educativos y los niños disfrutaron de los talleres. Como anécdota, uno de los voluntarios improvisó un juego de preguntas sobre los libros donados, que fue muy divertido.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "✨ Aspectos positivos: Excelente motivación de los voluntarios.\n🌍 Impacto: Los estudiantes adquirieron hábitos de lectura más constantes.\n⚡ Desafíos: Algunos materiales se agotaron antes de tiempo, pero se improvisaron alternativas.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Durante la entrega final hubo lluvia y complicó un poco la logística, pero todos los libros llegaron a las escuelas. Destaco la disposición de los voluntarios y la colaboración con la ONG local para resolver los problemas rápidamente.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Una experiencia muy enriquecedora. Se alcanzó a 350 personas y los talleres educativos funcionaron muy bien. Los desafíos principales fueron coordinar horarios y materiales, pero el equipo supo resolverlos con creatividad.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Los voluntarios estuvieron muy atentos a los niños y apoyaron en todo momento. Algunas actividades fueron demasiado rápidas, pero los estudiantes igualmente aprendieron y se divirtieron.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "🌍 Impacto: La comunidad recibió los libros con entusiasmo.\n✨ Aspectos positivos: Los talleres fueron interactivos y bien planificados.\n⚡ Desafíos: Falta de difusión en redes sociales, pero se pudo compensar con anuncios locales y boca a boca.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Me gustó que los estudiantes pudieran crear su propio rincón de lectura en la biblioteca. Hubo algunas dificultades logísticas, pero el resultado final fue muy positivo y todos colaboraron.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Los talleres educativos fueron muy atractivos y se cumplieron los objetivos principales. Una anécdota: algunos estudiantes organizaron mini presentaciones para mostrar lo aprendido.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "✨ Aspectos positivos: La participación de los voluntarios fue ejemplar.\n⚡ Desafíos: Coordinación con transporte complicada por el clima.\n🌍 Impacto: Todos los libros y materiales llegaron y se utilizaron correctamente.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "La entrega de libros fue un éxito y los estudiantes participaron con entusiasmo. Hubo momentos de improvisación necesarios para resolver pequeños problemas logísticos, pero todo salió bien.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Los talleres fueron muy enriquecedores, y la interacción con los voluntarios permitió que los estudiantes aprendieran y disfrutaran. Algunos materiales faltaron, pero se solucionó con creatividad.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "✨ Aspectos positivos: Coordinación con ONG locales muy buena.\n⚡ Desafíos: Tiempo limitado para ciertas actividades.\n🌍 Impacto: La comunidad pudo aprovechar los recursos donados de manera efectiva.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Los voluntarios mostraron gran compromiso y motivación. Algunas actividades no tuvieron todo el material previsto, pero se improvisaron alternativas muy efectivas.", puntaje: 5 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "Durante los talleres, los niños participaron activamente y se sintieron incluidos. Hubo dificultades menores de comunicación, pero el impacto final fue muy positivo.", puntaje: 4 },
  
  { tipo_objeto: "proyecto", id_objeto: "p-2025-012", contenido: "La experiencia fue muy enriquecedora para todos los involucrados. Una anécdota divertida: algunos estudiantes organizaron un pequeño mural de lectura, mostrando entusiasmo y creatividad.", puntaje: 5 }
]
};



import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const systemPrompt = `
Rol: Eres un experto con muchos años liderando proyectos de servicio y voluntariado. Participaste activamente en este proyecto y has leído todas las reseñas de participantes involucrados. Tu tarea es generar un resumen completo y aprendizajes accionables.

1. resumen_ejecutivo: redacta un párrafo extenso (8–15 líneas) en español claro. Debe:
   - Destacar los logros y aspectos positivos del proyecto.
   - Indicar el alcance real, impacto en beneficiarios y participación de voluntarios.
   - Indicar los logros alcanzados y aspectos positivos.
   - Indicar el promedio de puntaje de las resenas para el proyecto y una justificacion breve.

2. aprendizajes_clave: lista de bullets en el siguiente formato:
   - Cada bullet empieza indicando un aspecto a mejorar (problema detectado) basado en observaciones y reseñas.
   - Luego indica posibles soluciones específicas y concretas, ofreciendo **opciones prácticas** si hay más de una manera de abordar el problema.

Formato esperado de salida estricta:

{
  "resumen_ejecutivo": "...",
  "aprendizajes_clave": [
    "Aspecto a mejorar: ... | Posible solución: [Opción 1, Opción 2, Opción 3]"
    ]
    }
    Requisitos adicionales:
- Mantener la salida **JSON válido** que pueda ser parseado directamente.
- No agregar texto fuera del objeto JSON.
- Usar lenguaje claro, concreto y profesional.
- Para las soluciones, dar ejemplos o alternativas concretas, no genéricas.
`;

async function main() {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-nemo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(payload) }
        ],
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("=== OpenRouter Response ===");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Error llamando a OpenRouter:", err);
  }
}

main();

