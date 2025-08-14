import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { mockUsuarios } from '$lib/mocks/mock-usuarios';

export const GET: RequestHandler = async ({ cookies }) => {
    const token = cookies.get('auth_token');
    if (!token) return json({ user: null });

    const userId = token.replace('mock-token-', '');
    const user = Object.values(mockUsuarios).find((u) => u.id === userId);

    if (!user) {
        cookies.delete('auth_token', { path: '/' });
        return json({ user: null });
    }

    return json({ user });
};