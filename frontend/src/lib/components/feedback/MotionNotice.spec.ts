import { render, screen, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import MotionNotice from './MotionNotice.svelte';
import { motionNoticeVisible, reducedMotion } from '$lib/stores/reducedMotion';
import { describe, expect, it } from 'vitest';

/**
 * ! Test para el componente <MotionNotice />.
 * 
 * Este archivo verifica:
 * - Que el aviso se renderiza cuando el store motionNoticeVisible está en true.
 * - Que al hacer clic en el botón, la preferencia de animaciones (reducedMotion) se actualiza correctamente.
 */

describe('MotionNotice component', () => {
  // Renderiza el aviso cuando motionNoticeVisible es true
  it('renders when visible', () => {
    motionNoticeVisible.set(true); // se fuerza la visibilidad
    reducedMotion.set(true);
    render(MotionNotice);

    // el contenedor actúa como botón para expandir
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  // Cambia el valor de reducedMotion al hacer clic en el botón
  it('toggles reducedMotion on click', async () => {
    motionNoticeVisible.set(true);
    reducedMotion.set(true);
    const { getByRole } = render(MotionNotice);

    // primero se expande para mostrar el botón interno
    await fireEvent.click(getByRole('button'));
    await fireEvent.click(getByRole('button', { name: 'Habilitar' }));

    expect(get(reducedMotion)).toBe(false);
  });
});