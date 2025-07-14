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

  it('updates when items change', async () => {
    const { rerender } = render(Breadcrumbs, { props: { items: itemsBase } });
    expect(screen.getByText('Detalle')).toBeInTheDocument();

    const newItems: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Nosotros', href: '/about' },
      { label: 'Proyectos', href: '/projects' },
      { label: 'Nuevo' }
    ];

    await rerender({ items: newItems });
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.queryByText('Detalle')).toBeNull();
  });
});