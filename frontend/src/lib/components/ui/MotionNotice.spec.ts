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
    motionNoticeVisible.set(true);    // Fuerza visibilidad del aviso
    reducedMotion.set(true);          // Simula preferencia de animaciones reducidas
    render(MotionNotice);             // Renderiza el componente

    // Verifica que el elemento con role="status" esté presente (el aviso)
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // Cambia el valor de reducedMotion al hacer clic en el botón
  it('toggles reducedMotion on click', async () => {
    motionNoticeVisible.set(true);    // Fuerza visibilidad del aviso
    reducedMotion.set(true);          // Simula preferencia de animaciones reducidas
    const { getByRole } = render(MotionNotice);

    // Simula clic en el botón que habilita animaciones
    await fireEvent.click(getByRole('button', { name: 'Habilitar animaciones' }));

    // Verifica que reducedMotion ahora sea false (animaciones habilitadas)
    expect(get(reducedMotion)).toBe(false);
  });
});
