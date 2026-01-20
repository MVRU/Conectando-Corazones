<script lang="ts">
	import Badge from '$lib/components/ui/elementos/Badge.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { mockUsuarios } from '$lib/mocks/mock-usuarios';
	import { mockProyectos } from '$lib/mocks/mock-proyectos';
	import type { MockUsuarios } from '$lib/mocks/mock-usuarios';
	import type { Proyecto } from '$lib/types/Proyecto';
	import { obtenerUrlPerfil } from '$lib/utils/util-perfil';

	const usuariosArray = Object.values(mockUsuarios as MockUsuarios);
	const proyectosArray: Proyecto[] = mockProyectos;

	const totalUsuarios = usuariosArray.length;
	const totalProyectos = proyectosArray.length;

const usuariosPorRol = usuariosArray.reduce(
		(acc, u) => {
			if (u.rol === 'administrador') acc.administradores += 1;
			if (u.rol === 'institucion') acc.instituciones += 1;
			if (u.rol === 'colaborador') acc.colaboradores += 1;
			return acc;
		},
		{ administradores: 0, instituciones: 0, colaboradores: 0 }
	);

	const proyectosPorEstado = proyectosArray.reduce(
		(acc, p) => {
			const estado = p.estado ?? 'en_curso';
			acc[estado] = (acc[estado] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>
	);

	const totalColaboraciones = proyectosArray.reduce(
		(acc, p) => acc + (p.colaboraciones?.length ?? 0),
		0
	);

	const recientesUsuarios = [...usuariosArray]
		.sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0))
		.slice(0, 5);

	const recientesProyectos = [...proyectosArray]
		.sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0))
		.slice(0, 5);
</script>

<svelte:head>
	<title>Dashboard admin - Conectando Corazones</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<Badge text="Panel admin" />
			<h1 class="mt-3 text-2xl font-bold text-gray-900">Resumen general</h1>
			<p class="mt-1 text-sm text-gray-600">
				Vista rápida del estado de usuarios, proyectos y colaboraciones
			</p>
		</div>
	</div>

	<!-- Métricas principales -->
	<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-medium text-gray-500">Usuarios totales</p>
			<p class="mt-2 text-2xl font-semibold text-gray-900">{totalUsuarios}</p>
			<p class="mt-1 text-xs text-gray-500">
				{usuariosPorRol.administradores} admins • {usuariosPorRol.instituciones} instituciones •
				{usuariosPorRol.colaboradores} colaboradores
			</p>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-medium text-gray-500">Proyectos totales</p>
			<p class="mt-2 text-2xl font-semibold text-gray-900">{totalProyectos}</p>
			<p class="mt-1 text-xs text-gray-500">
				{Object.entries(proyectosPorEstado)
					.map(([estado, cantidad]) => `${estado}: ${cantidad}`)
					.join(' • ')}
			</p>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-medium text-gray-500">Colaboraciones</p>
			<p class="mt-2 text-2xl font-semibold text-gray-900">{totalColaboraciones}</p>
			<p class="mt-1 text-xs text-gray-500">Suma de todas las colaboraciones en proyectos</p>
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<p class="text-xs font-medium text-gray-500">Estado del sistema</p>
			<p class="mt-2 text-sm font-semibold text-gray-900">Todo en orden</p>
			<p class="mt-1 text-xs text-gray-500">
				Seguimiento general de métricas y actividad reciente del sistema.
			</p>
		</div>
	</section>

	<!-- Listados recientes -->
	<section class="grid gap-6 lg:grid-cols-2">
		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<h2 class="text-sm font-semibold text-gray-900">Últimos usuarios registrados</h2>
			<p class="mb-3 mt-1 text-xs text-gray-500">Tomados desde los datos mockeados</p>
			{#if recientesUsuarios.length === 0}
				<p class="text-xs text-gray-500">No hay usuarios registrados.</p>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each recientesUsuarios as u}
						<li class="flex items-center justify-between py-2">
							<div>
								<p class="text-sm font-medium text-gray-800">
									{#if obtenerUrlPerfil(u)}
										<a
											href={obtenerUrlPerfil(u)!}
											class="transition hover:text-blue-600 hover:underline"
										>
											{u.nombre} {u.apellido}
										</a>
									{:else}
										{u.nombre} {u.apellido}
									{/if}
								</p>
								<p class="text-xs text-gray-500">{u.username} • {u.rol}</p>
							</div>
							<p class="text-xs text-gray-400">
								{u.created_at ? u.created_at.toLocaleDateString('es-AR') : 's/f'}
							</p>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
			<h2 class="text-sm font-semibold text-gray-900">Últimos proyectos creados</h2>
			<p class="mb-3 mt-1 text-xs text-gray-500">Tomados desde los datos mockeados</p>
			{#if recientesProyectos.length === 0}
				<p class="text-xs text-gray-500">No hay proyectos registrados.</p>
			{:else}
				<ul class="divide-y divide-gray-100">
					{#each recientesProyectos as p}
						<li class="flex items-center justify-between py-2">
							<div>
								<p class="text-sm font-medium text-gray-800">
									{#if p.id_proyecto}
										<a
											href={`/proyectos/${p.id_proyecto}`}
											class="transition hover:text-blue-600 hover:underline"
										>
											{p.titulo}
										</a>
									{:else}
										{p.titulo}
									{/if}
								</p>
								<p class="text-xs text-gray-500">
									{#if obtenerUrlPerfil(p.institucion)}
										<a
											href={obtenerUrlPerfil(p.institucion)!}
											class="transition hover:text-blue-600 hover:underline"
										>
											{p.institucion?.nombre_legal || 'Institución sin nombre'}
										</a>
									{:else}
										{p.institucion?.nombre_legal || 'Institución sin nombre'}
									{/if}
								</p>
							</div>
							<p class="text-xs text-gray-400">
								{p.created_at ? p.created_at.toLocaleDateString('es-AR') : 's/f'}
							</p>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</section>
</div>
