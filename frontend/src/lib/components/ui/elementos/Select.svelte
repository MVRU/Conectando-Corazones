<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clsx } from 'clsx';
	import { onMount, onDestroy } from 'svelte';

	export let options: Array<{ value: string; label: string }> = [];
	export let value: string = '';
	export let placeholder: string = 'Seleccionar opción';
	export let label: string = '';
	export let required = false;
	export let disabled = false;
	export let error: string = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let name: string = '';
	export let id: string = '';
	export let searchable = true;
	export let ariaDescribedBy: string | undefined = undefined;

	let isOpen = false;
	let selectRef: HTMLElement;
	let inputRef: HTMLInputElement;
	let searchValue = '';
	let isTyping = false;

	const dispatch = createEventDispatcher<{
		change: { value: string; label: string };
		focus: void;
		blur: void;
	}>();

	// Mapeo de tamaños
	const sizeClasses = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-4 py-3 text-base',
		lg: 'px-4 py-4 text-lg'
	};

	const labelSizeClasses = {
		sm: 'text-sm',
		md: 'text-sm',
		lg: 'text-base'
	};

	$: selectedOption = options.find((opt) => opt.value === value);

	$: filteredOptions = (() => {
		if (!isOpen) return [];

		if (!searchable) return options;

		if (!searchValue.trim() || searchValue === placeholder) {
			return options;
		}

		return options.filter((option) =>
			option.label.toLowerCase().includes(searchValue.toLowerCase())
		);
	})();

	$: if (!isTyping) {
		searchValue = selectedOption ? selectedOption.label : '';
	}

	function handleSelect(option: { value: string; label: string }) {
		value = option.value;
		searchValue = selectedOption?.label || '';
		isTyping = false;
		isOpen = false;
		dispatch('change', option);
	}

	function handleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		searchValue = value;
		isTyping = true;
		if (!isOpen) isOpen = true;
	}

	function handleClickOutside(event: MouseEvent) {
		if (selectRef && !selectRef.contains(event.target as Node)) {
			isOpen = false;
			isTyping = false;
			searchValue = selectedOption ? selectedOption.label : '';
		}
	}

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
		if (!isOpen) {
			isTyping = false;
			searchValue = selectedOption ? selectedOption.label : '';
		} else {
			isTyping = searchable;
			searchValue = searchable ? '' : selectedOption ? selectedOption.label : '';
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				toggleDropdown();
				break;
			case 'Escape':
				isOpen = false;
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) isOpen = true;
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) isOpen = true;
				break;
		}
	}

	function handleFocus() {
		if (!disabled) {
			isTyping = true;
			dispatch('focus');
		}
	}

	function handleBlur() {
		isTyping = false;
		dispatch('blur');
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="group w-full space-y-2">
	{#if label}
		<label
			for={id}
			class={clsx(
				'inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-[rgb(var(--color-primary))]',
				labelSizeClasses[size],
				required &&
					'after:ml-1 after:text-base after:font-semibold after:text-red-500 after:content-["*"]'
			)}
		>
			{label}
		</label>
	{/if}

	<div class="relative" bind:this={selectRef}>
		<input
			type="text"
			bind:this={inputRef}
			bind:value={searchValue}
			on:input={handleInput}
			on:keydown={handleKeydown}
			on:focus={handleFocus}
			on:blur={handleBlur}
			{disabled}
			{id}
			{name}
			{placeholder}
			class={clsx(
				'w-full rounded-2xl border border-slate-200/80 bg-white/95 pr-12 text-left text-[15px] text-slate-900 shadow-sm ring-1 ring-transparent transition-all duration-200 placeholder:text-slate-400',
				sizeClasses[size],
				'focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgba(var(--color-primary),0.45)] focus:ring-offset-1 focus:ring-offset-white focus:outline-none',
				error
					? 'border-red-400 bg-red-50/80 text-red-900 placeholder:text-red-400 focus:ring-red-300 focus:ring-offset-0'
					: 'hover:border-slate-300',
				disabled &&
					'cursor-not-allowed bg-slate-100 text-slate-500 opacity-80 placeholder:text-slate-400'
			)}
			readonly={!searchable || !isTyping}
			role="combobox"
			aria-controls="select-options"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-labelledby={label ? id : undefined}
			aria-describedby={ariaDescribedBy}
		/>

		<button
			type="button"
			class={clsx(
				'absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full p-1',
				'text-slate-400 transition-colors duration-200 group-focus-within:text-[rgb(var(--color-primary))] hover:text-slate-600'
			)}
			aria-label="Toggle dropdown"
			on:click={toggleDropdown}
			on:keydown={handleKeydown}
			{disabled}
		>
			<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		{#if isOpen}
			<div
				class="absolute z-50 mt-2 max-h-60 w-full overflow-hidden rounded-2xl border border-slate-100/80 bg-white/95 shadow-2xl ring-1 ring-black/5"
			>
				<div class="max-h-52 overflow-auto overscroll-contain">
					{#each filteredOptions as option (option.value)}
						<button
							type="button"
							class={clsx(
								'group w-full px-4 py-2 text-left text-sm transition-colors duration-150',
								option.value === value
									? 'bg-[rgb(var(--color-primary))] text-white'
									: 'text-slate-600 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none'
							)}
							on:click={() => handleSelect(option)}
							role="option"
							aria-selected={option.value === value}
						>
							{option.label}
						</button>
					{/each}

					{#if filteredOptions.length === 0}
						<div class="px-4 py-2 text-sm text-gray-500">No se encontraron resultados</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Mensaje de error -->
{#if error}
	<p class="mt-1 px-1 text-sm text-red-600">{error}</p>
{/if}

<style>
	@keyframes fadeSlideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
