<!--
* Componente: ProjectCard2
	-*- Descripción: muestra un proyecto con su imagen, título, descripción corta, progreso y botón de leer más.
-->

<script lang="ts">
	/* ----------  PROPS & HELPERS  ---------- */
	import type { Project } from '$lib/models/Project';
	import ProgressBar from '$lib/components/ui/ProgressBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';

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
	class="group relative flex h-full flex-col overflow-hidden rounded-3xl
	       border border-sky-100 bg-white shadow-md transition-all duration-500
	       hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
>
	<!-- *Banner/Portada -->
	<div class="relative aspect-[4/3] w-full overflow-hidden">
		<img
			src={imagen}
			alt={titulo}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>

		<!-- *Overlay degradé (en hover) -->
		<span
			class="pointer-events-none absolute inset-0 bg-gradient-to-t
			       from-black/45 via-black/20 to-transparent
			       opacity-0 transition-opacity duration-500 group-hover:opacity-100"
		></span>

		<!-- *Fecha -->
		<span
			class="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-0.5
			       text-[11px] font-medium text-gray-700 shadow-sm backdrop-blur-sm"
		>
			{fecha}
		</span>
	</div>

	<!-- !Contenido -->

	<div class="flex flex-1 flex-col gap-4 p-6">
		<!-- *Institución y ubicación -->
		<div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
			<a
				class="nav-link inline-block text-[13px]
			       font-semibold text-[rgb(var(--color-primary))] transition-colors duration-300 hover:text-[rgb(var(--color-primary-hover))]"
				href={`/institutions/${slug}`}
			>
				{institucion}
			</a>

			{#if ubicacion}
				<span class="flex items-center gap-1">📍 {ubicacion}</span>
			{/if}
		</div>

		<!-- *Título -->
		<h3 class="custom-margin mt-1 text-lg font-extrabold leading-snug text-gray-900">
			{titulo}
		</h3>
		<!-- *Descripción truncada -->
		<p class="truncate-description text-sm leading-relaxed text-gray-600">
			{descripcion.length > 160 ? descripcion.slice(0, 157).trimEnd() + '…' : descripcion}
		</p>

		<!-- *Progreso -->
		<div class="mt-auto flex flex-col gap-1">
			<p class="mb-0.5 flex justify-between text-xs font-semibold text-gray-700">
				<span>{unitInfo.icon} Objetivo</span>
				<span>{actualLabel} / {objetivoLabel}</span>
			</p>

			<ProgressBar {percent} color={unitInfo.color} />
		</div>

		<!-- *CTA -->
		<div class="pt-2">
			<Button
				label="Leer más"
				variant="secondary"
				href={`/projects/${slug}`}
				size="sm"
				customClass="w-full"
			/>
		</div>
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
		margin-top: 0.2rem;
		margin-bottom: 0.2rem;
	}

	.nav-link {
		position: relative;
		opacity: 0.85;
		padding-bottom: 2px;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -2px;
		height: 2px;
		width: 0;
		border-radius: 2px;
		background: linear-gradient(90deg, #60a5fa 0%, #bae6fd 100%);
		transition: width 0.34s cubic-bezier(0.42, 0, 0.18, 1);
	}
	.nav-link:hover::after {
		width: 100%;
	}
</style>
