<!--
* Componente: Projects
        -*- Descripción: Muestra una lista de proyectos con información detallada y filtros
        -*- Funcionalidad: Filtros por tipo de participación, búsqueda y paginación
        -*- DECISIÓN DE DISEÑO: Se consume un único listado unificado (`projects.ts`) y
        se mapea la propiedad `unidad` a etiquetas de participación para simplificar
        la lógica de filtrado.

* Props:
	-*- proyectos (array): lista de proyectos a mostrar

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
       import { projects as demoProjects } from '$lib/data/projects';
       import type { Project } from '$lib/models/Project';
                dinero: 'Monetaria',
                voluntarios: 'Voluntariado',
                materiales: 'Materiales'
        } as const;
       const tiposParticipacion = ['Todos', ...Object.values(participacionMap)];
       let filtroSeleccionado = 'Todos';
       let proyectosVisibles: Project[] = [];
       // Datos de ejemplo centralizados en $lib/data
       export let proyectos: Project[] = demoProjects;
               const unidad = (Object.entries(participacionMap).find(([_, v]) => v === filtroSeleccionado)?.[0]) as keyof typeof participacionMap;
	let filtroSeleccionado = 'Todos';
	let proyectosVisibles: any[] = [];

	// Datos de ejemplo centralizados en $lib/data
	const proyectos = proyectosDemo;

	// Función para filtrar proyectos
	function filtrarProyectos() {
		if (filtroSeleccionado === 'Todos') {
			proyectosVisibles = proyectos;
		} else {
			proyectosVisibles = proyectos.filter(
				(proyecto) => proyecto.tipoParticipacion === filtroSeleccionado
			);
		}
	}

	// Inicializar al montar el componente
	onMount(() => {
		filtrarProyectos();
	});

	// Reactividad para el filtro
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
