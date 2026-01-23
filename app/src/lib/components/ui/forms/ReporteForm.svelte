<script lang="ts">
	import { MotivoReporte } from '$lib/domain/types/Reporte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	let {
		isLoading = false,
		showCancelButton = false,
		nombreObjeto = '',
		tipoObjeto = '',
		onsubmit,
		oncancel
	} = $props<{
		isLoading?: boolean;
		showCancelButton?: boolean;
		nombreObjeto?: string;
		tipoObjeto?: string;
		onsubmit?: (detail: { motivo: string; motivoOtro?: string; descripcion: string }) => void;
		oncancel?: () => void;
	}>();

	// Estado del formulario
	let motivo = $state<MotivoReporte | ''>('');
	let motivoOtro = $state('');
	let descripcion = $state('');
	let intentoEnvio = $state(false);

	// Errores
	let errorMotivo = $state('');
	let errorMotivoOtro = $state('');
	let errorDescripcion = $state('');

	const motivosDisponibles = Object.values(MotivoReporte);

	export function resetear() {
		motivo = '';
		motivoOtro = '';
		descripcion = '';
		intentoEnvio = false;
		errorMotivo = '';
		errorMotivoOtro = '';
		errorDescripcion = '';
	}

	function validar(): boolean {
		console.log('Validando formulario...');
		let esValido = true;
		errorMotivo = '';
		errorMotivoOtro = '';
		errorDescripcion = '';

		console.log('Motivo actual:', motivo);
		if (!motivo) {
			errorMotivo = 'Tenés que seleccionar un motivo';
			esValido = false;
			console.log('Error motivo set:', errorMotivo);
		}

		if (motivo === MotivoReporte.OTRO) {
			const motivoOtroTrimmed = motivoOtro.trim();
			if (!motivoOtroTrimmed) {
				errorMotivoOtro = 'Tenés que especificar el motivo';
				esValido = false;
			} else if (motivoOtroTrimmed.length < 5) {
				errorMotivoOtro = 'El motivo debe tener al menos 5 caracteres';
				esValido = false;
			} else {
				const motivoNormalizado = motivoOtroTrimmed.toLowerCase();
				const existeEnLista = motivosDisponibles.some((m) => m.toLowerCase() === motivoNormalizado);
				if (existeEnLista) {
					errorMotivoOtro = 'Este motivo ya existe en la lista. Seleccionalo del desplegable';
					esValido = false;
				}
			}
		}

		const descripcionTrimmed = descripcion.trim();
		if (!descripcionTrimmed) {
			errorDescripcion = 'La descripción es obligatoria';
			esValido = false;
		} else if (descripcionTrimmed.length < 20) {
			errorDescripcion = 'La descripción debe tener al menos 20 caracteres';
			esValido = false;
		} else if (descripcionTrimmed.length > 1200) {
			errorDescripcion = 'La descripción no puede exceder los 1200 caracteres';
			esValido = false;
		}

		console.log('Resultado validación:', esValido, {
			errorMotivo,
			errorMotivoOtro,
			errorDescripcion
		});
		return esValido;
	}

	function handleSubmit(event: Event) {
		console.log('Handle submit disparado');
		event.preventDefault();
		intentoEnvio = true;

		if (!validar()) {
			console.log('Validación falló, deteniendo envío.');
			return;
		}

		if (onsubmit) {
			onsubmit({
				motivo,
				motivoOtro: motivo === MotivoReporte.OTRO ? motivoOtro : undefined,
				descripcion
			});
		}
	}

	function handleCancel() {
		if (oncancel) oncancel();
	}

	function ensureNovalidate(node: HTMLFormElement) {
		node.setAttribute('novalidate', '');
		const requiredInputs = node.querySelectorAll('[required]');
		requiredInputs.forEach((input) => input.removeAttribute('required'));
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6" novalidate use:ensureNovalidate>
	<!-- Contexto del reporte -->
	{#if nombreObjeto}
		<div
			class="mb-6 rounded-[20px] border border-gray-200 bg-[#F3F4F6] px-5 py-4 text-center text-gray-800"
		>
			<p class="text-sm font-medium">
				Reportando {tipoObjeto ? tipoObjeto.toLowerCase() : 'elemento'}:
				<span class="font-bold">{nombreObjeto}</span>
			</p>
		</div>
	{/if}

	<!-- Motivo -->
	<div>
		<label for="motivo" class="block text-sm font-medium text-gray-700">
			Motivo del reporte
			{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
		</label>
		<select
			id="motivo"
			bind:value={motivo}
			disabled={isLoading}
			class="mt-2 w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {errorMotivo
				? 'border-red-300 focus:border-red-500 focus:ring-red-200'
				: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}"
		>
			<option value="">-- Seleccioná un motivo --</option>
			{#each motivosDisponibles as motivoOpcion}
				<option value={motivoOpcion}>{motivoOpcion}</option>
			{/each}
		</select>
		{#if errorMotivo}
			<p class="mt-2 flex items-center gap-1 text-sm text-red-600">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>
				{errorMotivo}
			</p>
		{/if}
	</div>

	<!-- Motivo personalizado -->
	{#if motivo === MotivoReporte.OTRO}
		<div class="animate-in fade-in slide-in-from-top-2 duration-200">
			<label for="motivoOtro" class="block text-sm font-medium text-gray-700">
				¿Cuál es el motivo?
				{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
			</label>
			<input
				type="text"
				id="motivoOtro"
				bind:value={motivoOtro}
				disabled={isLoading}
				placeholder="Detalle su motivo..."
				class="mt-2 w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {errorMotivoOtro
					? 'border-red-300 focus:border-red-500 focus:ring-red-200'
					: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}"
			/>
			{#if errorMotivoOtro}
				<p class="mt-2 flex items-center gap-1 text-sm text-red-600">
					<svg
						class="h-4 w-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
					{errorMotivoOtro}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Descripción -->
	<div>
		<label for="descripcion" class="block text-sm font-medium text-gray-700">
			Descripción detallada
			{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
		</label>
		<textarea
			id="descripcion"
			bind:value={descripcion}
			rows="6"
			disabled={isLoading}
			placeholder="Describí en detalle la irregularidad observada. Incluí fechas, nombres, montos o cualquier evidencia que ayude a la investigación..."
			class="mt-2 w-full resize-none rounded-lg border px-4 py-3 text-gray-900 shadow-sm transition focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {errorDescripcion
				? 'border-red-300 focus:border-red-500 focus:ring-red-200'
				: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}"
		></textarea>
		{#if errorDescripcion}
			<p class="mt-2 flex items-center gap-1 text-sm text-red-600">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>
				{errorDescripcion}
			</p>
		{/if}
		<p
			class="mt-2 text-xs transition-colors duration-200 {descripcion.length < 20
				? 'text-amber-600'
				: descripcion.length > 1200
					? 'text-red-600'
					: 'text-gray-500'}"
		>
			Mínimo 20 caracteres • Caracteres: {descripcion.length}
		</p>
	</div>

	<!-- Nota de confidencialidad -->
	<div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
		<div class="flex gap-3">
			<svg
				class="h-6 w-6 flex-shrink-0 text-blue-600"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
				/>
			</svg>
			<div class="text-sm text-blue-800">
				<p class="font-medium">Confidencialidad garantizada</p>
				<p class="mt-1 text-blue-700">
					Cuidamos tu identidad. Este reporte solo será visible para el equipo de administración de
					Conectando Corazones.
				</p>
			</div>
		</div>
	</div>

	<!-- Botones de acción -->
	<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
		{#if showCancelButton}
			<Button
				type="button"
				label="Cancelar"
				variant="secondary"
				disabled={isLoading}
				onclick={handleCancel}
			/>
		{/if}
		<Button
			type="submit"
			label={isLoading ? 'Enviando...' : 'Enviar reporte'}
			disabled={isLoading}
			formnovalidate
			customClass="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
		/>
	</div>
</form>