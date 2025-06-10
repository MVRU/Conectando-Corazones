import { render, screen, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import MotionNotice from './MotionNotice.svelte';
import { motionNoticeVisible, reducedMotion } from '$lib/stores/reducedMotion';

describe('MotionNotice component', () => {
  it('renders when visible', () => {
    motionNoticeVisible.set(true);
    reducedMotion.set(true);
    render(MotionNotice);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('toggles reducedMotion on click', async () => {
    motionNoticeVisible.set(true);
    reducedMotion.set(true);
    const { getByRole } = render(MotionNotice);
    await fireEvent.click(getByRole('button', { name: 'Habilitar animaciones' }));
    expect(get(reducedMotion)).toBe(false);
  });
});
