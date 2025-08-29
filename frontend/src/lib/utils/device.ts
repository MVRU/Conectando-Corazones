/**
 * * DECISIÓN DE DISEÑO:
 *    -*- Se centraliza la detección de dispositivos poco potentes para reutilizar la lógica y facilitar las pruebas unitarias.
 */

interface NetworkInformation {
	effectiveType?: string;
	downlink?: number;
	saveData?: boolean;
}

type NavigatorLike = Partial<Navigator> & {
	connection?: NetworkInformation;
	hardwareConcurrency?: number;
	deviceMemory?: number;
};

export function hasSlowConnection(navigatorObject: NavigatorLike = navigator): boolean {
	const conn = navigatorObject.connection;
	if (!conn) return false;
	const { effectiveType, downlink = 10, saveData = false } = conn;
	return saveData || /(2g|slow-2g)/i.test(effectiveType ?? '') || downlink < 1;
}

export function isLowEndDevice(navigatorObject: NavigatorLike = navigator): boolean {
	const cores = navigatorObject.hardwareConcurrency ?? 8;
	const memory = navigatorObject.deviceMemory ?? 8;
	const ua = navigatorObject.userAgent ?? '';
	const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

	// ! Condiciones que determinan si es low-end
	const lowCpuOrMem = cores <= 4 || memory <= 4;
	const slowNet = hasSlowConnection(navigatorObject);

	// ! Dispositivo de gama baja si:
	// -!- Tiene bajo rendimiento (independientemente del tipo de dispositivo)
	// -!- O es un móvil y además tiene mala conexión o recursos bajos
	return lowCpuOrMem || slowNet || (isMobile && (lowCpuOrMem || slowNet));
}
