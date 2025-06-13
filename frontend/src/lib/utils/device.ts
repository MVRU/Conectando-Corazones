/**
 * * DECISIÓN DE DISEÑO:
 * -*- Se centraliza la detección de dispositivos poco potentes para reutilizar la lógica y facilitar las pruebas unitarias.
 */

export function hasSlowConnection(
  navigatorObject: Navigator = navigator,
): boolean {
  const conn = (navigatorObject as any).connection;
  if (!conn) return false;
  const { effectiveType, downlink = 10, saveData = false } = conn as any;
  return saveData || /(2g|slow-2g)/i.test(effectiveType ?? "") || downlink < 1;
}

export function isLowEndDevice(
  navigatorObject: Navigator = navigator,
): boolean {
  // ! Heurísticas simples: núcleos, memoria, conexión o dispositivo móvil
  const nav = navigatorObject as any;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const ua = navigatorObject.userAgent ?? "";
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  return (
    cores <= 4 || memory <= 4 || hasSlowConnection(navigatorObject) || isMobile
  );
}
