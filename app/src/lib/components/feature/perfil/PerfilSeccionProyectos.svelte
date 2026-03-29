<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import ProyectoCard from '$lib/components/ui/cards/ProyectoCard.svelte';
	import { FolderOpen, ChevronDown, ChevronUp, Layers2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { proyectos, rol, estadoVerificacion } = $props<{
		proyectos: Proyecto[];
		rol: 'institucion' | 'colaborador' | 'administrador';
		estadoVerificacion?: string;
	}>();

	const LIMITE_INICIAL = 4;

	let mostrarTodos = $state(false);

	let proyectosMostrados = $derived(mostrarTodos ? proyectos : proyectos.slice(0, LIMITE_INICIAL));
	let tieneProyectos = $derived(proyectos.length > 0);
	let hayMas = $derived(proyectos.length > LIMITE_INICIAL);
	let mensajeVacio = $derived(
		rol === 'institucion'
			? 'Cuando crees proyectos, aparecerán aquí.'
			: 'Cuando participes en proyectos, aparecerán aquí.'
	);
	let tituloSeccion = $derived(rol === 'institucion' ? 'Proyectos' : 'Participaciones');
</script>

<section>
	<div class="mb-5 flex items-center justify-between">
		<h3 class="flex items-center gap-2 text-base font-bold text-gray-900">
			<Layers2 class="h-5 w-5 text-[#007FFF]" />
			{tituloSeccion}
			{#if tieneProyectos}
				<span class="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#007FFF]">
					{proyectos.length}
				</span>
			{/if}
		</h3>
	</div>

	{#if tieneProyectos}
		<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
			{#each proyectosMostrados as proyecto (proyecto.id_proyecto)}
				<div in:fly={{ y: 12, duration: 280, easing: cubicOut }}>
					<ProyectoCard {proyecto} />
				</div>
			{/each}
		</div>

		{#if hayMas}
			<div class="mt-4 flex justify-center">
				<button
					onclick={() => (mostrarTodos = !mostrarTodos)}
					class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all duration-200 hover:border-[#007FFF]/30 hover:bg-blue-50 hover:text-[#007FFF]"
				>
					{#if mostrarTodos}
						<ChevronUp class="h-4 w-4" />
						Mostrar menos
					{:else}
						<ChevronDown class="h-4 w-4" />
						Ver todos los proyectos ({proyectos.length})
					{/if}
				</button>
			</div>
		{/if}
	{:else}
		<div class="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 py-12 text-center transition-all duration-300 hover:border-[#007FFF]/20 hover:bg-white hover:shadow-sm">
			<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-[#007FFF]">
				<FolderOpen class="h-8 w-8" />
			</div>
			
			<h4 class="mb-1 text-sm font-semibold text-gray-800">
				No hay {tituloSeccion.toLowerCase()} aún
			</h4>
			
			<p class="max-w-[260px] text-xs leading-relaxed text-gray-500">
				{mensajeVacio}
			</p>

			{#if rol === 'institucion'}
				{#if estadoVerificacion === 'aprobada'}
					<a
						href="/proyectos/nuevo"
						class="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007FFF] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 transition-all duration-200 hover:bg-[#42A1FF] hover:shadow-lg active:scale-95 text-center"
					>
						<Layers2 class="h-4 w-4" />
						Crear mi primer proyecto
					</a>
				{:else}
					<button
						disabled
						title="Tu institución debe estar verificada para publicar proyectos"
						class="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-300 px-5 py-2.5 text-xs font-bold text-gray-500 cursor-not-allowed opacity-60 text-center"
					>
						<Layers2 class="h-4 w-4" />
						Crear mi primer proyecto
					</button>
					<p class="mt-3 text-xs text-rose-600 font-medium">
						Tu institución debe estar verificada para publicar proyectos
					</p>
				{/if}
			{/if}
		</div>
	{/if}
</section>
