import type { Handle } from '@sveltejs/kit';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');
    if (token) {
        const username = token.replace('mock-token-', '');
        const usuario = Object.values(mockUsuarios).find((u) => u.username === username);
        if (usuario) {
            event.locals.usuario = usuario;
        } else {
            event.cookies.delete('auth_token', { path: '/' });
        }
    }
    return resolve(event);
};