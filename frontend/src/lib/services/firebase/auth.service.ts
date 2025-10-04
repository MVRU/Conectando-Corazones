import { browser } from '$app/environment';
import type { Auth, AuthProvider, NextOrObserver, User, UserCredential } from 'firebase/auth';
import type { DocumentData, DocumentSnapshot, Firestore, SetOptions } from 'firebase/firestore';
import {
        GoogleAuthProvider,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        onAuthStateChanged,
        signInWithPopup,
        signOut,
        updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseFirestore } from './firebase.client';

// ! DECISIÓN DE DISEÑO: Este servicio abstrae Firebase Auth/Firestore para mantener el resto de la app desacoplado de SDKs externos y facilitar el testeo mediante mocks.

const USERS_COLLECTION = 'users';

export const googleProvider = (() => {
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({ prompt: 'select_account' });
	return provider;
})();

export interface RegisterWithEmailInput {
        email: string;
        password: string;
        displayName?: string;
}

export interface CompleteProfileInput<TProfile extends DocumentData = DocumentData> {
        uid: string;
        data: TProfile;
        merge?: SetOptions['merge'];
        collection?: string;
}

export interface SignInWithEmailInput {
        email: string;
        password: string;
}

function sanitizeEmail(email: string): string {
        return email.trim().toLowerCase();
}

function sanitizeDisplayName(value?: string): string | undefined {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeProfileData<T extends DocumentData>(data: T): T {
	const entries = Object.entries(data ?? {}).filter(([, value]) => value !== undefined);
	return Object.fromEntries(entries) as T;
}

async function resolveAuth(): Promise<Auth> {
	return getFirebaseAuth();
}

async function resolveFirestore(): Promise<Firestore> {
	return getFirebaseFirestore();
}

export async function registerWithEmail(input: RegisterWithEmailInput): Promise<User> {
        const auth = await resolveAuth();
        const credential: UserCredential = await createUserWithEmailAndPassword(
                auth,
                sanitizeEmail(input.email),
                input.password
        );
        const displayName = sanitizeDisplayName(input.displayName);
        if (displayName) {
                await updateProfile(credential.user, { displayName });
        }
        return credential.user;
}

export async function signInWithEmail(input: SignInWithEmailInput): Promise<User> {
        const auth = await resolveAuth();
        const credential = await signInWithEmailAndPassword(
                auth,
                sanitizeEmail(input.email),
                input.password
        );
        if (!credential.user) {
                throw new Error('No fue posible obtener el usuario autenticado.');
        }
        return credential.user;
}

export async function signInWithProvider(provider: AuthProvider): Promise<User> {
        if (!browser) {
                throw new Error('Los proveedores externos solo están disponibles en el navegador.');
        }
        const auth = await resolveAuth();
	const credential = await signInWithPopup(auth, provider);
	if (!credential.user) {
		throw new Error('No fue posible obtener el usuario autenticado.');
	}
	return credential.user;
}

export async function completeProfile<TProfile extends DocumentData>(
        input: CompleteProfileInput<TProfile>
): Promise<void> {
        const firestore = await resolveFirestore();
	const timestamps = {
		updatedAt: serverTimestamp(),
		...(input.merge === false ? { createdAt: serverTimestamp() } : {})
	};
	const payload = sanitizeProfileData({
		...input.data,
		uid: input.uid,
		...timestamps
	});
	const targetCollection = input.collection ?? USERS_COLLECTION;
	const documentRef = doc(firestore, targetCollection, input.uid);
	await setDoc(documentRef, payload, { merge: input.merge ?? true });
}

export async function logout(): Promise<void> {
        const auth = await resolveAuth();
        await signOut(auth);
}

export async function onAuthStateChangedSafe(
        nextOrObserver: NextOrObserver<User | null>
): Promise<() => void> {
        const auth = await resolveAuth();
        return onAuthStateChanged(auth, nextOrObserver);
}

export async function getUserDocument(
        uid: string,
        collection = USERS_COLLECTION
): Promise<DocumentSnapshot<DocumentData>> {
        const firestore = await resolveFirestore();
        const reference = doc(firestore, collection, uid);
        return getDoc(reference);
}
