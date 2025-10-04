// ! DECISIÓN DE DISEÑO: Stub local para que Vitest resuelva dependencias de Firebase sin requerir el paquete oficial durante las pruebas.

interface MockFirebaseApp {
	options: Record<string, unknown>;
}

const apps: MockFirebaseApp[] = [];

export function initializeApp(options: Record<string, unknown>): MockFirebaseApp {
	const app: MockFirebaseApp = { options };
	apps.push(app);
	return app;
}

export function getApps(): MockFirebaseApp[] {
	return apps;
}
