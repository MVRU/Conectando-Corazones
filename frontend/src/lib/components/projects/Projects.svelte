<script lang="ts">
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import { projects as defaultProjects } from '$lib/data/projects';
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
	export let proyectos: Project[] = defaultProjects;
	let proyectosVisibles: Project[] = [];

	const ESTADO_PRIORIDAD: Record<string, number> = {
		Activo: 0,
		'En ejecución': 1,
		Finalizado: 2
	};

	function estadoTemporizadorProyecto(p: Project): string {
		const hoy = new Date();
		const inicio = p.fechaInicio ? new Date(p.fechaInicio) : null;
		const cierre = p.fechaCierre ? new Date(p.fechaCierre) : null;

		if (!inicio || !cierre) return 'Activo';

		if (hoy > cierre) return 'Finalizado';
		if (hoy >= inicio && hoy <= cierre) return 'En ejecución';
		return 'Activo';
	}

	function filtrarProyectos(proyectos: Project[], filtro: typeof filtroSeleccionado): Project[] {
		let resultado = [...proyectos];

		if (filtro !== 'Todos') {
			const unidadEsperada = reverseMap[filtro];
			resultado = resultado.filter((p) => (p.unidad || '').trim().toLowerCase() === unidadEsperada);
		}

		// Ordenar primero por estado (Activo < En ejecución < Finalizado) y después por fechaInicio asc
		resultado.sort((a, b) => {
			const estadoA = estadoTemporizadorProyecto(a);
			const estadoB = estadoTemporizadorProyecto(b);
			const prioridadEstadoA = ESTADO_PRIORIDAD[estadoA] ?? 3;
			const prioridadEstadoB = ESTADO_PRIORIDAD[estadoB] ?? 3;

			if (prioridadEstadoA !== prioridadEstadoB) {
				return prioridadEstadoA - prioridadEstadoB;
			}

			// Si los estados son iguales, ordenar por fechaInicio asc
			const fechaA = new Date(a.fechaInicio || '').getTime();
			const fechaB = new Date(b.fechaInicio || '').getTime();
			return fechaA - fechaB;
		});

		return resultado;
	}

	$: proyectosVisibles = filtrarProyectos(proyectos, filtroSeleccionado);
</script>

<section class="w-full px-8 py-12">
	<!-- Título -->
	<div style="margin-bottom: var(--spacing-3xl);">
		<h2 class="text-4xl text-[rgb(var(--base-color))]">Proyectos Activos</h2>
		<p class="font-inter max-w-3xl text-lg text-gray-600">
			Descubrí los proyectos que necesitan tu colaboración. Podés participar con donaciones
			monetarias, materiales específicos o como voluntario.
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

	<!-- Contador -->
	<div style="margin-bottom: var(--spacing-2xl);">
		<p class="font-inter font-medium text-[rgb(var(--base-color))]">
			Mostrando {proyectosVisibles.length} proyecto{proyectosVisibles.length !== 1 ? 's' : ''}
			{#if filtroSeleccionado !== 'Todos'}
				de tipo {filtroSeleccionado}
			{/if}
		</p>
	</div>

	<!-- Lista -->
	<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
		{#each proyectosVisibles as proyecto (proyecto.id)}
			<ProjectCard {proyecto} mostrarBotones={true} />
		{/each}
	</div>

	<!-- Sin resultados -->
	{#if proyectosVisibles.length === 0}
		<div class="py-12 text-center">
			<h3 class="mb-4 text-[rgb(var(--base-color))]">No hay proyectos disponibles</h3>
			<p class="font-inter mb-6 text-gray-600">
				No se encontraron proyectos para el filtro seleccionado. Intentá con otro tipo de
				participación.
			</p>
			<Button label="Ver todos los proyectos" href="/projects" />
		</div>
	{/if}
</section>
