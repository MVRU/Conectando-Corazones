import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';
import Page from './+page.svelte';

describe('signin page', () => {
        test('muestra formulario de institución por defecto y cambia a colaborador', async () => {
                render(Page);
                expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Registrarse');
                expect(screen.getByLabelText('Nombre de la institución *')).toBeInTheDocument();
                const colaboradorRadio = screen.getByLabelText('Colaborador');
                await fireEvent.click(colaboradorRadio);
                expect(screen.getByLabelText('Tipo de colaborador *')).toBeInTheDocument();
        });
});
