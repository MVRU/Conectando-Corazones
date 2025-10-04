// ! DECISIÓN DE DISEÑO: Stub mínimo de Firestore para permitir pruebas unitarias sin dependencia remota.

export function initializeFirestore(app: unknown, _options: Record<string, unknown>) {
	return { app } as const;
}

export function getFirestore(app: unknown) {
	return { app } as const;
}

export function doc(_firestore: unknown, collection: string, id: string) {
	return { path: `${collection}/${id}` } as const;
}

export async function setDoc(): Promise<void> {}

export function serverTimestamp() {
	return { seconds: Date.now() };
}
