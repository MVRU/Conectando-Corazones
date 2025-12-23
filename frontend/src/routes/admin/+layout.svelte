<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { usuario } from '$lib/stores/auth';
	import Button from '$lib/components/ui/elementos/Button.svelte';
</script>

<svelte:head>
	<title>Panel de administración - Conectando Corazones</title>
	<meta name="description" content="Panel de administración de Conectando Corazones" />
</svelte:head>

<main class="min-h-screen bg-gray-50 text-gray-900">
		<div class="flex min-h-screen">
			<!-- Sidebar -->
			<aside class="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white/95 px-4 py-6 shadow-sm lg:block">
				<div class="mb-8">
					<h1 class="text-lg font-semibold text-[rgb(var(--base-color))]">Admin</h1>
					<p class="mt-1 text-xs text-gray-500">Gestión de la plataforma</p>
				</div>

				<nav class="space-y-1 text-sm">
					<a
						href="/admin"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname === '/admin'}
					>
						<span>Dashboard</span>
					</a>
					<a
						href="/admin/usuarios"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/usuarios') && !$page.url.pathname.startsWith('/admin/usuarios-bajas-calificaciones')}
					>
						<span>Usuarios</span>
					</a>
					<a
						href="/admin/proyectos"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/proyectos')}
					>
						<span>Proyectos</span>
					</a>
					<a
						href="/admin/reportes"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/reportes')}
					>
						<span>Reportes</span>
					</a>
					<a
						href="/admin/usuarios-bajas-calificaciones"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/usuarios-bajas-calificaciones')}
					>
						<span>Usuarios con bajas calificaciones</span>
					</a>
					<a
						href="/admin/moderacion-resenas"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/moderacion-resenas')}
					>
						<span>Moderación de reseñas</span>
					</a>
					<a
						href="/admin/logs-actividad"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/logs-actividad')}
					>
						<span>Logs de actividad</span>
					</a>
					<a
						href="/admin/analytics"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/analytics')}
					>
						<span>Analytics</span>
					</a>
					<a
						href="/admin/configuracion"
						class="flex items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						class:selected={$page.url.pathname.startsWith('/admin/configuracion')}
					>
						<span>Configuración</span>
					</a>
				</nav>
			</aside>

			<!-- Contenido principal -->
			<section class="flex-1">
				<!-- Topbar -->
				<header class="flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
					<div>
						<h2 class="text-base font-semibold text-gray-900">Panel de administración</h2>
						<p class="text-xs text-gray-500">Control de usuarios, proyectos y colaboraciones</p>
					</div>
					<div class="flex items-center gap-3">
						{#if $usuario}
							<div class="hidden flex-col items-end text-xs text-gray-600 sm:flex">
								<span class="font-medium">{$usuario.nombre} {$usuario.apellido}</span>
								<span class="text-[10px] uppercase tracking-wide text-[rgb(var(--color-primary))]">Administrador</span>
							</div>
						{/if}
						<Button
							label="Volver al panel"
							variant="secondary"
							size="sm"
							type="button"
							on:click={() => goto('/mi-panel')}
						/>
					</div>
				</header>

				<!-- Slot para las páginas hijas -->
				<div class="px-4 py-6 sm:px-6 lg:px-8">
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
