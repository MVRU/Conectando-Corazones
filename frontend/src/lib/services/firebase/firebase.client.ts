import { browser } from '$app/environment';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET
} from '$env/static/public';

// ! DECISIÓN DE DISEÑO: Centralizar la inicialización de Firebase evita duplicar configuración, reduce el riesgo de múltiples apps y habilita controles diferenciados por entorno (browser vs server).

interface FirebaseConfigInput {
	apiKey?: string;
	appId?: string;
	authDomain?: string;
	messagingSenderId?: string;
	projectId?: string;
	storageBucket?: string;
}

type PrivateEnvModule = typeof import('$env/static/private');

let privateEnvPromise: Promise<PrivateEnvModule> | null = null;
let appPromise: Promise<FirebaseApp> | null = null;
let authPromise: Promise<Auth> | null = null;
let firestorePromise: Promise<Firestore> | null = null;

function sanitizeConfigValue(value?: string, fallback = ''): string {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function buildPublicConfig(): FirebaseOptions {
	return {
		apiKey: sanitizeConfigValue(PUBLIC_FIREBASE_API_KEY),
		appId: sanitizeConfigValue(PUBLIC_FIREBASE_APP_ID),
		authDomain: sanitizeConfigValue(PUBLIC_FIREBASE_AUTH_DOMAIN),
		messagingSenderId: sanitizeConfigValue(PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
		projectId: sanitizeConfigValue(PUBLIC_FIREBASE_PROJECT_ID),
		storageBucket: sanitizeConfigValue(PUBLIC_FIREBASE_STORAGE_BUCKET)
	} satisfies FirebaseOptions;
}

async function loadPrivateEnv(): Promise<PrivateEnvModule> {
	if (browser) {
		throw new Error('Las variables privadas no están disponibles en el navegador.');
	}
	privateEnvPromise ??= import('$env/static/private');
	return privateEnvPromise;
}

async function buildServerConfig(): Promise<FirebaseOptions> {
	const privateEnv = await loadPrivateEnv();
	const base = buildPublicConfig();
	const overrides: FirebaseConfigInput = {
		apiKey: privateEnv.FIREBASE_API_KEY,
		appId: privateEnv.FIREBASE_APP_ID,
		authDomain: privateEnv.FIREBASE_AUTH_DOMAIN,
		messagingSenderId: privateEnv.FIREBASE_MESSAGING_SENDER_ID,
		projectId: privateEnv.FIREBASE_PROJECT_ID,
		storageBucket: privateEnv.FIREBASE_STORAGE_BUCKET
	};

	return {
		...base,
		...Object.fromEntries(
			Object.entries(overrides).map(([key, value]) => [
				key,
				sanitizeConfigValue(value, base[key as keyof FirebaseOptions] as string | undefined)
			])
		)
	} satisfies FirebaseOptions;
}

async function resolveFirebaseConfig(): Promise<FirebaseOptions> {
	if (browser) {
		return buildPublicConfig();
	}
	return buildServerConfig();
}

async function ensureApp(): Promise<FirebaseApp> {
	if (!appPromise) {
		appPromise = (async () => {
			const config = await resolveFirebaseConfig();
			const existing = getApps();
			return existing.length ? existing[0] : initializeApp(config);
		})();
	}
	return appPromise;
}

async function ensureAuth(): Promise<Auth> {
	if (!authPromise) {
		authPromise = (async () => {
			const app = await ensureApp();
			const authInstance = getAuth(app);
			if (browser) {
				await setPersistence(authInstance, browserLocalPersistence);
			}
			return authInstance;
		})();
	}
	return authPromise;
}

async function ensureFirestore(): Promise<Firestore> {
	if (!firestorePromise) {
		firestorePromise = (async () => {
			const app = await ensureApp();
			try {
				return initializeFirestore(app, { ignoreUndefinedProperties: true });
			} catch (error) {
				if (error instanceof Error && /already exists/i.test(error.message)) {
					return getFirestore(app);
				}
				throw error;
			}
		})();
	}
	return firestorePromise;
}

export async function getFirebaseApp(): Promise<FirebaseApp> {
	return ensureApp();
}

export async function getFirebaseAuth(): Promise<Auth> {
	return ensureAuth();
}

export async function getFirebaseFirestore(): Promise<Firestore> {
	return ensureFirestore();
}

export async function resetFirebaseInstances(): Promise<void> {
	privateEnvPromise = null;
	appPromise = null;
	authPromise = null;
	firestorePromise = null;
}
