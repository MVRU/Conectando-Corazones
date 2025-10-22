// -*- DECISIÓN DE DISEÑO: declaramos módulos externos con tipado laxo para mantener compilación sin dependencias adicionales.

declare module "dotenv" {
  export interface DotenvConfigOutput {
    readonly parsed?: Record<string, string>;
    readonly error?: Error;
  }

  export function config(): DotenvConfigOutput;
  const dotenv: { config: typeof config };
  export default dotenv;
}

declare module "axios" {
  export interface AxiosInstance {
    post<TResponse = unknown>(url: string, data?: unknown, config?: unknown): Promise<{ data: TResponse }>;
  }
  export function create(config?: unknown): AxiosInstance;
  const axios: { create: typeof create };
  export default axios;
}

declare module "express" {
  export interface Request {
    readonly body?: unknown;
  }

  export interface Response {
    json(body: unknown): Response;
    status(code: number): Response;
  }

  export type Handler = (req: Request, res: Response) => unknown;

  export interface ExpressApp {
    use(middleware: unknown): ExpressApp;
    get(path: string, handler: Handler): ExpressApp;
    post(path: string, handler: Handler): ExpressApp;
    listen(port: number, cb: () => void): void;
  }

  export interface ExpressStatic {
    (): ExpressApp;
    json(options?: { limit?: string }): unknown;
  }

  const express: ExpressStatic;
  export default express;
}

declare module "node:assert/strict" {
  const assert: { ok(condition: unknown, message?: string): void };
  export default assert;
}