import { render, screen } from '@testing-library/svelte';
import Breadcrumbs from './Breadcrumbs.svelte';
import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

const itemsBase: BreadcrumbItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
  { label: 'Detalle' }
];

describe('Breadcrumbs component', () => {
  it('renders when there are more than two items', () => {
    render(Breadcrumbs, { props: { items: itemsBase } });
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('hides when there are two items or less', () => {
    const items: BreadcrumbItem[] = itemsBase.slice(0, 2);
    const { queryByRole } = render(Breadcrumbs, { props: { items } });
    expect(queryByRole('navigation')).toBeNull();
  });
});
