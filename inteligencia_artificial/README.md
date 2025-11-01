# Inteligencia Artificial

Esta carpeta contiene pruebas de la integración con la IA (OpenRouter) mediante un CLI autónomo y componentes reutilizables. Es exclusivamente para pruebas.

# Ejecución desde consola
1. Instalar dependencias: `npm install`.
2. Definir variables de entorno (`OPENROUTER_API_KEY`, opcional `OPENROUTER_MODEL` y `OPENROUTER_BASE_URL`).
3. Ejecutar `npm run prompt:luz` para obtener el reporte del proyecto Luz para Aprender. Se puede usar `ts-node --esm src/runPrompt.ts <slug>` con otros proyectos registrados en `knownProjects`.
4. Revisar el JSON devuelto en consola y persistirlo si se desea.

# ¿Qué es `reporte_proyecto`?
`reporte_proyecto` es el prompt para construir el reporte de cierre de proyectos. El archivo `src/prompts/reporte_proyecto.ts` define la plantilla del mensaje del sistema (rol, requisitos y formato obligatorio en JSON) y envía como mensaje del usuario el contexto completo del proyecto en formato JSON.

Cuando se ejecuta `npm run prompt:luz`, el script compone una llamada a OpenRouter que incluye estos mensajes. El modelo devuelve un objeto JSON con:

- `resumen_ejecutivo`: un párrafo extendido que resume logros, impacto y reseñas.
- `aprendizajes_clave`: arreglo de strings con recomendaciones concretas iniciadas por "Aspecto a mejorar:".

# ¿Para qué es la carpeta `pruebas`?
Es para incluir diferentes casos o inputs que serán enviados para probar la integración con la IA. "Luz para Aprender" es un ejemplo de un proyecto que se utilizó para la Puesta en Sociedad de Conectando Corazones.