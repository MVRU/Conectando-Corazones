<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { usuario } from '$lib/stores/auth';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	let menuAbierto = false;

	const adminLinks = [
		{
			label: 'Dashboard',
			href: '/admin',
			isActive: (pathname: string) => pathname === '/admin'
		},
		{
			label: 'Usuarios',
			href: '/admin/usuarios',
			isActive: (pathname: string) =>
				pathname.startsWith('/admin/usuarios') &&
				!pathname.startsWith('/admin/usuarios-bajas-calificaciones')
		},
		{
			label: 'Proyectos',
			href: '/admin/proyectos',
			isActive: (pathname: string) => pathname.startsWith('/admin/proyectos')
		},
		{
			label: 'Moderacion de resenas',
			href: '/admin/moderacion-resenas',
			isActive: (pathname: string) => pathname.startsWith('/admin/moderacion-resenas')
		},
		{
			label: 'Logs de actividad',
			href: '/admin/logs-actividad',
			isActive: (pathname: string) => pathname.startsWith('/admin/logs-actividad')
		},
		{
			label: 'Analytics',
			href: '/admin/analytics',
			isActive: (pathname: string) => pathname.startsWith('/admin/analytics')
		},
		{
			label: 'Configuracion',
			href: '/admin/configuracion',
			isActive: (pathname: string) => pathname.startsWith('/admin/configuracion')
		}
	];
</script>

<svelte:head>
	<title>Panel de administración - Conectando Corazones</title>
	<meta name="description" content="Panel de administración de Conectando Corazones" />
</svelte:head>

<main class="min-h-screen bg-gray-50 text-gray-900">
		<div class="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<!-- Sidebar -->
			<aside class="hidden w-64 flex-shrink-0 rounded-2xl border border-gray-200 bg-white px-4 py-6 shadow-sm lg:block">
				<div class="mb-8">
					<h1 class="text-lg font-semibold text-[rgb(var(--base-color))]">Administración</h1>
					<p class="mt-1 text-xs text-gray-500">Gestión de la plataforma</p>
				</div>

			<nav class="space-y-1 text-sm">
				{#each adminLinks as link}
					<a
						href={link.href}
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={link.isActive($page.url.pathname)}
					>
						<span>{link.label}</span>
					</a>
				{/each}
			</nav>
			</aside>

			<!-- Contenido principal -->
			<section class="flex-1 lg:pl-6">
				<!-- Topbar -->
				<header class="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
					<div>
						<h2 class="text-base font-semibold text-gray-900">Panel de administración</h2>
						<p class="text-xs text-gray-500">Control de usuarios, proyectos y colaboraciones</p>
					</div>
					<div class="flex items-center gap-3">
					<button
						type="button"
						class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 lg:hidden"
						aria-label={menuAbierto ? 'Cerrar menu admin' : 'Abrir menu admin'}
						on:click={() => (menuAbierto = !menuAbierto)}
					>
						{#if menuAbierto}
							<span aria-hidden="true">✕</span>
						{:else}
							<span aria-hidden="true">☰</span>
						{/if}
					</button>
						{#if $usuario}
							<div class="hidden flex-col items-end text-xs text-gray-600 sm:flex">
								<span class="font-medium">{$usuario.nombre} {$usuario.apellido}</span>
								<span class="text-[10px] uppercase tracking-wide text-[rgb(var(--color-primary))]">Administrador</span>
							</div>
						{/if}
					</div>
			</header>

			{#if menuAbierto}
				<nav class="mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
					<div class="flex flex-col gap-1">
						{#each adminLinks as link}
							<a
								href={link.href}
								class="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								class:selected={link.isActive($page.url.pathname)}
								on:click={() => (menuAbierto = false)}
							>
								<span>{link.label}</span>
							</a>
						{/each}
					</div>
				</nav>
			{/if}

				<!-- Slot para las páginas hijas -->
				<div class="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-6 shadow-sm sm:px-6 lg:px-8">
					<slot />
				</div>
			</section>
		</div>
	</main>

<style>
	.selected {
		background-color: #eff6ff;
		color: #1d4ed8;
		font-weight: 600;
	}
</style>
