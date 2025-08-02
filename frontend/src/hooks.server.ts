import type { Handle } from '@sveltejs/kit';
import { mockUsers } from '$lib/mocks/mock-users';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('auth_token');
    if (token) {
        const userId = token.replace('mock-token-', '');
        const user = Object.values(mockUsers).find((u) => u.id === userId);
        if (user) {
            event.locals.user = user;
        } else {
            event.cookies.delete('auth_token', { path: '/' });
        }
    }
    return resolve(event);
};