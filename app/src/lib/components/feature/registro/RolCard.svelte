<script lang="ts">
	import { clsx } from 'clsx';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let seleccionado: boolean = false;
	export let icono: 'institucion' | 'colaborador' | 'usuario' = 'usuario';
	export let titulo: string = '';
	export let descripcion: string = '';
	export let onSelect: () => void;
</script>

<div
	role="button"
	tabindex="0"
	aria-pressed={seleccionado}
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
		seleccionado ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 ',
		'aspect-w-1 aspect-h-1 w-full'
	)}
>
	<div
		class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#00A9FF]"
	>
		{#if icono === 'institucion'}
			<!-- ! Icono para Institución -->
			<svg
				width="64px"
				height="64px"
				viewBox="-512 -512 2048.00 2048.00"
				class="icon"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				fill="#000000"
				><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g><g id="SVGRepo_iconCarrier"
					><path
						d="M981.4 502.3c-9.1 0-18.3-2.9-26-8.9L539 171.7c-15.3-11.8-36.7-11.8-52 0L70.7 493.4c-18.6 14.4-45.4 10.9-59.7-7.7-14.4-18.6-11-45.4 7.7-59.7L435 104.3c46-35.5 110.2-35.5 156.1 0L1007.5 426c18.6 14.4 22 41.1 7.7 59.7-8.5 10.9-21.1 16.6-33.8 16.6z"
						fill="#5F6379"
					></path><path
						d="M810.4 981.3H215.7c-70.8 0-128.4-57.6-128.4-128.4V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c0 23.8 19.4 43.2 43.2 43.2h594.8c23.8 0 43.2-19.4 43.2-43.2V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c-0.1 70.8-57.7 128.4-128.5 128.4z"
						fill="#007fff"
					></path></g
				></svg
			>
		{:else}
			<!-- ! Icono para Colaborador -->
			<svg
				width="64px"
				height="64px"
				viewBox="-512 -512 2048.00 2048.00"
				class="icon"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				fill="#000000"
				stroke="#000000"
				stroke-width="0.01024"
				><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke="#CCCCCC"
					stroke-width="38.912"
				></g><g id="SVGRepo_iconCarrier"
					><path
						d="M388.9 597.4c-135.2 0-245.3-110-245.3-245.3s110-245.3 245.3-245.3 245.3 110 245.3 245.3-110.1 245.3-245.3 245.3z m0-405.3c-88.2 0-160 71.8-160 160s71.8 160 160 160 160-71.8 160-160-71.8-160-160-160z"
						fill="#3688FF"
					></path><path
						d="M591.3 981.3H186.5c-76.6 0-138.8-62.3-138.8-138.8V749c0-130.6 106.2-236.9 236.9-236.9h208.8c130.6 0 236.9 106.3 236.9 236.9v93.5c-0.2 76.5-62.4 138.8-139 138.8zM284.5 597.4c-83.6 0-151.5 68-151.5 151.5v93.5c0 29.5 24 53.5 53.5 53.5h404.8c29.5 0 53.5-24 53.5-53.5v-93.5c0-83.6-68-151.5-151.6-151.5H284.5z"
						fill="#3688FF"
					></path><path
						d="M847.2 938.6c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c29.5 0 53.5-24 53.5-53.5v-93.5c0-83.6-68-151.5-151.6-151.5h-14.3c-19.8 0-37-13.6-41.5-32.9-4.5-19.3 4.8-39.1 22.5-48 54.8-27.3 88.9-82.1 88.9-143.1 0-88.2-71.8-160-160-160-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7c135.2 0 245.3 110 245.3 245.3 0 57.8-19.9 111.9-54.9 154.8 88.3 34.6 151 120.6 151 220.9v93.5c0 76.6-62.3 138.8-138.9 138.8z"
						fill="#5F6379"
					></path></g
				></svg
			>
		{/if}
	</div>

	<div class="space-y-1 text-left">
		<h3 class="text-center text-base font-semibold text-gray-800">{titulo}</h3>
		<p class="mb-4 text-center text-sm text-gray-600">{descripcion}</p>
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

