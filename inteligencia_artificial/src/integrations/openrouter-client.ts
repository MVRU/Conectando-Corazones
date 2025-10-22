// -*- DECISIÓN DE DISEÑO: encapsulamos la configuración de Axios para OpenRouter a fin de reutilizar lógica y aislar dependencias externas.

import axios from "axios";
import type { AxiosInstance } from "axios";
import type { Environment } from "../config/environment.js";

export const createOpenRouterClient = (environment: Environment): AxiosInstance => {
  return axios.create({
    baseURL: `${environment.OPENROUTER_BASE_URL}/chat/completions`,
    headers: {
      Authorization: `Bearer ${environment.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    timeout: 25000,
  });
};