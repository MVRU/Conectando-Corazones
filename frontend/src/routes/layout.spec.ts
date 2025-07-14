import { render } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { writable } from 'svelte/store';

vi.mock('$lib/components/layout/Header.svelte', () => ({ default: () => '<div>H</div>' }));
vi.mock('$lib/components/layout/Footer.svelte', () => ({ default: () => '<div>F</div>' }));
vi.mock('$lib/components/feedback/MotionNotice.svelte', () => ({ default: () => '<div>M</div>' }));
vi.mock('$lib/components/ui/navigation/ScrollToTop.svelte', () => ({ default: () => '<div>S</div>' }));
vi.mock('$lib/components/ui/navigation/Breadcrumbs.svelte', () => ({ default: () => '<nav>breadcrumbs</nav>' }));

vi.mock('$app/stores', () => {
    const page = writable({ url: new URL('http://localhost/') });
    return { page };
});

vi.mock('$app/navigation', () => ({ beforeNavigate: vi.fn() }));

let pageStore: ReturnType<typeof writable>;
let Layout: typeof import('./+layout.svelte').default;

function setPath(path: string) {
    pageStore.set({ url: new URL('http://localhost' + path) } as any);
}

beforeEach(async () => {
    vi.resetModules();
    Layout = (await import('./+layout.svelte')).default;
    pageStore = (await import('$app/stores')).page as any;
});

describe('Layout breadcrumbs visibility', () => {
    it('oculta Breadcrumbs cuando no hay migas', () => {
        setPath('/about');
        const { queryByText } = render(Layout, { slots: { default: '<div></div>' } });
        expect(queryByText('breadcrumbs')).toBeNull();
    });

    it('muestra Breadcrumbs cuando hay migas', () => {
        setPath('/projects/1');
        const { getByText } = render(Layout, { slots: { default: '<div></div>' } });
        expect(getByText('breadcrumbs')).toBeInTheDocument();
    });
});