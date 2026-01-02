<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import { mockProyectos as defaultProyectos } from '$lib/mocks/mock-proyectos';
	import TodosProyectos from './TodosProyectos.svelte';
	import MisProyectos from './MisProyectos.svelte';
	import { usuario } from '$lib/stores/auth';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/stores';

	export let proyectos: Proyecto[] = defaultProyectos;

	let activeTab: 'todos' | 'mis-proyectos' = 'todos';

	$: if ($page.url.searchParams.get('tab') === 'mis-proyectos' && $usuario) {
		activeTab = 'mis-proyectos';
	}

	function handleTabChange(tab: 'todos' | 'mis-proyectos') {
		activeTab = tab;
		const url = new URL(window.location.href);
		if (tab === 'mis-proyectos') {
			url.searchParams.set('tab', 'mis-proyectos');
		} else {
			url.searchParams.delete('tab');
		}
		window.history.replaceState({}, '', url);
	}
</script>

<section class="min-h-screen w-full bg-gray-50 pt-8">
	<!-- TABS -->
	{#if $usuario}
		<div class="mb-8 flex justify-center">
			<div class="inline-flex rounded-full bg-gray-100/80 p-1.5 shadow-inner">
				<button
					class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 {activeTab ===
					'todos'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-900'}"
					on:click={() => handleTabChange('todos')}
				>
					Todos los proyectos
				</button>
				<button
					class="relative rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 {activeTab ===
					'mis-proyectos'
						? 'bg-white text-gray-900 shadow-sm'
						: 'text-gray-500 hover:text-gray-900'}"
					on:click={() => handleTabChange('mis-proyectos')}
				>
					Mis proyectos
				</button>
			</div>
		</div>
	{:else}
		<div class="mb-8 flex justify-center px-4">
			<h1 class="text-3xl font-bold text-gray-900">Proyectos Solidarios</h1>
		</div>
	{/if}

	{#if activeTab === 'todos'}
		<div in:fade={{ duration: 200 }}>
			<TodosProyectos {proyectos} on:cambiarTab={(e) => handleTabChange(e.detail)} />
		</div>
	{:else if activeTab === 'mis-proyectos' && $usuario}
		<div in:fade={{ duration: 200 }}>
			<MisProyectos usuario={$usuario} {proyectos} />
		</div>
	{/if}
</section>
