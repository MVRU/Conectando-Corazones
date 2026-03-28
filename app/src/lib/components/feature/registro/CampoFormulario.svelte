<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';
	import { Loader2 } from 'lucide-svelte';

	interface Props {
		id: string;
		label: string;
		value?: string;
		placeholder?: string;
		type?: string;
		autocomplete?: string;
		required?: boolean;
		error?: string;
		disabled?: boolean;
		name?: string;
		icon?: ComponentType | null;
		iconClass?: string;
		cargando?: boolean;
		suffix?: import('svelte').Snippet;
		onblur?: (e: FocusEvent) => void;
		onfocus?: (e: FocusEvent) => void;
		oninput?: (e: Event) => void;
		onchange?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
		[key: string]: unknown;
	}

	let {
		id,
		label,
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		autocomplete,
		required = false,
		error = '',
		disabled = false,
		name,
		icon = null,
		iconClass = '',
		cargando = false,
		suffix,
		onblur,
		onfocus,
		oninput,
		onchange,
		onkeydown,
		...rest
	}: Props = $props();
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
		{suffix}
		{onblur}
		{onfocus}
		{oninput}
		{onchange}
		{onkeydown}
		{...rest}
	/>
</div>
