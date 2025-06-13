<!--
* Componente: ProjectCard2
	-*- Descripción: muestra un proyecto con su imagen, título, descripción corta, progreso y botón de leer más.
-->

<script lang="ts">
	/* ----------  PROPS & HELPERS  ---------- */
	import type { Project } from '$lib/models/Project';
        import ProgressBar from '$lib/components/ui/elements/ProgressBar.svelte';
        import Button from '$lib/components/ui/elements/Button.svelte';

	export let project!: Project;

	// TODO: corregir cuando cambiemos el modelo de Project
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

	// Calcula la diferencia entre la fecha actual y el deadline
	function calcularTiempoRestante(fechaLimite: string): string {
		const hoy = new Date();
		const limite = new Date(fechaLimite);

		// Normaliza las fechas eliminando horas para más precisión
		hoy.setHours(0, 0, 0, 0);
		limite.setHours(0, 0, 0, 0);
		const diff = limite.getTime() - hoy.getTime();
		const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
		if (dias < 0) return 'Finalizado';
		if (dias === 0) return 'Último día';
		if (dias === 1) return 'Queda 1 día';
		if (dias < 7) return `Quedan ${dias} días`;
		const semanas = Math.floor(dias / 7);
		if (semanas === 1) return 'Queda 1 semana';
		if (dias < 30) return `Quedan ${semanas} semanas`;
		const meses = Math.floor(dias / 30);
		if (meses === 1) return 'Queda 1 mes';
		return `Quedan ${meses} meses`;
	}

	const tiempoRestante = calcularTiempoRestante(deadline);
</script>

<!-- ! MOBILE (y dispositivos pequeños): card sin botones -->
<a
	href={`/projects/${slug}`}
	class="block focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 max-[1084px]:block min-[1085px]:hidden
"
	tabindex="0"
	aria-label={`Ver detalles del proyecto ${titulo} de la institución ${institucion}`}
>
	<article
		class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl active:scale-[0.98] active:bg-[rgb(var(--color-primary))]/5"
	>
		<div class="relative aspect-[4/3] w-full overflow-hidden">
			<img
				src={imagen}
				alt={titulo}
				class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
			/>
			<span
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
			></span>
			<span
				class="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm"
			>
				⏳ {tiempoRestante}
			</span>
		</div>
		<div class="flex flex-1 flex-col gap-4 px-5 py-6 min-[510px]:px-6 min-[510px]:py-6">
			<div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
				<span
					class="inline-block text-[13px] font-semibold text-[rgb(var(--color-primary))] opacity-85"
				>
					{institucion}
				</span>
				{#if ubicacion}
					<span class="flex items-center gap-1">📍 {ubicacion}</span>
				{/if}
			</div>
			<h3 class="custom-margin mt-1 text-base font-extrabold leading-snug text-gray-900">
				{titulo}
			</h3>
			<p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
				{descripcion.length > 160 ? descripcion.slice(0, 157).trimEnd() + '…' : descripcion}
			</p>
			<div class="mt-auto flex flex-col gap-1">
				<p class="mb-0.5 flex justify-between text-xs font-semibold text-gray-700">
					<span>{unitInfo.icon} Objetivo</span>
					<span>{actualLabel} / {objetivoLabel}</span>
				</p>
				<ProgressBar {percent} color={unitInfo.color} />
			</div>
			<span
				class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-300 transition group-active:text-sky-400 max-[1084px]:block min-[1085px]:hidden"
			>
				→
			</span>
		</div>
	</article>
</a>

<!-- ! DESKTOP (o dispositivos >= 860px): card con botones -->
<article
	class="group relative hidden h-full flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl min-[1085px]:flex"
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
			class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
		></span>

		<!-- *Fecha -->
		<span
			class="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm"
		>
			⏳ {tiempoRestante}
		</span>
	</div>

	<!-- !Contenido -->
	<div class="flex flex-1 flex-col gap-4 p-6">
		<!-- *Institución y ubicación -->
		<div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
			<a
				class="nav-link inline-block text-[13px] font-semibold text-[rgb(var(--color-primary))] transition-colors duration-300 hover:text-[rgb(var(--color-primary-hover))]"
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
		<p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
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
		<div class="flex items-center gap-2 pt-2">
			<!-- ! Botón Leer más -->
			<Button
				label="Leer más"
				variant="secondary"
				href={`/projects/${slug}`}
				size="sm"
				customClass="flex-1"
				customAriaLabel="Leer más sobre el proyecto ${titulo}"
			/>
			<!-- ! Botón + expandible -->
			<a
				href={`/projects/${slug}#colaborar`}
				aria-label="Colaborar ahora en el proyecto ${titulo}"
				class="group/button relative flex h-9 w-9 items-center justify-start gap-2 overflow-hidden rounded-full bg-[rgb(var(--color-primary))] pl-3 pr-3 text-white transition-all duration-300 hover:w-44 hover:bg-[rgb(var(--color-primary-hover))]"
			>
				<!-- -!- Ícono "+" animado desplazado -->
				<span
					class="flex h-6 w-6 items-center justify-center text-lg font-bold transition-all duration-300 group-hover/button:rotate-90"
				>
					+
				</span>
				<!-- -!- Texto expandible -->
				<span
					class="whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover/button:opacity-100"
				>
					Colaborar ahora
				</span>
			</a>
		</div>
	</div>
</article>

<style>
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
