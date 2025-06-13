<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';

	export let proyecto;
	export let mostrarFormulario;
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">¿Querés colaborar?</h3>

	{#if proyecto.unidad === 'dinero'}
		<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
			<p class="text-sm text-blue-700">
				💰 Este proyecto necesita <strong>donaciones monetarias</strong>.
			</p>
		</div>
	{:else if proyecto.unidad === 'materiales'}
		<div class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
			<p class="text-sm text-green-700">
				📦 Este proyecto necesita <strong>donaciones específicas</strong>.
			</p>
		</div>
	{:else if proyecto.unidad === 'voluntarios'}
		<div class="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
			<p class="text-sm text-purple-700">
				🙋‍♀️ Este proyecto necesita <strong>voluntariado</strong>.
			</p>
		</div>
	{/if}

	{#if proyecto.estado === 'Activo'}
		<button
			on:click={mostrarFormulario}
			class="mb-3 w-full rounded-lg bg-[rgb(var(--color-primary))] px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-[rgb(var(--color-primary-hover))]"
		>
			{#if proyecto.unidad === 'dinero'}
				Enviar donación
			{:else if proyecto.unidad === 'materiales'}
				Donar materiales
			{:else if proyecto.unidad === 'voluntarios'}
				Postularme como voluntario
			{:else}
				Colaborar
			{/if}
		</button>
	{:else}
		<div class="rounded-lg bg-gray-100 py-4 text-center">
			<p class="text-gray-600">Este proyecto ya no está activo</p>
		</div>
	{/if}

	<Button label="Compartir proyecto" href="#" disabled={false} />
</div>
