<script lang="ts">
	import { clsx } from 'clsx';

	export let id = '';
	export let name = '';
	export let type: string = 'text';
	export let required = false;
	export let value = '';
	export let placeholder = '';
	export let error: string | undefined = undefined;
	export let customClass = '';
	export let maskCuil = false;

	function formatCuil(val: string) {
		const digits = val.replace(/\D/g, '').slice(0, 11);
		if (digits.length <= 2) return digits;
		if (digits.length <= 10) return `${digits.slice(0,2)}-${digits.slice(2)}`;
		return `${digits.slice(0,2)}-${digits.slice(2,10)}-${digits.slice(10)}`;
	}

	let internalValue = value;

	$: if (maskCuil) {
		internalValue = formatCuil(value);
	}

	function handleInput(e: Event) {
		let val = (e.target as HTMLInputElement).value;
		if (maskCuil) {
			val = val.replace(/\D/g, '').slice(0, 11);
			internalValue = formatCuil(val);
			// dispatch('input', val); // solo números
			value = val;
		} else {
			value = val;
		}
	}
</script>

<div class="space-y-1">
	<input
		{id}
		{name}
		value={maskCuil ? internalValue : value}
		on:input={handleInput}
		{type}
		class={clsx(
			'w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200',
			'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]',
			error && 'border-red-400 ring-red-400 focus:ring-red-400',
			customClass
		)}
		{required}
		{placeholder}
		aria-invalid={error ? 'true' : 'false'}
		aria-describedby={error ? `${id}-error` : undefined}
	/>

	{#if error}
		<p id="{id}-error" role="alert" class="text-sm text-red-600">{error}</p>
	{/if}
</div>
