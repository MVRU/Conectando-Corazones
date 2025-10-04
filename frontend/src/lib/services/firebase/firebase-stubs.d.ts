// ! DECISIÓN DE DISEÑO: Declaraciones mínimas para permitir el tipado mientras se integra el SDK oficial de Firebase.

declare module 'firebase/app' {
        export interface FirebaseOptions {
                apiKey?: string;
                appId?: string;
                authDomain?: string;
                messagingSenderId?: string;
                projectId?: string;
                storageBucket?: string;
        }
        export interface FirebaseApp {
                options: FirebaseOptions;
        }
        export function initializeApp(options: FirebaseOptions): FirebaseApp;
        export function getApps(): FirebaseApp[];
}

declare module 'firebase/auth' {
        export interface Auth {
                app?: unknown;
                currentUser?: User | null;
        }
        export interface AuthProvider {}
        export interface User {
                uid: string;
                email?: string | null;
                displayName?: string | null;
                photoURL?: string | null;
        }
        export interface UserCredential {
                user: User;
        }
        export type NextOrObserver<T> = (value: T) => void;
        export class GoogleAuthProvider {
                setCustomParameters(params: Record<string, unknown>): void;
        }
        export const browserLocalPersistence: unknown;
        export function getAuth(app?: unknown): Auth;
        export function setPersistence(auth: Auth, persistence: unknown): Promise<void>;
        export function createUserWithEmailAndPassword(
                auth: Auth,
                email: string,
                password: string
        ): Promise<UserCredential>;
        export function signInWithEmailAndPassword(
                auth: Auth,
                email: string,
                password: string
        ): Promise<UserCredential>;
        export function signInWithPopup(auth: Auth, provider: AuthProvider): Promise<UserCredential>;
        export function signOut(auth: Auth): Promise<void>;
        export function updateProfile(user: User, profile: Record<string, unknown>): Promise<void>;
        export function onAuthStateChanged(auth: Auth, observer: NextOrObserver<User | null>): () => void;
}

declare module 'firebase/firestore' {
        export interface DocumentData {
                [key: string]: unknown;
        }
        export interface DocumentSnapshot<T = DocumentData> {
                data(): T | undefined;
                exists(): boolean;
                id: string;
        }
        export interface QueryDocumentSnapshot<T = DocumentData> extends DocumentSnapshot<T> {}
        export interface QuerySnapshot<T = DocumentData> {
                empty: boolean;
                docs: QueryDocumentSnapshot<T>[];
        }
        export interface Timestamp {
                toDate(): Date;
        }
        export interface Firestore {}
        export interface SetOptions {
                merge?: boolean;
        }
        export interface CollectionReference<T = DocumentData> {}
        export interface Query<T = DocumentData> {}
        export function initializeFirestore(app: unknown, options: Record<string, unknown>): Firestore;
        export function getFirestore(app: unknown): Firestore;
        export function doc(firestore: Firestore, collection: string, id: string): unknown;
        export function getDoc<T = DocumentData>(documentRef: unknown): Promise<DocumentSnapshot<T>>;
        export function setDoc(documentRef: unknown, data: unknown, options?: SetOptions): Promise<void>;
        export function serverTimestamp(): Timestamp;
        export function collection<T = DocumentData>(
                firestore: Firestore,
                path: string
        ): CollectionReference<T>;
        export function query<T = DocumentData>(
                reference: CollectionReference<T>,
                ...constraints: unknown[]
        ): Query<T>;
        export function where(fieldPath: string, opStr: string, value: unknown): unknown;
        export function limit(count: number): unknown;
        export function getDocs<T = DocumentData>(reference: Query<T>): Promise<QuerySnapshot<T>>;
}
