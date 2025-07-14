import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authActions, authStore } from './auth';
import { get } from 'svelte/store';

const userMock = { id: '1', email: 'admin@conectandocorazones.org', nombre: 'Admin', role: 'admin' } as any;

describe('authActions', () => {
    beforeEach(() => {
        authStore.set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        vi.restoreAllMocks();
    });

    it('login actualiza el estado en éxito', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ user: userMock }) }));

        await authActions.login(userMock.email, '123456');
        const state = get(authStore);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user?.id).toBe(userMock.id);
    });

    it('logout limpia el estado', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) }));
        authStore.set({ user: userMock, isAuthenticated: true, isLoading: false, error: null });

        await authActions.logout();
        const state = get(authStore);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
    });
});