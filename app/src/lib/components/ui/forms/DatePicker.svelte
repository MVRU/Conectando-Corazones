<!--
* Componente: DatePicker para formularios
	-*- Descripción: selector de fecha avanzado con validación.
	-*- Soporta límites de fecha min/max.
-->
<script lang="ts">
	let {
		id = '',
		name = '',
		required = false,
		value = $bindable(''),
		error = undefined as string | undefined,
		placeholder = '',
		min = undefined as string | undefined,
		max = undefined as string | undefined,
		customClass = ''
	} = $props<{
		id?: string;
		name?: string;
		required?: boolean;
		value?: string;
		error?: string;
		placeholder?: string;
		min?: string;
		max?: string;
		customClass?: string;
	}>();

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
		oninput={handleInput}
		{min}
		{max}
		{required}
		{placeholder}
		class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:outline-none {error
			? 'border-red-500 ring-red-500 focus:ring-red-500'
			: ''} {customClass}"
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : undefined}
	/>

	{#if error}
		<p id="{id}-error" role="alert" class="text-sm text-red-600">{error}</p>
	{/if}
</div>
