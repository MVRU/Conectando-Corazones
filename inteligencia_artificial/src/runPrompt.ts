// -*- DECISIÓN DE DISEÑO: creamos un ejecutable mínimo para disparar prompts desde consola sin acoplar la lógica de negocio a Express

import { loadEnvironment } from "./config/environment.js";
import { createOpenRouterClient } from "./integrations/openrouter-client.js";
import { buildFinalReportMessages } from "./prompts/reporte-proyecto.js";
import { luzParaAprenderContext } from "./pruebas/luz_para_aprender.js";

const knownProjects = {
  "luz-para-aprender": luzParaAprenderContext,
};

type ProjectSlug = keyof typeof knownProjects;

const DEFAULT_PROJECT: ProjectSlug = "luz-para-aprender";

const normalizeProjectSlug = (slug: string): string => {
  return slug.trim().toLowerCase().replace(/[\s_]+/g, "-");
};

const selectProject = (rawSlug: string | undefined): ProjectSlug => {
  const slug = rawSlug ? normalizeProjectSlug(rawSlug) : DEFAULT_PROJECT;

  if (!(slug in knownProjects)) {
    const available = Object.keys(knownProjects).join(", ");
    throw new Error(`Proyecto desconocido: ${slug}. Disponibles: ${available}`);
  }

  return slug as ProjectSlug;
};

const run = async (): Promise<void> => {
  try {
    const projectSlug = selectProject(process.argv[2]);
    const context = knownProjects[projectSlug];

    const env = loadEnvironment();
    const client = createOpenRouterClient(env);
    const messages = buildFinalReportMessages(context);

    const response = await client.post("", {
      model: env.OPENROUTER_MODEL,
      messages: [
        { role: "system", content: messages.system },
        { role: "user", content: messages.user },
      ],
      temperature: 0.4,
    });

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`-!- Error al ejecutar el prompt: ${error.message}`);
    } else {
      console.error("-!- Error inesperado al ejecutar el prompt");
    }
    process.exitCode = 1;
  }
};

void run();
