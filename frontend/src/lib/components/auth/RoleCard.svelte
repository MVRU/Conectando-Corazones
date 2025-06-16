<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clsx } from 'clsx';
	import Button from '$lib/components/ui/Button.svelte';

	export let selected: boolean = false;
	export let icon: 'institution' | 'collaborator' | 'user' = 'user';
	export let title: string = '';
	export let description: string = '';
	export let onSelect: () => void;

	const dispatch = createEventDispatcher();
</script>

<div
	role="button"
	tabindex="0"
	aria-pressed={selected}
	on:click={onSelect}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onSelect();
		}
	}}
	class={clsx(
		'group flex flex-col items-start rounded-2xl border bg-white p-6 transition-all duration-300 hover:scale-105',
		'hover:border-blue-500 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
		selected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 ',
		'aspect-w-1 aspect-h-1 w-full'
	)}
>
	<div
		class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#00A9FF]"
	>
		{#if icon === 'institution'}
			<!-- ! Icono para Institución -->
			<!-- TODO: conseguir un icono mejor -->
			<svg
				class="mx-auto h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 2l9 7-9 7-9-7z" />
				<path d="M4 15h16v7H4z" />
			</svg>
		{:else}
			<!-- ! Icono para Colaborador -->
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
		{/if}
	</div>

	<div class="space-y-1 text-left">
		<h3 class="text-center text-base font-semibold text-gray-800">{title}</h3>
		<p class="mb-4 text-center text-sm text-gray-600">{description}</p>
	</div>
	<!-- ! Botón CTA (Call to Action) -->
	<Button
		customClass="mt-4 w-full"
		variant="secondary"
		label="Seleccionar"
		size="sm"
		on:click={onSelect}
	></Button>
</div>
