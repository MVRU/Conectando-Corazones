<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	export let id = '';
	export let name = '';
	export let required = false;
	export let value: Date | null = null;
	export let error = '';

	let internal = '';

	// Formatea Date -> "YYYY-MM-DD"
	function formatForInput(d: Date | null): string {
		if (!d) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// sincroniza cambios del padre -> input
	$: internal = formatForInput(value);

	// convierte cambios del input -> Date
	function onChange(e: Event) {
		const v = (e.target as HTMLInputElement).value;
		value = v ? new Date(v + 'T00:00:00') : null;
	}
</script>

<Input {id} {name} type="date" bind:value={internal} {required} {error} on:change={onChange} />
