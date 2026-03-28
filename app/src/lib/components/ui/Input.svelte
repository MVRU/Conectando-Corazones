<script lang="ts">
	import { clsx } from 'clsx';
	import type { ComponentType } from 'svelte';

	interface Props {
		id?: string;
		name?: string;
		type?: string;
		required?: boolean;
		value?: string;
		placeholder?: string;
		error?: string;
		customClass?: string;
		maskCuil?: boolean;
		inputRef?: HTMLInputElement | null;
		prefixIcon?: ComponentType | null;
		prefixIconClass?: string;
		suffix?: import('svelte').Snippet;
		oninput?: (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
		onblur?: (e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) => void;
		onfocus?: (e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) => void;
		onkeydown?: (e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => void;
		onchange?: (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
		[key: string]: unknown;
	}

	let {
		id = '',
		name = '',
		type = 'text',
		required = false,
		value = $bindable(''),
		placeholder = '',
		error = undefined,
		customClass = '',
		maskCuil = false,
		inputRef = $bindable(null),
		prefixIcon = null,
		prefixIconClass = '',
		suffix,
		oninput,
		onblur,
		onfocus,
		onchange,
		onkeydown,
		...rest
	}: Props = $props();

	function formatCuil(val: string) {
		const digits = val.replace(/\D/g, '').slice(0, 11);
		if (digits.length <= 2) return digits;
		if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
		return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
	}

	let internalValue = $derived(maskCuil ? formatCuil(value) : value);

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let val = e.currentTarget.value;
		if (maskCuil) {
			val = val.replace(/\D/g, '').slice(0, 11);
			value = val;
		} else {
			value = val;
		}
		oninput?.(e);
	}
</script>

<div class="space-y-2">
	<div class={clsx('relative', prefixIcon && 'group/prefix-input')}>
		{#if prefixIcon}
			{@const PrefixIcon = prefixIcon}
			<span
				class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within/prefix-input:text-sky-600"
				aria-hidden="true"
			>
				<PrefixIcon class={clsx('h-5 w-5', prefixIconClass)} stroke-width={1.7} />
			</span>
		{/if}
		<input
			bind:this={inputRef}
			{id}
			{name}
			value={internalValue}
			oninput={handleInput}
			{onblur}
			{onfocus}
			{onchange}
			{onkeydown}
			{type}
			{required}
			{placeholder}
			{...rest}
			class={clsx(
				'w-full rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 text-[15px] text-slate-900 shadow-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-slate-400',
				'focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgba(var(--color-primary),0.45)] focus:ring-offset-1 focus:ring-offset-white focus:outline-none',
				error &&
					'border-red-400 bg-red-50/80 text-red-900 placeholder:text-red-400 focus:border-red-500 focus:ring-red-300 focus:ring-offset-0',
				'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 disabled:opacity-80 disabled:shadow-none',
				prefixIcon && 'pl-12',
				suffix && 'pr-12',
				customClass
			)}
			aria-describedby={error ? `${id}-error` : undefined}
		/>
		{#if suffix}
			<span class="pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2">
				{@render suffix()}
			</span>
		{/if}
	</div>

	{#if error}
		<p id="{id}-error" role="alert" class="text-sm text-red-600">{error}</p>
	{/if}
</div>
