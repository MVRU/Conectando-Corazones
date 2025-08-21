<!--
* Componente: DatePicker para formularios
        -*- Descripción: selector de fecha avanzado con validación.
        -*- Soporta límites de fecha min/max.
-->
<script lang="ts">
	export let id = '';
	export let name = '';
	export let required = false;
	export let value = '';
	export let error: string | undefined = undefined;
	export let placeholder = '';
	export let min: string | undefined = undefined;
	export let max: string | undefined = undefined;
	export let customClass = '';

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
	}
</script>

<div class="space-y-1">
	<input
		{id}
		{name}
		type="date"
		bind:value
		on:input={handleInput}
		{min}
		{max}
		{required}
		{placeholder}
		class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] {error
			? 'border-red-500 ring-red-500 focus:ring-red-500'
			: ''} {customClass}"
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : undefined}
	/>

	{#if error}
		<p id="{id}-error" role="alert" class="text-sm text-red-600">{error}</p>
	{/if}
</div>
