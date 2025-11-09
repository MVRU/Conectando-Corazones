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

<div class="group space-y-2">
	<label
		for={id}
		class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-[rgb(var(--color-primary))]"
	>
		<span>{label}</span>
		{#if required}
			<span class="text-base font-semibold leading-none text-red-500" aria-hidden="true">*</span>
		{/if}
	</label>
	<Input {id} {name} bind:value {type} {placeholder} {autocomplete} {error} {required} {disabled} />
</div>
