declare module "$env/static/public" {
	export const PUBLIC_FIREBASE_API_KEY: string;
	export const PUBLIC_FIREBASE_APP_ID: string;
	export const PUBLIC_FIREBASE_AUTH_DOMAIN: string;
	export const PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
	export const PUBLIC_FIREBASE_PROJECT_ID: string;
	export const PUBLIC_FIREBASE_STORAGE_BUCKET: string;
}

declare module "$env/static/private" {
	export const FIREBASE_API_KEY: string;
	export const FIREBASE_APP_ID: string;
	export const FIREBASE_AUTH_DOMAIN: string;
	export const FIREBASE_MESSAGING_SENDER_ID: string;
	export const FIREBASE_PROJECT_ID: string;
	export const FIREBASE_STORAGE_BUCKET: string;
}
