/**
 * * DECISIÓN DE DISEÑO:
 * -*- Se centraliza la detección de dispositivos poco potentes para reutilizar la lógica y facilitar las pruebas unitarias.
 */

export function isLowEndDevice(navigatorObject: Navigator = navigator): boolean {
    // ! Heurísticas simples: núcleos, memoria, conexión lenta o móvil
    const nav = navigatorObject as any;
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const conn = nav.connection as any;
    const slowConn = /2g/.test(conn?.effectiveType ?? '');
    const saveData = conn?.saveData ?? false;
    const ua = navigatorObject.userAgent ?? '';
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    return cores <= 4 || memory <= 4 || slowConn || saveData || isMobile;
}