import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('signin page', () => {
        test('permite elegir rol y muestra formulario correspondiente', async () => {
                render(Page);
                expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Registrarse');
                const instBtn = screen.getByRole('button', { name: /institución/i });
                const colabBtn = screen.getByRole('button', { name: /colaborador/i });
                await fireEvent.click(instBtn);
                expect(screen.getByLabelText('Nombre de la institución *')).toBeInTheDocument();
                await fireEvent.click(screen.getByRole('button', { name: /elegir otro tipo/i }));
                await fireEvent.click(colabBtn);
                expect(screen.getByLabelText('Nombre *')).toBeInTheDocument();
        });
});
