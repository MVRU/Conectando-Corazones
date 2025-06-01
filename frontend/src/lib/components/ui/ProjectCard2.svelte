<!--
* Componente: ProjectCard2
	-*- Descripción: muestra un proyecto con su imagen, título, descripción corta, progreso y botón de leer más.
-->

<!-- ProjectCard2.svelte -->
<script lang="ts">
	/* ----------  PROPS & HELPERS  ---------- */
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

	/* Texto mostrado sobre la meta */
	const objetivoLabel =
		unidad === 'dinero'
			? fmt(objetivo)
			: `${objetivo} ${unidad === 'voluntarios' ? 'voluntarios' : especie || 'unidades'}`;

	const actualLabel =
		unidad === 'dinero'
			? fmt(actual)
			: `${actual} ${unidad === 'voluntarios' ? 'voluntarios' : especie || 'unidades'}`;

	const slug = titulo
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
</script>

<article
	class="group flex h-full flex-col overflow-hidden rounded-3xl border border-transparent
	       bg-white shadow-lg transition-all duration-500
	       hover:-translate-y-2 hover:border-[rgb(147_197_253_/0.5)] hover:shadow-xl"
>
	<!-- ░░ Banner ░░ -->
	<div class="relative">
		<img
			src={imagen}
			alt={titulo}
			class="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>

		<!-- Fecha -->
		<span
			class="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-0.5
			       text-[11px] font-medium text-gray-700 shadow"
		>
			{fecha}
		</span>
	</div>

	<!-- ░░ Contenido ░░ -->
	<div class="flex flex-1 flex-col gap-4 p-6">
		<!-- Badges -->

		<!-- ! Lo comenté para que no abrume al usuario, pero se puede descomentar si se desea mostrar en un futuro
		 <div class="flex flex-wrap items-center gap-2">
			<Badge text={unitInfo.label} />
			<span class="flex items-center gap-1 text-xs text-gray-500">📍 {ubicacion}</span>
		</div> -->

		<!-- Título + institución -->
		<h3 class="custom-margin text-[1.1rem] font-extrabold leading-snug text-gray-900">{titulo}</h3>
		<a
			class="text-[13px] font-semibold text-[rgb(var(--color-primary))] transition-colors duration-300 hover:text-[rgb(var(--color-primary-hover))]/90"
			href={`/institutions/${slug}`}>{institucion}</a
		>

		<!-- *Descripción  -->
		<p class="truncate-description text-sm leading-relaxed text-gray-600">
			{descripcion.length > 160 ? descripcion.slice(0, 157).trimEnd() + '…' : descripcion}
		</p>

		<!-- Progreso -->
		<div class="mt-auto flex flex-col gap-1">
			<p class="mb-0.5 flex justify-between text-xs font-semibold text-gray-700">
				<span>{unitInfo.icon} Objetivo</span>
				<span>{actualLabel} / {objetivoLabel}</span>
			</p>

			<ProgressBar {percent} color={unitInfo.color} />
		</div>

		<!-- CTA -->
		<a
			href={`/projects/${slug}`}
			class="mt-1 inline-flex items-center gap-1 self-start rounded-full
			       bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600
			       transition-all duration-300 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
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

	.custom-margin {
		margin-top: 0.3rem;
		margin-bottom: 0.2rem;
	}
</style>
