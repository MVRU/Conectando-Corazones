import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { email, password, rememberMe } = await request.json();

    const user = Object.values(mockUsuarios).find((u) => u.email === email);
    if (!user || password !== '123456') {
        return json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    cookies.set('auth_token', `mock-token-${user.id}`, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined
    });

    return json({ user });
};