// FIX: revisar y corregir errores tras cambios en interfaces

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

export const GET: RequestHandler = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) return json({ usuario: null });

    const username = token.replace('mock-token-', '');
    const usuario = Object.values(mockUsuarios).find((u) => u.username === username);

    if (!usuario) {
        cookies.delete('auth_token', { path: '/' });
        return json({ usuario: null });
    }

    const { password: _pw, ...safeUsuario } = usuario;
    return json({ usuario: safeUsuario });
};