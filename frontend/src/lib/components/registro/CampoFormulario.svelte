<!-- * DECISIÓN DE DISEÑO: se encapsula la estructura repetitiva de campos de texto para aplicar bindings seguros con Input y mantener consistencia de estilos y accesibilidad -->

<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';

	export let id: string;
	export let label: string;
	export let value: string = '';
	export let placeholder = '';
	export let type: string = 'text';
	export let autocomplete: string | undefined = undefined;
	export let required = false;
	export let error: string = '';
	export let disabled = false;
	export let name: string | undefined = undefined;
</script>

<div>
	<label for={id} class="font-semibold text-gray-800">
		{label}
		{#if required}
			<span class="text-red-600">*</span>
		{/if}
	</label>
	<Input {id} {name} bind:value {type} {placeholder} {autocomplete} {error} {required} {disabled} />
</div>
