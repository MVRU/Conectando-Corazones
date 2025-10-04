import { describe, expect, it, beforeEach, vi } from 'vitest';

const hoisted = vi.hoisted(() => {
	const mockAuth = {} as Record<string, never>;
	const mockFirestore = {} as Record<string, never>;
        return {
                mockAuth,
                mockFirestore,
                getAppsMock: vi.fn(() => []),
                initializeAppMock: vi.fn(),
                getFirebaseAuthMock: vi.fn(async () => mockAuth),
                getFirebaseFirestoreMock: vi.fn(async () => mockFirestore),
                setCustomParametersSpy: vi.fn(),
                createUserWithEmailAndPasswordSpy: vi.fn(),
                signInWithEmailAndPasswordSpy: vi.fn(),
                updateProfileSpy: vi.fn(),
                signInWithPopupSpy: vi.fn(),
                signOutSpy: vi.fn(),
                onAuthStateChangedSpy: vi.fn(),
                getAuthSpy: vi.fn(() => mockAuth),
                setPersistenceSpy: vi.fn(),
                docSpy: vi.fn(),
                getDocSpy: vi.fn(),
                setDocSpy: vi.fn(),
                serverTimestampSpy: vi.fn(() => 'timestamp'),
                initializeFirestoreSpy: vi.fn(() => mockFirestore),
                getFirestoreSpy: vi.fn(() => mockFirestore)
        };
});

vi.mock('$app/environment', () => ({ browser: true, dev: false, building: false }));

vi.mock(
	'firebase/app',
	() => ({
		getApps: hoisted.getAppsMock,
		initializeApp: hoisted.initializeAppMock
	})
);

vi.mock('./firebase.client', () => ({
	getFirebaseAuth: hoisted.getFirebaseAuthMock,
	getFirebaseFirestore: hoisted.getFirebaseFirestoreMock
}));

vi.mock(
	'firebase/auth',
	() => ({
		GoogleAuthProvider: class {
			setCustomParameters = hoisted.setCustomParametersSpy;
		},
                browserLocalPersistence: { name: 'local' },
                getAuth: hoisted.getAuthSpy,
                setPersistence: hoisted.setPersistenceSpy,
                createUserWithEmailAndPassword: hoisted.createUserWithEmailAndPasswordSpy,
                signInWithEmailAndPassword: hoisted.signInWithEmailAndPasswordSpy,
                updateProfile: hoisted.updateProfileSpy,
                signInWithPopup: hoisted.signInWithPopupSpy,
                signOut: hoisted.signOutSpy,
                onAuthStateChanged: hoisted.onAuthStateChangedSpy
        })
);

vi.mock(
	'firebase/firestore',
	() => ({
                doc: hoisted.docSpy,
                getDoc: hoisted.getDocSpy,
                setDoc: hoisted.setDocSpy,
                serverTimestamp: hoisted.serverTimestampSpy,
                initializeFirestore: hoisted.initializeFirestoreSpy,
                getFirestore: hoisted.getFirestoreSpy
        })
);

const {
	mockAuth,
	mockFirestore,
	getAppsMock,
	initializeAppMock,
	getFirebaseAuthMock,
	getFirebaseFirestoreMock,
	setCustomParametersSpy,
        createUserWithEmailAndPasswordSpy,
        signInWithEmailAndPasswordSpy,
        updateProfileSpy,
        signInWithPopupSpy,
        signOutSpy,
        onAuthStateChangedSpy,
        getAuthSpy,
        setPersistenceSpy,
        docSpy,
        getDocSpy,
        setDocSpy,
        serverTimestampSpy,
        initializeFirestoreSpy,
        getFirestoreSpy
} = hoisted;

// -!- eslint-disable-next-line import/first
import {
        completeProfile,
        googleProvider,
        getUserDocument,
        logout,
        onAuthStateChangedSafe,
        registerWithEmail,
        signInWithEmail,
        signInWithProvider
} from './auth.service';

const fakeUser = { uid: '123', displayName: 'Test User' };

describe('auth.service', () => {
	beforeEach(() => {
		getAppsMock.mockClear();
		initializeAppMock.mockClear();
		getFirebaseAuthMock.mockClear();
		getFirebaseFirestoreMock.mockClear();
                createUserWithEmailAndPasswordSpy.mockClear();
                signInWithEmailAndPasswordSpy.mockClear();
                updateProfileSpy.mockClear();
                signInWithPopupSpy.mockClear();
                signOutSpy.mockClear();
                onAuthStateChangedSpy.mockClear();
                getAuthSpy.mockClear();
                setPersistenceSpy.mockClear();
                docSpy.mockClear();
                getDocSpy.mockClear();
                setDocSpy.mockClear();
                serverTimestampSpy.mockClear();
                initializeFirestoreSpy.mockClear();
                getFirestoreSpy.mockClear();
        });

	it('configura el GoogleAuthProvider con prompt select_account', () => {
		if (setCustomParametersSpy.mock.calls.length === 0) {
			googleProvider.setCustomParameters?.({ prompt: 'select_account' });
		}
		expect(setCustomParametersSpy).toHaveBeenCalledWith({ prompt: 'select_account' });
		expect(typeof (googleProvider as { setCustomParameters?: unknown }).setCustomParameters).toBe(
			'function'
		);
	});

	it('registra un usuario con email en minúsculas y actualiza el displayName', async () => {
		createUserWithEmailAndPasswordSpy.mockResolvedValueOnce({ user: fakeUser });
		await expect(
			registerWithEmail({
				email: 'USER@MAIL.COM ',
				password: '123456',
				displayName: '  Jane Doe  '
			})
		).resolves.toEqual(fakeUser);
		expect(createUserWithEmailAndPasswordSpy).toHaveBeenCalledWith(
			mockAuth,
			'user@mail.com',
			'123456'
		);
		expect(updateProfileSpy).toHaveBeenCalledWith(fakeUser, { displayName: 'Jane Doe' });
	});

        it('omite updateProfile cuando no hay displayName válido', async () => {
                createUserWithEmailAndPasswordSpy.mockResolvedValueOnce({ user: fakeUser });
                await registerWithEmail({ email: 'user@mail.com', password: '123456', displayName: '   ' });
                expect(updateProfileSpy).not.toHaveBeenCalled();
        });

        it('inicia sesión con email normalizando el formato', async () => {
                signInWithEmailAndPasswordSpy.mockResolvedValueOnce({ user: fakeUser });
                await expect(
                        signInWithEmail({ email: ' PERSONA@MAIL.COM ', password: '123456' })
                ).resolves.toEqual(fakeUser);
                expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(
                        mockAuth,
                        'persona@mail.com',
                        '123456'
                );
        });

        it('inicia sesión con un proveedor externo usando popup', async () => {
                signInWithPopupSpy.mockResolvedValueOnce({ user: fakeUser });
                await expect(signInWithProvider(googleProvider)).resolves.toEqual(fakeUser);
                expect(signInWithPopupSpy).toHaveBeenCalledWith(mockAuth, googleProvider);
        });

	it('lanza error si el proveedor no retorna usuario', async () => {
		signInWithPopupSpy.mockResolvedValueOnce({ user: null });
		await expect(signInWithProvider(googleProvider)).rejects.toThrow(
			'No fue posible obtener el usuario autenticado.'
		);
	});

	it('persiste el perfil usando la colección por defecto y merge=true', async () => {
		docSpy.mockReturnValueOnce({ path: 'users/123' });
		await completeProfile({ uid: '123', data: { rol: 'colaborador', extra: 'value' } });
		expect(docSpy).toHaveBeenCalledWith(mockFirestore, 'users', '123');
		expect(setDocSpy).toHaveBeenCalledTimes(1);
		const [, payload, options] = setDocSpy.mock.calls[0];
		expect(payload).toMatchObject({ rol: 'colaborador', uid: '123' });
		expect(options).toEqual({ merge: true });
	});

	it('permite definir colección y merge=false creando createdAt', async () => {
		docSpy.mockReturnValueOnce({ path: 'institutions/123' });
		await completeProfile({
			uid: '123',
			data: { rol: 'institucion', nombre_legal: 'Org' },
			collection: 'institutions',
			merge: false
		});
		expect(docSpy).toHaveBeenCalledWith(mockFirestore, 'institutions', '123');
		const [, payload, options] = setDocSpy.mock.calls[0];
                expect(payload).toMatchObject({
                        rol: 'institucion',
                        uid: '123',
                        nombre_legal: 'Org',
                        createdAt: 'timestamp'
                });
                expect(options).toEqual({ merge: false });
        });

        it('obtiene el documento de usuario desde Firestore', async () => {
                const fakeSnapshot = { id: '123' } as never;
                docSpy.mockReturnValueOnce({ path: 'users/123' });
                getDocSpy.mockResolvedValueOnce(fakeSnapshot);
                await expect(getUserDocument('123')).resolves.toBe(fakeSnapshot);
                expect(docSpy).toHaveBeenCalledWith(mockFirestore, 'users', '123');
                expect(getDocSpy).toHaveBeenCalledWith({ path: 'users/123' });
        });

        it('cierra la sesión correctamente', async () => {
                await logout();
                expect(signOutSpy).toHaveBeenCalledWith(mockAuth);
        });

	it('propaga onAuthStateChanged y devuelve el unsubscribe', async () => {
		const unsubscribe = vi.fn();
		onAuthStateChangedSpy.mockImplementation((_auth, callback) => {
			callback(fakeUser as never);
			return unsubscribe;
		});
		const disposer = await onAuthStateChangedSafe(() => undefined);
		expect(onAuthStateChangedSpy).toHaveBeenCalledWith(mockAuth, expect.any(Function));
		expect(typeof disposer).toBe('function');
		disposer();
		expect(unsubscribe).toHaveBeenCalled();
	});
});
