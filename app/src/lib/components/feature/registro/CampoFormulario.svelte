<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';
	import { Loader2 } from 'lucide-svelte';

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
	export let icon: ComponentType | null = null;
	export let iconClass = '';
	export let cargando = false;
</script>

<div class="group space-y-2">
	<label
		for={id}
		class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-[rgb(var(--color-primary))]"
	>
		<div class="flex items-center gap-2">
			<span>{label}</span>
			{#if cargando}
				<Loader2 class="h-3.5 w-3.5 animate-spin text-[rgb(var(--color-primary))]" />
			{/if}
		</div>
		{#if required}
			<span class="text-base leading-none font-semibold text-red-500" aria-hidden="true">*</span>
		{/if}
	</label>
	<Input
		{id}
		{name}
		bind:value
		{type}
		{placeholder}
		{autocomplete}
		{error}
		{required}
		{disabled}
		prefixIcon={icon}
		prefixIconClass={iconClass}
		{...$$restProps}
		on:blur
		on:focus
		on:input
		on:change
		on:keydown
	/>
</div>
