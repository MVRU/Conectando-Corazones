/// <reference types="svelte" />
/// <reference types="vite/client" />
import '$lib/types/svelte-jsx';

import type { FirebaseApp } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import type { Usuario } from '$lib/types/Usuario';

// ! DECISIÓN DE DISEÑO: Se documentan las ayudas relacionadas con Firebase para que las capas server/client conozcan la forma de acceder a la sesión y a los servicios inicializados.

declare global {
	namespace App {
		interface Locals {
			usuario?: Usuario;
			firebase?: {
				app: FirebaseApp;
				firestore: Firestore;
				user?: FirebaseUser | null;
			};
		}
		interface PageData {
			firebaseUser?: FirebaseUser | null;
		}
	}
}

export {};
