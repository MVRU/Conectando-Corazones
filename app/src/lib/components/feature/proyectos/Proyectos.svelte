<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import TodosProyectos from './TodosProyectos.svelte';
	import MisProyectos from './MisProyectos.svelte';
	import { usuario } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';

	interface Props {
		proyectos: Proyecto[];
		provinciasDisponibles?: string[];
		estadosDisponibles?: Array<{ value: string; label: string }>;
		categoriasDisponibles?: string[];
		tiposParticipacionDisponibles?: string[];
	}

	let {
		proyectos = [],
		provinciasDisponibles = [],
		estadosDisponibles = [],
		categoriasDisponibles = [],
		tiposParticipacionDisponibles = []
	}: Props = $props();

	let activeTab = $state<'todos' | 'mis-proyectos' | 'auditoria'>('todos');

	let esAdministrador = $derived($usuario?.rol === 'administrador');

	$effect(() => {
		if (page.url.searchParams.get('tab') === 'mis-proyectos' && $usuario && !esAdministrador) {
			activeTab = 'mis-proyectos';
		} else if (page.url.searchParams.get('tab') === 'auditoria' && esAdministrador) {
			activeTab = 'auditoria';
		}
	});

	function handleTabChange(tab: 'todos' | 'mis-proyectos' | 'auditoria') {
		activeTab = tab;
		const url = new URL(window.location.href);
		if (tab !== 'todos') {
			url.searchParams.set('tab', tab);
		} else {
			url.searchParams.delete('tab');
		}
		window.history.replaceState({}, '', url);
	}

	let proyectosEnAuditoria = $derived(
		proyectos.filter((p: Proyecto) => p.estado === 'en_auditoria')
	);

	let proyectosPublicos = $derived(
		proyectos.filter((p: Proyecto) => p.estado !== 'cancelado' && p.estado !== 'en_auditoria')
	);

	let estadosPublicos = $derived(
		estadosDisponibles.filter(
			(e: { value: string; label: string }) => e.value !== 'cancelado' && e.value !== 'en_auditoria'
		)
	);
</script>

<section class="min-h-screen w-full bg-gray-50 pt-8">
	<!-- TABS -->
	{#if $usuario}
		<div class="mb-8 flex justify-center">
			<div class="inline-flex rounded-full bg-gray-100/80 p-1.5 shadow-inner">
				<button
					class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-black/5 focus:outline-none {activeTab ===
					'todos'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-900'}"
					onclick={() => handleTabChange('todos')}
				>
					Todos los proyectos
				</button>
				{#if esAdministrador}
					<button
						class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-black/5 focus:outline-none {activeTab ===
						'auditoria'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-900'}"
					onclick={() => handleTabChange('auditoria')}
					>
						Proyectos en auditoría
					</button>
				{:else}
					<button
						class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-black/5 focus:outline-none {activeTab ===
						'mis-proyectos'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-900'}"
						onclick={() => handleTabChange('mis-proyectos')}
					>
						Mis proyectos
					</button>
				{/if}
			</div>
		</div>
	{/if}

	{#if activeTab === 'todos'}
		<div in:fade={{ duration: 200 }}>
			<TodosProyectos
				proyectos={proyectosPublicos}
				{provinciasDisponibles}
				estadosDisponibles={estadosPublicos}
				{categoriasDisponibles}
				{tiposParticipacionDisponibles}
				oncambiarTab={handleTabChange}
			/>
		</div>
	{:else if activeTab === 'auditoria' && esAdministrador}
		<div in:fade={{ duration: 200 }}>
			<TodosProyectos proyectos={proyectosEnAuditoria} oncambiarTab={handleTabChange} />
		</div>
	{:else if activeTab === 'mis-proyectos' && $usuario && !esAdministrador}
		<div in:fade={{ duration: 200 }}>
			<MisProyectos
				usuario={$usuario}
				{proyectos}
				{provinciasDisponibles}
				{estadosDisponibles}
				{categoriasDisponibles}
				{tiposParticipacionDisponibles}
			/>
		</div>
	{/if}
</section>
