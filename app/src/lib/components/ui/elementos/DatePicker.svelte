<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import type { ComponentType } from 'svelte';
	import { Calendar } from 'lucide-svelte';
	import { validarFechaNacimiento } from '$lib/utils/validaciones';

	interface Props {
		id?: string;
		name?: string;
		required?: boolean;
		value?: Date | null;
		error?: string;
		prefixIcon?: ComponentType | null;
		prefixIconClass?: string;
		onchange?: (e: Event) => void;
		validateBirthdate?: boolean;
	}

	let {
		id = '',
		name = '',
		required = false,
		value = $bindable(null),
		error = '',
		prefixIcon = Calendar,
		prefixIconClass = '',
		onchange,
		validateBirthdate = false
	}: Props = $props();

	let displayValue = $state('');
	let dateInputRef = $state<HTMLInputElement | null>(null);
	let localError = $state('');

	let ignoreEffect = false;

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

	/**
	 * Valida que sea una fecha de calendario válida
	 * No rechaza fechas futuras aquí (se validan en onblur)
	 */
	function isValidDate(d: number, m: number, y: number) {
		const date = new Date(y, m - 1, d);

		return (
			date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d && y > 1900 // Año razonable
		);
	}

	/**
	 * Validación inteligente por segmento (día, mes, año)
	 * Previene valores inválidos mientras el usuario escribe
	 */
	function handleKeyDown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		const key = e.key;
		const input = e.currentTarget;
		const currentDigits = input.value.replace(/\D/g, '');

		// Permitir: Backspace, Delete, flechas, Tab, Enter
		if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(key)) {
			return;
		}

		// Permitir: Ctrl/Cmd + combinaciones (copy, paste, select, cut)
		if (e.ctrlKey || e.metaKey) {
			return;
		}

		// Si es un dígito y ya tenemos 8, bloquear
		if (/\d/.test(key) && currentDigits.length >= 8) {
			e.preventDefault();
			return;
		}

		// Si no es un dígito y no es una tecla especial, bloquear
		if (key.length === 1 && !/\d/.test(key)) {
			e.preventDefault();
			return;
		}

		// Validación por segmento (dd/mm/yyyy)
		if (/\d/.test(key)) {
			const newDigits = currentDigits + key;

			if (newDigits.length <= 2) {
				// Segmento DÍA (dd): 01-31
				const dayStr = newDigits;
				if (dayStr.length === 1 && !/[0-3]/.test(dayStr)) {
					// Primer dígito: debe ser 0-3
					e.preventDefault();
					return;
				}
				if (dayStr.length === 2) {
					const day = parseInt(dayStr, 10);
					if (day < 1 || day > 31) {
						// Día completo: debe ser 01-31
						e.preventDefault();
						return;
					}
				}
			} else if (newDigits.length <= 4) {
				// Segmento MES (mm): 01-12
				const monthStr = newDigits.slice(2, 4);
				if (monthStr.length === 1 && !/[0-1]/.test(monthStr)) {
					// Primer dígito: debe ser 0-1
					e.preventDefault();
					return;
				}
				if (monthStr.length === 2) {
					const month = parseInt(monthStr, 10);
					if (month < 1 || month > 12) {
						// Mes completo: debe ser 01-12
						e.preventDefault();
						return;
					}
				}
			} else if (newDigits.length <= 8) {
				// Segmento AÑO (yyyy): ≤ año actual
				const yearStr = newDigits.slice(4, 8);
				if (yearStr.length === 4) {
					const year = parseInt(yearStr, 10);
					const currentYear = new Date().getFullYear();
					if (year > currentYear) {
						// Año no puede ser mayor al actual
						e.preventDefault();
						return;
					}
				}
			}
		}
	}

	// Formatear/Mascara mientras el usuario escribe
	function handleTextInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		let input = e.currentTarget.value;

		// Extraer solo dígitos y limitar a 8
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

		// Forzar el límite de 10 caracteres (dd/mm/yyyy) - no permitir input adicional
		if (formatted.length > 10) {
			formatted = formatted.slice(0, 10);
		}

		displayValue = formatted;

		// Intentar convertir a Date si está completo (8 dígitos = 10 caracteres)
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

	/**
	 * Maneja el pegado inteligente (paste)
	 * Extrae números, limita a 8 dígitos, y formatea
	 */
	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();

		const pastedText = e.clipboardData?.getData('text') || '';
		// Extraer solo números del texto pegado
		const digits = pastedText.replace(/\D/g, '').slice(0, 8);

		// Formatear como DD/MM/YYYY
		let formatted = '';
		if (digits.length > 0) {
			formatted = digits.slice(0, 2);
			if (digits.length > 2) {
				formatted += '/' + digits.slice(2, 4);
				if (digits.length > 4) {
					formatted += '/' + digits.slice(4, 8);
				}
			}
		}

		displayValue = formatted;

		// Procesar como si fuera input normal
		if (digits.length === 8) {
			const d = parseInt(digits.slice(0, 2), 10);
			const m = parseInt(digits.slice(2, 4), 10);
			const y = parseInt(digits.slice(4, 8), 10);

			if (isValidDate(d, m, y)) {
				ignoreEffect = true;
				const validDate = new Date(y, m - 1, d);
				value = validDate;
				onchange?.(e as unknown as Event);
			} else {
				ignoreEffect = true;
				value = null;
			}
		} else {
			ignoreEffect = true;
			value = null;
		}
	}

	/**
	 * Valida estrictamente al perder el foco (para fecha de nacimiento)
	 */
	function handleBlur() {
		if (!validateBirthdate) return;

		// Si el displayValue está incompleto, lo vaciamos y dejamos que el validador lo maneje
		if (displayValue && displayValue.replace(/\D/g, '').length < 8) {
			localError = 'Fecha inválida';
			return;
		}

		// Si hay valor, validar estrictamente
		if (value) {
			localError = validarFechaNacimiento(value);
		} else if (displayValue === '') {
			localError = '';
		}
	}

	// Error a mostrar: si hay error de form-level (prop), usarlo; sino usar localError (blur validation)
	let displayError = $derived(error || localError);

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
		class="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-sky-600 focus:ring-2 focus:ring-sky-500/20 focus:outline-none"
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
		onkeydown={handleKeyDown}
		onblur={handleBlur}
		onpaste={handlePaste}
		{required}
		error={displayError}
		{prefixIcon}
		{prefixIconClass}
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
