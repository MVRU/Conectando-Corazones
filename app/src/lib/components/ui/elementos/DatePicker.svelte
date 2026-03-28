<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';

	interface Props {
		id?: string;
		name?: string;
		required?: boolean;
		value?: Date | null;
		error?: string;
		prefixIcon?: ComponentType | null;
		prefixIconClass?: string;
		onchange?: (e: Event) => void;
	}

	let {
		id = '',
		name = '',
		required = false,
		value = $bindable(null),
		error = '',
		prefixIcon = null,
		prefixIconClass = '',
		onchange
	}: Props = $props();

	let internal = $state('');

	$effect.pre(() => {
		if (value) {
			const year = value.getFullYear();
			const month = String(value.getMonth() + 1).padStart(2, '0');
			const day = String(value.getDate()).padStart(2, '0');
			internal = `${year}-${month}-${day}`;
		} else {
			internal = '';
		}
	});

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const val = e.currentTarget.value;
		if (!val) {
			value = null;
		} else {
			const fecha = new Date(`${val}T00:00:00`);
			if (!Number.isNaN(fecha.getTime())) {
				value = fecha;
			} else {
				value = null;
			}
		}
		onchange?.(e);
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
	oninput={handleInput}
	onchange={handleInput}
/>
