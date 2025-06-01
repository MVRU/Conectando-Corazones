<!--
* Componente: ProjectCard2
* Descripción : Tarjeta para mostrar un proyecto destacado.
* Props       : project (objeto Project del modelo español)
-->

<script lang="ts">
	import type { Project } from '$lib/models/Project';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	export let project!: Project;

	const {
		titulo,
		descripcion,
		imagen,
		actual,
		objetivo,
		unidad,
		especie = '',
		deadline,
		institucion,
		ubicacion
	} = project;

	/* -------- helpers -------- */
	const percent = Math.min(Math.round((actual / objetivo) * 100), 100);

	const fmt = (v: number) =>
		unidad === 'dinero' ? `$${v.toLocaleString('es-AR')}` : v.toLocaleString('es-AR');

	const unitInfo = {
		dinero: { label: 'Monetaria', color: 'green' as const, icon: '💰' },
		voluntarios: { label: 'Voluntariado', color: 'purple' as const, icon: '🤝' },
		materiales: { label: 'Materiales', color: 'blue' as const, icon: '📦' }
	}[unidad];

	const fecha = new Date(deadline).toLocaleDateString('es-AR', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	const descCorta =
		descripcion.length > 160 ? descripcion.slice(0, 157).trimEnd() + '…' : descripcion;

	const slug = titulo
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

	const objetivoLabel =
		unidad === 'dinero'
			? fmt(objetivo)
			: `${objetivo} ${unidad === 'voluntarios' ? 'voluntarios' : especie ? especie : 'unidades'}`;

	const actualLabel =
		unidad === 'dinero'
			? fmt(actual)
			: `${actual} ${unidad === 'voluntarios' ? 'voluntarios' : especie ? especie : 'unidades'}`;
</script>

<article
	class="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_4px_24px_0_#cbd5e133] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_8px_40px_0_#94a3b833]"
>
	<!-- Portada -->
	<div class="relative">
		<img
			src={imagen}
			alt={titulo}
			class="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<span
			class="absolute bottom-3 left-3 rounded-full bg-white/90 px-4 py-1 text-xs font-medium text-gray-700 shadow"
			>{fecha}</span
		>
	</div>

	<!-- Cuerpo -->
	<div class="flex flex-1 flex-col gap-4 p-6">
		<!-- Badges -->
		<div class="flex flex-wrap items-center gap-2">
			<Badge text={unitInfo.label} />
			<span class="flex items-center gap-1 text-xs text-gray-500">📍 {ubicacion}</span>
		</div>

		<h3 class="text-lg font-extrabold leading-tight">{titulo}</h3>
		<p class="truncate-description text-sm leading-relaxed text-gray-600">{descCorta}</p>

		<!-- Barra de progreso -->
		<div class="mt-auto flex flex-col gap-1">
			<!-- Meta superior -->
			<p class="mb-0.5 flex justify-between text-xs font-semibold text-gray-700">
				<span>{unitInfo.icon} Objetivo</span>
				<span class="text-gray-600">{actualLabel} / {objetivoLabel}</span>
			</p>

			<ProgressBar {percent} color={unitInfo.color} />

			<!-- Porcentaje alcanzado -->
			<p class="text-right text-[11px] font-medium text-gray-500">{percent}% del objetivo</p>
		</div>

		<!-- Leer más -->
		<a
			href={`/projects/${slug}`}
			class="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
		>
			Leer más
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</a>
	</div>
</article>

<style>
	.truncate-description {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		line-clamp: 3;
	}
</style>
