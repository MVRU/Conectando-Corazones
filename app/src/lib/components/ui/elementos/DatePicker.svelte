<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';

	export let id = '';
	export let name = '';
	export let required = false;
	export let value: Date | null = null;
	export let error = '';
	export let prefixIcon: ComponentType | null = null;
	export let prefixIconClass = '';

	let internal = '';
	let ultimaCadenaProcesada: string | null = null;

	function formatForInput(d: Date | null): string {
		if (!d) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function actualizarValorDesdeCadena(cadena: string): Date | null {
		if (!cadena) {
			value = null;
			return null;
		}

		const fecha = new Date(`${cadena}T00:00:00`);
		if (Number.isNaN(fecha.getTime())) {
			value = null;
			return null;
		}

		value = fecha;
		return fecha;
	}

	$: internal = formatForInput(value);

	$: if (internal !== ultimaCadenaProcesada) {
		ultimaCadenaProcesada = internal;
		actualizarValorDesdeCadena(internal);
	}

	function handleEntrada(e: Event) {
		actualizarValorDesdeCadena((e.target as HTMLInputElement).value);
	}
</script>

<Input
	{id}
	{name}
	type="date"
	bind:value={internal}
	{required}
	{error}
	{prefixIcon}
	{prefixIconClass}
	on:input={handleEntrada}
	on:change={handleEntrada}
/>
