<!--
*- DECISIÓN DE DISEÑO: Presentamos la información del proyecto activo en un layout resumido y fácil de leer.
-->
<script lang="ts">
	import { DownloadCloud, ChevronRight } from 'lucide-svelte';

	import type { ProjectItem } from '../types';
	import {
		BG_900,
		BG_CARD,
		BORDER_SUBTLE,
		PRIMARY_300,
		PRIMARY_500,
		RING_AZURE_10,
		TEXT_100,
		TEXT_300
	} from '../tokens';

	export let project: ProjectItem;
</script>

<section
	class="flex h-full min-h-[60vh] flex-col gap-8 rounded-[28px] p-10"
	style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
>
	<header class="space-y-2">
		<h2 class="text-4xl font-extrabold" style="color: {TEXT_100};">{project.name}</h2>
		<p class="text-lg font-medium" style="color: {TEXT_300};">
			Fecha de cierre estimada: {project.date}
		</p>
	</header>

	<article
		class="rounded-[18px] p-6"
		style="background: {BG_900}; border: 1px solid {project.statusColor};"
	>
		<p class="text-lg font-bold" style="color: {project.statusColor};">
			Estado actual: {project.status}
		</p>
		<p class="mt-4 text-base leading-relaxed" style="color: {TEXT_300};">
			En la Escuela Esperanza buscamos llevar iluminación segura a las aulas y garantizar
			condiciones dignas para más de 200 estudiantes. El proyecto incluye cableado nuevo, lámparas
			LED y acompañamiento técnico.
		</p>
	</article>

	<div class="flex flex-wrap items-center gap-4">
		<button
			class="flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98] sm:w-auto"
			style="background: linear-gradient(135deg, {PRIMARY_300} 0%, {PRIMARY_500} 100%); box-shadow: 0 5px 20px {PRIMARY_500}40; --tw-ring-color: {RING_AZURE_10};"
			type="button"
		>
			<DownloadCloud class="h-5 w-5" />
			Ver evidencia
		</button>
		<button
			class="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-white"
			style="color: {PRIMARY_500};"
			type="button"
		>
			Ver todos los proyectos
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
</section>
