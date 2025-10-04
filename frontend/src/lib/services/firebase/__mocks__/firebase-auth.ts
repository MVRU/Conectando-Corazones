// ! DECISIÓN DE DISEÑO: Stub de Firebase Auth para entornos de prueba. En ejecución real se debe instalar el SDK oficial.

export class GoogleAuthProvider {
	// eslint-disable-next-line class-methods-use-this
	setCustomParameters(_: Record<string, unknown>): void {}
}

export const browserLocalPersistence = { name: 'local' } as const;

export function getAuth(app: unknown) {
	return { app } as const;
}

export async function setPersistence(): Promise<void> {}

export async function createUserWithEmailAndPassword() {
	throw new Error('createUserWithEmailAndPassword no está disponible en el stub.');
}

export async function signInWithPopup() {
	throw new Error('signInWithPopup no está disponible en el stub.');
}

export async function signOut(): Promise<void> {}

export async function updateProfile(): Promise<void> {}

export function onAuthStateChanged() {
	return () => {};
}
