<script lang="ts">
	import type { Proyecto } from '$lib/domain/types/Proyecto';
	import TodosProyectos from './TodosProyectos.svelte';
	import MisProyectos from './MisProyectos.svelte';
	import { usuario } from '$lib/stores/auth';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	export let proyectos: Proyecto[] = defaultProyectos;
	export let provinciasDisponibles: string[] = [];

	let activeTab: 'todos' | 'mis-proyectos' | 'auditoria' = 'todos';

	$: esAdministrador = $usuario?.rol === 'administrador';

	$: if ($page.url.searchParams.get('tab') === 'mis-proyectos' && $usuario && !esAdministrador) {
		activeTab = 'mis-proyectos';
	} else if ($page.url.searchParams.get('tab') === 'auditoria' && esAdministrador) {
		activeTab = 'auditoria';
	}

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

	$: proyectosEnAuditoria = proyectos.filter((p) => p.estado === 'en_auditoria');
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
					on:click={() => handleTabChange('todos')}
				>
					Todos los proyectos
				</button>
				{#if esAdministrador}
					<button
						class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-black/5 focus:outline-none {activeTab ===
						'auditoria'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-900'}"
						on:click={() => handleTabChange('auditoria')}
					>
						Proyectos en auditoría
					</button>
				{:else}
					<button
						class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-black/5 focus:outline-none {activeTab ===
						'mis-proyectos'
							? 'bg-white text-gray-900 shadow-sm'
							: 'text-gray-500 hover:text-gray-900'}"
						on:click={() => handleTabChange('mis-proyectos')}
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
				{proyectos}
				{provinciasDisponibles}
				on:cambiarTab={(e) => handleTabChange(e.detail)}
			/>
		</div>
	{:else if activeTab === 'auditoria' && esAdministrador}
		<div in:fade={{ duration: 200 }}>
			<TodosProyectos
				proyectos={proyectosEnAuditoria}
				on:cambiarTab={(e) => handleTabChange(e.detail)}
			/>
		</div>
	{:else if activeTab === 'mis-proyectos' && $usuario && !esAdministrador}
		<div in:fade={{ duration: 200 }}>
			<MisProyectos usuario={$usuario} {proyectos} />
		</div>
	{/if}
</section>
