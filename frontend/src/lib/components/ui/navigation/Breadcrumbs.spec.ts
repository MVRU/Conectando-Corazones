import { render, screen } from '@testing-library/svelte';
import Breadcrumbs from './Breadcrumbs.svelte';
import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';
import { describe, it, expect, beforeEach } from 'vitest';
import { setBreadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
import { tick } from 'svelte';
import '@testing-library/jest-dom/vitest';

const itemsBase: BreadcrumbItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
  { label: 'Detalle' }
];

describe('Breadcrumbs component', () => {
  beforeEach(() => {
    clearBreadcrumbs();
  });

  it('se renderiza cuando hay más de dos elementos', async () => {
    setBreadcrumbs(itemsBase);
    render(Breadcrumbs);
    await tick();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('se oculta con dos elementos o menos', async () => {
    setBreadcrumbs(itemsBase.slice(0, 2));
    const { queryByRole } = render(Breadcrumbs);
    await tick();
    expect(queryByRole('navigation')).toBeNull();
  });

  it('actualiza los elementos mostrados', async () => {
    setBreadcrumbs(itemsBase);
    render(Breadcrumbs);
    await tick();
    expect(screen.getByText('Detalle')).toBeInTheDocument();

    const newItems: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Nosotros', href: '/about' },
      { label: 'Proyectos', href: '/projects' },
      { label: 'Nuevo' }
    ];

    setBreadcrumbs(newItems);
    await tick();
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.queryByText('Detalle')).toBeNull();
  });
});