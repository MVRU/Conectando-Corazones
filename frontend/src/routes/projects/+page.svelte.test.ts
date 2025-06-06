import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/projects/+page.svelte', () => {
    test('muestra encabezado de proyectos', () => {
        render(Page);
        expect(screen.getByRole('heading', { level: 1, name: /proyectos/i })).toBeInTheDocument();
    });
});
