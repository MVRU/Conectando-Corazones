import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Image from './Image.svelte';

describe('Image component', () => {
  it('should apply srcset and sizes attributes', () => {
    const { container } = render(Image, {
      props: { src: '/img/test.png', alt: 'test', srcset: '/img/test.png 1x, /img/test@2x.png 2x', sizes: '(max-width: 600px) 480px, 800px' }
    });
    const img = container.querySelector('img');
    expect(img?.getAttribute('srcset')).toBe('/img/test.png 1x, /img/test@2x.png 2x');
    expect(img?.getAttribute('sizes')).toBe('(max-width: 600px) 480px, 800px');
  });
});

