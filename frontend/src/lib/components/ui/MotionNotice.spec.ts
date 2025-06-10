import { render, screen } from '@testing-library/svelte';
import MotionNotice from './MotionNotice.svelte';
import { motionNoticeVisible, reducedMotion } from '$lib/stores/reducedMotion';

describe('MotionNotice component', () => {
  it('renders when visible', () => {
    motionNoticeVisible.set(true);
    reducedMotion.set(true);
    render(MotionNotice);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
