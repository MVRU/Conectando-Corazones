const payload = {
  project: {
    id: "p-2025",
    titulo: "Luz para Aprender",
    descripcion: ".",
    personas_alcanzadas: 200,
  },
  categoria: {
    descripcion: "",
  },
  tipoParticipacion: [
    { id_tipo_participacion: 1, descripcion: "Voluntariado" },
    { id_tipo_participacion: 2, descripcion: "Donación en especie" },
    { id_tipo_participacion: 3, descripcion: "Donación monetaria" },
  ],
  participacionPermitida: [
    {
      id_tipo_participacion: 2,
      actual: 3,
      unidad_medida: "unidades",
      objetivo: 3,
      especie: "tableros de conexión instalados",
    },
    {
      id_tipo_participacion: 2,
      actual: 6,
      unidad_medida: "unidades",
      objetivo: 6,
      especie: "interruptores de seguridad certificados",
    },
    {
      id_tipo_participacion: 2,
      actual: 50,
      unidad_medida: "metros",
      objetivo: 50,
      especie: "cableado ignífugo",
    },

    {
      id_tipo_participacion: 3,
      actual: 180000,
      unidad_medida: "ARS",
      objetivo: 180000,
      especie: "",
    },

    {
      id_tipo_participacion: 1,
      actual: 2,
      unidad_medida: "personas",
      objetivo: 2,
      especie: "",
    },
  ],
  resenas: [
    {
      tipo_objeto: "proyecto",
      id_objeto: "p-2025",
      contenido:
        "Ver las aulas encenderse fue increíble. Desde Lumina hicimos la entrega de materiales y la conexión final, pero lo más lindo fue sentir que esa luz también llega a los chicos.",
      puntaje: 5,
      username: "lumina_cooperativa",
      aprobado: true,
      rol: "Empresa eléctrica",
    },
    {
      tipo_objeto: "proyecto",
      id_objeto: "p-2025",
      contenido:
        "Cuando Patricia nos mandó la foto del aula iluminada, se nos llenó el corazón. Saber que nuestras lámparas ahora alumbran un lugar donde se aprende es lo que nos mueve a seguir.",
      puntaje: 5,
      username: "sembrar_futuro",
      aprobado: true,
      rol: "ONG",
    },
    {
      tipo_objeto: "proyecto",
      id_objeto: "p-2025",
      contenido:
        "Instalar esas luces con Sofía fue una experiencia que no se olvida. Llegamos con herramientas y nos fuimos con una sonrisa enorme. Los chicos nos agradecían desde la puerta.",
      puntaje: 5,
      username: "lucas_ferreyra",
      aprobado: true,
      rol: "Colaborador individual",
    },

    {
      tipo_objeto: "proyecto",
      id_objeto: "p-2025",
      contenido:
        "Esa noche, cuando terminamos y encendimos la última lámpara, todos aplaudieron. Fue emocionante ver la escuela llena de luz y saber que pusimos un granito de arena.",
      puntaje: 5,
      username: "sofia_mansilla",
      aprobado: true,
      rol: "Colaboradora individual",
    },
  ],
};

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const systemPrompt = `
Rol: sos un experto con muchos años liderando proyectos de servicio y voluntariado. Participaste activamente en este proyecto y has leído todas las reseñas de participantes involucrados. Tu tarea es generar un resumen completo y aprendizajes accionables.

1. resumen_ejecutivo: redacta un párrafo extenso (8–15 líneas) en español argentino claro. Debe:
   - Destacar los logros y aspectos positivos del proyecto.
   - Indicar el alcance real, impacto en beneficiarios y participación de voluntarios.
   - Indicar los logros alcanzados y aspectos positivos.
   - Indicar el promedio de puntaje de las reseñas para el proyecto y una justificación breve.

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
          { role: "user", content: JSON.stringify(payload) },
        ],
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("=== OpenRouter Response ===");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Error llamando a OpenRouter:", err);
  }
}

main();
