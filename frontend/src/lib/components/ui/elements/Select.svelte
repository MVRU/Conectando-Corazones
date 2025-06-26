<!--
* Componente: Select
	-*- Descripción: Dropdown/Select reutilizable con estilos consistentes del sistema
	-*- Funcionalidad: Selección de opciones con validación, estados de error y accesibilidad

* Props:
	-*- options (array): Array de objetos con {value, label} para las opciones
	-*- value (string): Valor seleccionado actualmente
	-*- placeholder (string): Texto placeholder cuando no hay selección
	-*- label (string): Etiqueta del campo
	-*- required (boolean): Si el campo es requerido
	-*- disabled (boolean): Si el campo está deshabilitado
	-*- error (string): Mensaje de error a mostrar
	-*- size (string): Tamaño del select ('sm', 'md', 'lg')
	-*- name (string): Nombre del campo para formularios
	-*- id (string): ID del campo para accesibilidad

TODO:
	- [ ] Agregar soporte para grupos de opciones
	- [ ] Implementar búsqueda/filtrado en opciones largas
	- [ ] Agregar soporte para múltiples selecciones
	- [ ] Implementar teclado navigation
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { clsx } from 'clsx';

	// Props del componente
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

	// Estado interno
	let isOpen = false;
	let selectRef: HTMLElement;
	let optionsRef: HTMLElement;

	// Event dispatcher para comunicación con el padre
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

	// Obtener la etiqueta del valor seleccionado
	$: selectedOption = options.find(opt => opt.value === value);
	$: displayValue = selectedOption ? selectedOption.label : placeholder;

	// Función para manejar la selección
	function handleSelect(option: { value: string; label: string }) {
		value = option.value;
		isOpen = false;
		dispatch('change', option);
	}

	// Función para manejar el click fuera del select
	function handleClickOutside(event: MouseEvent) {
		if (selectRef && !selectRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// Función para manejar el teclado
	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				isOpen = !isOpen;
				break;
			case 'Escape':
				isOpen = false;
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					isOpen = true;
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					isOpen = true;
				}
				break;
		}
	}

	// Función para manejar el focus
	function handleFocus() {
		if (!disabled) {
			dispatch('focus');
		}
	}

	// Función para manejar el blur
	function handleBlur() {
		dispatch('blur');
	}

	// Lifecycle
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="w-full">
	<!-- Label -->
	{#if label}
		<label
			for={id}
			class={clsx(
				'mb-2 block font-medium text-[rgb(var(--base-color))]',
				labelSizeClasses[size],
				required && 'after:ml-1 after:text-red-500 after:content-["*"]'
			)}
		>
			{label}
		</label>
	{/if}

	<!-- Select Container -->
	<div class="relative" bind:this={selectRef}>
		<!-- Select Button -->
		<button
			type="button"
			{id}
			{name}
			{disabled}
			class={clsx(
				'w-full rounded-lg border bg-white text-left transition-all duration-200 focus:outline-none focus:ring-2',
				sizeClasses[size],
				'border-gray-300 focus:border-transparent focus:ring-[rgb(var(--color-primary))]',
				disabled && 'cursor-not-allowed bg-gray-50 text-gray-500',
				error && 'border-red-300 focus:ring-red-500',
				!disabled && 'hover:border-gray-400'
			)}
			on:click={() => !disabled && (isOpen = !isOpen)}
			on:keydown={handleKeydown}
			on:focus={handleFocus}
			on:blur={handleBlur}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			aria-labelledby={label ? id : undefined}
		>
			<span
				class={clsx(
					'block truncate',
					!selectedOption && 'text-gray-500'
				)}
			>
				{displayValue}
			</span>
			
			<!-- Arrow Icon -->
			<span
				class={clsx(
					'pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 transition-transform duration-200',
					isOpen && 'rotate-180'
				)}
			>
				<svg
					class="h-4 w-4 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</span>
		</button>

		<!-- Error Message -->
		{#if error}
			<p class="mt-1 text-sm text-red-600">{error}</p>
		{/if}

		<!-- Dropdown Options -->
		{#if isOpen}
			<div
				bind:this={optionsRef}
				class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg"
				role="listbox"
			>
				{#each options as option, index}
					<button
						type="button"
						class={clsx(
							'w-full px-4 py-2 text-left transition-colors duration-150 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none',
							option.value === value && 'bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))]'
						)}
						on:click={() => handleSelect(option)}
						role="option"
						aria-selected={option.value === value}
					>
						{option.label}
					</button>
				{/each}
				
				{#if options.length === 0}
					<div class="px-4 py-2 text-sm text-gray-500">
						No hay opciones disponibles
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Animación para el dropdown */
	div[role="listbox"] {
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
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