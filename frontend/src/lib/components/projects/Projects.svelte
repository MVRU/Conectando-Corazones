<!--
* Componente: Projects
        -*- Descripción: Muestra y filtra una lista de proyectos
        -*- DECISIÓN DE DISEÑO: Se unificó el origen de datos en `projects.ts` y se simplificó el filtrado mediante un mapa de etiquetas.

* Props:
        -*- proyectos (Project[]): listado de proyectos a mostrar

TODO:
        - [ ] Implementar paginación
        - [ ] Agregar búsqueda por texto
        - [ ] Conectar con backend para datos reales
        - [ ] Implementar ordenamiento por diferentes criterios
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { projects } from '$lib/data/projects';
	import type { Project } from '$lib/models/Project';

	const participacionMap = {
		dinero: 'Monetaria',
		voluntarios: 'Voluntariado',
		materiales: 'Materiales'
	} as const;

	type ParticipacionLabel = (typeof participacionMap)[keyof typeof participacionMap];
	const tiposParticipacion: ('Todos' | ParticipacionLabel)[] = [
		'Todos',
		...Object.values(participacionMap)
	];

	const reverseMap: Record<ParticipacionLabel, keyof typeof participacionMap> = {
		Monetaria: 'dinero',
		Voluntariado: 'voluntarios',
		Materiales: 'materiales'
	};

	let filtroSeleccionado: ParticipacionLabel | 'Todos' = 'Todos';

	export let proyectos: Project[] = projects;
	let proyectosVisibles: Project[] = [];

	function filtrarProyectos() {
		if (filtroSeleccionado === 'Todos') {
			proyectosVisibles = proyectos;
		} else {
			const unidad = reverseMap[filtroSeleccionado];
			proyectosVisibles = proyectos.filter((p) => p.unidad === unidad);
		}
	}

	onMount(() => {
		filtrarProyectos();
	});

	$: if (filtroSeleccionado) {
		filtrarProyectos();
	}
</script>

<section class="w-full px-8 py-12">
	<!-- Título de la sección -->
	<div style="margin-bottom: var(--spacing-3xl);">
		<h2 class="text-4xl text-[rgb(var(--base-color))]">Proyectos Activos</h2>
		<p class="font-inter max-w-3xl text-lg text-gray-600">
			Descubrí los proyectos que necesitan tu colaboración. Cada iniciativa busca generar un impacto
			positivo en nuestra comunidad. Podés participar con donaciones monetarias, materiales
			específicos o como voluntario.
		</p>
	</div>

	<!-- Filtros -->
	<div style="margin-bottom: var(--spacing-3xl);">
		<h3 class="text-[rgb(var(--base-color))]">Filtrar por tipo de participación</h3>
		<div class="flex flex-wrap" style="gap: var(--spacing-md);">
			{#each tiposParticipacion as tipo}
				<button
					on:click={() => (filtroSeleccionado = tipo)}
					class="font-inter rounded-lg border-2 font-medium transition-all duration-200"
					style="padding: var(--spacing-md-sm) var(--spacing-lg);"
					class:bg-primary={filtroSeleccionado === tipo}
					class:text-white={filtroSeleccionado === tipo}
					class:border-[rgb(var(--color-primary))]={filtroSeleccionado === tipo}
					class:bg-white={filtroSeleccionado !== tipo}
					class:text-[rgb(var(--base-color))]={filtroSeleccionado !== tipo}
					class:border-gray-200={filtroSeleccionado !== tipo}
					class:hover:border-[rgb(var(--color-primary))]={filtroSeleccionado !== tipo}
					class:hover:text-[rgb(var(--color-primary))]={filtroSeleccionado !== tipo}
				>
					{tipo}
				</button>
			{/each}
		</div>
	</div>

	<!-- Contador de proyectos -->
	<div style="margin-bottom: var(--spacing-2xl);">
		<p class="font-inter font-medium text-[rgb(var(--base-color))]">
			Mostrando {proyectosVisibles.length} proyecto{proyectosVisibles.length !== 1 ? 's' : ''}
			{#if filtroSeleccionado !== 'Todos'}
				de tipo {filtroSeleccionado}
			{/if}
		</p>
	</div>

	<!-- Lista de proyectos -->
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each proyectosVisibles as proyecto}
			<ProjectCard {proyecto} mostrarBotones={true} />
		{/each}
	</div>

	<!-- Mensaje cuando no hay proyectos -->
	{#if proyectosVisibles.length === 0}
		<div class="py-12 text-center">
			<h3 class="mb-4 text-[rgb(var(--base-color))]">No hay proyectos disponibles</h3>
			<p class="font-inter mb-6 text-gray-600">
				No se encontraron proyectos para el filtro seleccionado. Intentá con otro tipo de
				participación.
			</p>
			<Button label="Ver todos los proyectos" href="/projects" disabled={false} />
		</div>
	{/if}
</section>
