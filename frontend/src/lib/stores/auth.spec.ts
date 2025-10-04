import { get } from 'svelte/store';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
        signInWithEmail: vi.fn(),
        signInWithProvider: vi.fn(),
        registerWithEmail: vi.fn(),
        completeProfile: vi.fn(),
        getUserDocument: vi.fn(),
        logout: vi.fn(),
        onAuthStateChangedSafe: vi.fn(async () => () => undefined),
        googleProvider: {},
        currentUser: null as unknown
}));

vi.mock('$lib/services/firebase/auth.service', () => ({
        completeProfile: mocks.completeProfile,
        getUserDocument: mocks.getUserDocument,
        googleProvider: mocks.googleProvider,
        logout: mocks.logout,
        onAuthStateChangedSafe: mocks.onAuthStateChangedSafe,
        registerWithEmail: mocks.registerWithEmail,
        signInWithEmail: mocks.signInWithEmail,
        signInWithProvider: mocks.signInWithProvider
}));

vi.mock('$lib/services/firebase/firebase.client', () => ({
        getFirebaseAuth: vi.fn(async () => ({ currentUser: mocks.currentUser })),
        getFirebaseFirestore: vi.fn(async () => ({}))
}));

vi.mock('$lib/services/firebase/mappers', () => ({
        mapColaborador: vi.fn((snapshot) => snapshot.data() as never),
        mapInstitucion: vi.fn((snapshot) => snapshot.data() as never),
        mapUsuario: vi.fn((snapshot) => snapshot.data() as never)
}));

vi.mock('firebase/firestore', () => ({
        collection: vi.fn(() => ({})),
        getDocs: vi.fn(async () => ({ empty: true })),
        limit: vi.fn(() => ({})),
        query: vi.fn(() => ({})),
        where: vi.fn(() => ({}))
}));

// -!- eslint-disable-next-line import/first
import { authActions, authStore } from './auth';

describe('auth store', () => {
        beforeEach(() => {
                mocks.signInWithEmail.mockReset();
                mocks.signInWithProvider.mockReset();
                mocks.registerWithEmail.mockReset();
                mocks.completeProfile.mockReset();
                mocks.getUserDocument.mockReset();
                mocks.logout.mockReset();
                mocks.onAuthStateChangedSafe.mockClear();
                mocks.currentUser = null;
                authStore.set({
                        firebaseUser: null,
                        perfil: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null
                });
        });

        it('actualiza el perfil tras login con email', async () => {
                const firebaseUser = { uid: 'user-1', email: 'user@mail.com' } as never;
                mocks.signInWithEmail.mockImplementation(async () => {
                        mocks.currentUser = firebaseUser;
                        return firebaseUser;
                });
                mocks.getUserDocument.mockResolvedValue({
                        exists: () => true,
                        data: () => ({
                                rol: 'colaborador',
                                username: 'john',
                                nombre: 'John',
                                apellido: 'Doe',
                                estado: 'activo'
                        })
                });

                await authActions.login('user@mail.com', 'secret');

                expect(mocks.signInWithEmail).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'secret' });
                const state = get(authStore);
                expect(state.perfil).toMatchObject({ username: 'john', rol: 'colaborador' });
                expect(state.isAuthenticated).toBe(true);
        });

        it('registra colaborador y crea documentos en ambas colecciones', async () => {
                const firebaseUser = { uid: 'user-2', email: 'colab@mail.com' } as never;
                mocks.registerWithEmail.mockResolvedValue(firebaseUser);
                mocks.getUserDocument
                        .mockResolvedValueOnce({
                                exists: () => true,
                                data: () => ({
                                        rol: 'colaborador',
                                        username: 'newuser',
                                        nombre: 'New',
                                        apellido: 'User',
                                        estado: 'activo'
                                })
                        })
                        .mockResolvedValue({
                                exists: () => true,
                                data: () => ({
                                        rol: 'colaborador',
                                        username: 'newuser',
                                        nombre: 'New',
                                        apellido: 'User',
                                        estado: 'activo'
                                })
                        });

                await authActions.registerColaborador({
                        email: 'NEW@mail.com',
                        password: 'secret',
                        perfil: {
                                username: 'newuser',
                                nombre: 'New',
                                apellido: 'User',
                                tipo_colaborador: 'organizacion'
                        }
                });

                expect(mocks.registerWithEmail).toHaveBeenCalledWith({
                        email: 'new@mail.com',
                        password: 'secret',
                        displayName: 'New User'
                });
                expect(mocks.completeProfile).toHaveBeenCalledTimes(2);
                expect(mocks.completeProfile.mock.calls[0][0]).toMatchObject({
                        uid: 'user-2',
                        data: expect.objectContaining({ rol: 'colaborador', email: 'new@mail.com' }),
                        merge: false
                });
                expect(mocks.completeProfile.mock.calls[1][0]).toMatchObject({ collection: 'colaboradores' });
        });

        it('crea el perfil mínimo al autenticarse con Google', async () => {
                const firebaseUser = {
                        uid: 'user-3',
                        email: 'google@mail.com',
                        displayName: 'Jane Provider',
                        photoURL: 'https://example.com/avatar.jpg'
                } as never;
                mocks.signInWithProvider.mockImplementation(async () => {
                        mocks.currentUser = firebaseUser;
                        return firebaseUser;
                });
                mocks.getUserDocument
                        .mockResolvedValueOnce({ exists: () => false })
                        .mockResolvedValue({
                                exists: () => true,
                                data: () => ({
                                        rol: 'colaborador',
                                        username: 'google',
                                        nombre: 'Jane',
                                        apellido: 'Provider',
                                        estado: 'activo'
                                })
                        });

                await authActions.signInWithGoogle('colaborador');

                expect(mocks.signInWithProvider).toHaveBeenCalledWith(mocks.googleProvider);
                expect(mocks.completeProfile).toHaveBeenCalledTimes(2);
                expect(mocks.completeProfile.mock.calls[0][0]).toMatchObject({
                        uid: 'user-3',
                        merge: false,
                        data: expect.objectContaining({ rol: 'colaborador', email: 'google@mail.com' })
                });
                expect(mocks.completeProfile.mock.calls[1][0]).toMatchObject({ collection: 'colaboradores' });
                const state = get(authStore);
                expect(state.perfil).toMatchObject({ username: 'google', rol: 'colaborador' });
        });
});
