import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writable, get } from 'svelte/store';

// Mock de la store 'page' de SvelteKit
vi.mock('$app/stores', () => {
    const page = writable({ url: new URL('http://localhost/') });
    return { page };
});

let pageStore: ReturnType<typeof writable>;
let breadcrumbMod: typeof import('./breadcrumbs');

function setPath(path: string) {
    pageStore.set({ url: new URL('http://localhost' + path) } as any);
}

beforeEach(async () => {
    vi.resetModules();
    breadcrumbMod = await import('./breadcrumbs');
    pageStore = (await import('$app/stores')).page as any;
    breadcrumbMod.clearBreadcrumbs();
});

describe('breadcrumbs store', () => {
    it('genera migas desde la ruta', () => {
        setPath('/projects/8345');
        const items = get(breadcrumbMod.breadcrumbs);
        expect(items).toEqual([
            breadcrumbMod.BREADCRUMB_ROUTES.home,
            { label: 'Projects', href: '/projects' },
            { label: '8345' }
        ]);
    });

    it('no muestra migas si la ruta tiene dos segmentos o menos', () => {
        setPath('/projects');
        const items = get(breadcrumbMod.breadcrumbs);
        expect(items).toEqual([]);
    });

    it('permite definir migas personalizadas', () => {
        breadcrumbMod.setBreadcrumbs([
            breadcrumbMod.BREADCRUMB_ROUTES.home,
            breadcrumbMod.BREADCRUMB_ROUTES.projects,
            { label: 'Nuevo' }
        ]);
        const items = get(breadcrumbMod.breadcrumbs);
        expect(items[2].label).toBe('Nuevo');
    });

    it('limpia las migas personalizadas', () => {
        breadcrumbMod.setBreadcrumbs([
            breadcrumbMod.BREADCRUMB_ROUTES.home,
            breadcrumbMod.BREADCRUMB_ROUTES.projects,
            { label: 'Nuevo' }
        ]);
        breadcrumbMod.clearBreadcrumbs();
        setPath('/projects/2');
        const items = get(breadcrumbMod.breadcrumbs);
        expect(items[2].label).toBe('2');
    });
});