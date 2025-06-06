import { render, screen } from '@testing-library/svelte';
import Breadcrumbs from './Breadcrumbs.svelte';
import type { BreadcrumbItem } from '$lib/stores/breadcrumbs';

const itemsBase: BreadcrumbItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/about' },
  { label: 'Contacto', href: '/contact' },
  { label: 'Detalle' }
];

test('renders when there are more than two items', () => {
  render(Breadcrumbs, { props: { items: itemsBase } });
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test('hides when there are two items or less', () => {
  const items: BreadcrumbItem[] = itemsBase.slice(0, 2);
  const { queryByRole } = render(Breadcrumbs, { props: { items } });
  expect(queryByRole('navigation')).toBeNull();
});

