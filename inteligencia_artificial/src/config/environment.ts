// -*- DECISIÓN DE DISEÑO: validamos manualmente las variables de entorno para evitar dependencias innecesarias en entornos restringidos.

import dotenv from "dotenv";

dotenv.config();

export interface Environment {
  readonly OPENROUTER_API_KEY: string;
  readonly OPENROUTER_MODEL: string;
  readonly OPENROUTER_BASE_URL: string;
}

const DEFAULT_MODEL = "mistralai/mistral-nemo";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

const ensureUrl = (value: string, field: string): string => {
  try {
    const parsed = new URL(value);
    return parsed.toString();
  } catch (error) {
    throw new Error(`URL inválida en ${field}`);
  }
};

export const loadEnvironment = (): Environment => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY es obligatorio");
  }

  const model = process.env.OPENROUTER_MODEL && process.env.OPENROUTER_MODEL.trim().length > 0
    ? process.env.OPENROUTER_MODEL
    : DEFAULT_MODEL;

  const baseUrlCandidate = process.env.OPENROUTER_BASE_URL && process.env.OPENROUTER_BASE_URL.trim().length > 0
    ? process.env.OPENROUTER_BASE_URL
    : DEFAULT_BASE_URL;

  const baseUrl = ensureUrl(baseUrlCandidate, "OPENROUTER_BASE_URL");

  return {
    OPENROUTER_API_KEY: apiKey,
    OPENROUTER_MODEL: model,
    OPENROUTER_BASE_URL: baseUrl,
  };
};
