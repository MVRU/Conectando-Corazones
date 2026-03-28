<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';
	import { Calendar } from 'lucide-svelte';

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
		prefixIcon = Calendar,
		prefixIconClass = '',
		onchange
	}: Props = $props();

	// Valor visual en formato DD/MM/YYYY
	let displayValue = $state('');
	// Referencia al input nativo oculto para abrir el picker
	let dateInputRef = $state<HTMLInputElement | null>(null);
	
	// Bandera para saber si el efecto viene de una actualización de 'value' o 'displayValue'
	let ignoreEffect = false;

	// Sincronizar desde 'value' (Date) hacia 'displayValue' (string DD/MM/YYYY)
	$effect(() => {
		if (ignoreEffect) {
			ignoreEffect = false;
			return;
		}

		if (value && !Number.isNaN(value.getTime())) {
			const day = String(value.getDate()).padStart(2, '0');
			const month = String(value.getMonth() + 1).padStart(2, '0');
			const year = value.getFullYear();
			const formatted = `${day}/${month}/${year}`;
			
			if (displayValue !== formatted) {
				displayValue = formatted;
			}
		} else if (value === null && displayValue !== '' && displayValue.length === 10) {
			displayValue = '';
		}
	});

	function isValidDate(d: number, m: number, y: number) {
		const date = new Date(y, m - 1, d);
		const now = new Date();
		// Set hours to 0 to compare only dates
		now.setHours(0, 0, 0, 0);

		return (
			date.getFullYear() === y &&
			date.getMonth() === m - 1 &&
			date.getDate() === d &&
			date.getTime() <= now.getTime() && // No permitir fechas futuras
			y > 1900 // Año razonable
		);
	}

	// Formatear/Mascara mientras el usuario escribe
	function handleTextInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let input = e.currentTarget.value;
		
		// Solo permitir números
		let digits = input.replace(/\D/g, '').slice(0, 8);
		
		// Lógica de formateo DD/MM/YYYY
		let formatted = '';
		if (digits.length > 0) {
			// Día (máx 31, pero validamos real después)
			let dayStr = digits.slice(0, 2);
			formatted = dayStr;
			
			if (digits.length > 2) {
				// Mes (máx 12)
				let monthStr = digits.slice(2, 4);
				formatted += '/' + monthStr;
				
				if (digits.length > 4) {
					// Año
					let yearStr = digits.slice(4, 8);
					formatted += '/' + yearStr;
				}
			}
		}

		displayValue = formatted;

		// Intentar convertir a Date si está completo (8 dígitos)
		if (digits.length === 8) {
			const d = parseInt(digits.slice(0, 2), 10);
			const m = parseInt(digits.slice(2, 4), 10);
			const y = parseInt(digits.slice(4, 8), 10);
			
			if (isValidDate(d, m, y)) {
				ignoreEffect = true;
				const validDate = new Date(y, m - 1, d);
				value = validDate;
				onchange?.(e);
			} else {
				ignoreEffect = true;
				value = null;
			}
		} else if (digits.length === 0) {
			ignoreEffect = true;
			value = null;
			onchange?.(e);
		} else {
			ignoreEffect = true;
			value = null;
		}
	}

	// Manejar cambio desde el picker nativo (input type="date")
	function handleNativeChange(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		const val = e.currentTarget.value; // YYYY-MM-DD
		if (val) {
			const [y, m, d] = val.split('-').map(Number);
			const date = new Date(y, m - 1, d);
			if (!Number.isNaN(date.getTime())) {
				value = date;
				onchange?.(e);
			}
		}
	}

	function openDatePicker() {
		if (dateInputRef) {
			if ('showPicker' in HTMLInputElement.prototype) {
				try {
					dateInputRef.showPicker();
				} catch (err) {
					dateInputRef.click();
				}
			} else {
				dateInputRef.click();
			}
		}
	}

	// Formato ISO para el input nativo oculto
	let isoValue = $derived.by(() => {
		if (!value || Number.isNaN(value.getTime())) return '';
		const y = value.getFullYear();
		const m = String(value.getMonth() + 1).padStart(2, '0');
		const d = String(value.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	});
</script>

{#snippet suffixSnippet()}
	<button
		type="button"
		class="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
		onclick={openDatePicker}
		aria-label="Abrir calendario"
	>
		<Calendar class="h-5 w-5" strokeWidth={1.8} />
	</button>
{/snippet}

<div class="relative w-full">
	<Input
		{id}
		{name}
		type="text"
		placeholder="dd/mm/aaaa"
		bind:value={displayValue}
		oninput={handleTextInput}
		{required}
		{error}
		prefixIcon={prefixIcon}
		prefixIconClass={prefixIconClass}
		customClass="pr-12"
		suffix={suffixSnippet}
	/>

	<input
		bind:this={dateInputRef}
		type="date"
		class="pointer-events-none absolute inset-0 -z-10 opacity-0"
		value={isoValue}
		onchange={handleNativeChange}
		tabindex="-1"
		aria-hidden="true"
	/>
</div>

<style>
	input[type='date']::-webkit-calendar-picker-indicator {
		display: none;
	}
</style>
