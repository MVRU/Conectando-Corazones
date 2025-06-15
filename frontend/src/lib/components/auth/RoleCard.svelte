<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clsx } from 'clsx';

	export let selected: boolean = false;
	export let icon: 'institution' | 'collaborator' | 'user' = 'user';
	export let title: string = '';
	export let description: string = '';

	const dispatch = createEventDispatcher();
</script>

<button
	type="button"
	aria-pressed={selected}
	on:click={() => dispatch('select')}
	class={clsx(
		'group flex flex-col items-start rounded-2xl border bg-white p-6 shadow-md transition-all duration-300',
		'hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--base-color))]',
		selected ? 'bg-blue-50/20 shadow-xl ring-2 ring-[rgb(var(--base-color))]' : 'border-gray-200'
	)}
>
	<div
		class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[rgb(var(--base-color))]"
	>
		{#if icon === 'institution'}
			<!-- Edificio -->
			<svg
				class="mx-auto h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 10l9-7 9 7" />
				<path d="M9 22V12h6v10" />
				<path d="M2 22h20" />
			</svg>
		{:else if icon === 'collaborator'}
			<!-- Usuario -->
			<svg
				class="mx-auto h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="7" r="4" />
				<path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
			</svg>
		{:else}
			<!-- Dos personas -->
			<svg
				class="h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="9" cy="7" r="4" />
				<circle cx="17" cy="7" r="4" />
				<path d="M17 20h5v-2a4 4 0 00-5-4" />
				<path d="M7 20H2v-2a4 4 0 015-4" />
			</svg>
		{/if}
	</div>

	<div class="space-y-1 text-left">
		<h3 class="text-center text-base font-semibold text-gray-800">{title}</h3>
		<p class="text-center text-sm text-gray-600">{description}</p>
	</div>
</button>
