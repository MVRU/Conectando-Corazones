// -*- DECISIÓN DE DISEÑO: declaramos tipados mínimos de Node para compilar en entornos sin @types/node disponible.

declare const process: {
  readonly env: Record<string, string | undefined>;
  argv: string[];
  pid: number;
  exitCode?: number;
  uptime(): number;
};

declare const require: NodeRequire;

declare interface NodeRequire {
  (id: string): unknown;
}