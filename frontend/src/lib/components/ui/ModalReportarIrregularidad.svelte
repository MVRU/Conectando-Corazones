<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { usuario as usuarioStore } from '$lib/stores/auth';
	import { MotivoReporte, type Reporte } from '$lib/types/Reporte';
	import Button from '$lib/components/ui/elementos/Button.svelte';

	const dispatch = createEventDispatcher();

	// recibidas del componente padre
	export let open = false;
	export let tipo_objeto: 'Usuario' | 'Proyecto';
	export let id_objeto: number;
	export let nombre_objeto = ''; // Para mostrar en el modal (ej: nombre del proyecto o usuario)

	// Estado del formulario
	let motivo: MotivoReporte | '' = '';
	let motivoOtro = ''; // Campo adicional cuando motivo === 'Otro'
	let descripcion = '';
	let intentoEnvio = false;
	let enviando = false;
	let errorMotivo = '';
	let errorMotivoOtro = '';
	let errorDescripcion = '';

	// Obtener todos los motivos del enum
	const motivosDisponibles = Object.values(MotivoReporte);

	$: usuario = $usuarioStore;

	function cerrarModal() {
		if (!enviando) {
			resetearFormulario();
			open = false;
			dispatch('close');
		}
	}

	function resetearFormulario() {
		motivo = '';
		motivoOtro = '';
		descripcion = '';
		intentoEnvio = false;
		errorMotivo = '';
		errorMotivoOtro = '';
		errorDescripcion = '';
	}

	function validarFormulario(): boolean {
		let esValido = true;
		errorMotivo = '';
		errorMotivoOtro = '';
		errorDescripcion = '';

		if (!motivo) {
			errorMotivo = 'Debés seleccionar un motivo';
			esValido = false;
		}

		// Si seleccionó "Otro", validar que escribió el motivo
		if (motivo === 'Otro') {
			const motivoOtroTrimmed = motivoOtro.trim();
			if (!motivoOtroTrimmed) {
				errorMotivoOtro = 'Debés especificar el motivo';
				esValido = false;
			} else if (motivoOtroTrimmed.length < 5) {
				errorMotivoOtro = 'El motivo debe tener al menos 5 caracteres';
				esValido = false;
			} else {
				// Validar que el motivo personalizado no coincida con uno existente
				const motivoNormalizado = motivoOtroTrimmed.toLowerCase();
				const existeEnLista = motivosDisponibles.some(
					(m) => m.toLowerCase() === motivoNormalizado
				);
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
		}

		return esValido;
	}

	async function enviarReporte(event: Event) {
		event.preventDefault();
		intentoEnvio = true;

		if (!validarFormulario()) {
			return;
		}

		if (!usuario?.id_usuario) {
			errorDescripcion = 'Debés estar autenticado para reportar';
			return;
		}

		enviando = true;

		const nuevoReporte: Reporte = {
			// Campos principales
			tipo_objeto,
			id_objeto,
			motivo: motivo as MotivoReporte,
			// Si es "Otro", incluir el motivo personalizado en la descripción
			descripcion:
				motivo === 'Otro'
					? `Motivo: ${motivoOtro.trim()}\n\n${descripcion.trim()}`
					: descripcion.trim(),

			// Campos autogenerados 
			id_reporte: undefined, 
			created_at: new Date(),

			// Estado inicial
			estado: 'pendiente',
			fecha_resolucion: null,
			comentario_resolucion: null,

			// Relaciones
			reportante_id: usuario.id_usuario,
			admin_id: null, // No hay admin asignado al crear
			usuario_id: tipo_objeto === 'Usuario' ? id_objeto : undefined
		};

		try {
			// Simulación de envío al backend
			await new Promise((resolve) => setTimeout(resolve, 1500));

			console.log('Reporte enviado (simulado):', nuevoReporte);

			dispatch('success', { reporte: nuevoReporte });
			cerrarModal();
		} catch (error) {
			console.error('Error al enviar reporte:', error);
			errorDescripcion = 'Hubo un error al enviar el reporte. Intentá nuevamente.';
		} finally {
			enviando = false;
		}
	}

	// Cerrar modal al presionar Escape
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && !enviando) {
			cerrarModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<!-- Overlay -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
		on:click={cerrarModal}
		on:keydown={(e) => e.key === 'Enter' && cerrarModal()}
		role="button"
		tabindex="0"
		aria-label="Cerrar modal"
	>
		<!-- Modal -->
		<div
			class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-titulo"
			tabindex="-1"
		>
			<!-- Botón cerrar -->
			<button
				type="button"
				on:click={cerrarModal}
				disabled={enviando}
				class="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
				aria-label="Cerrar"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Encabezado -->
			<div class="mb-6">
				<div class="mb-4 flex items-center gap-3">
					<div class="rounded-full bg-red-100 p-3">
						<svg
							class="h-6 w-6 text-red-600"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
							/>
						</svg>
					</div>
					<h2 id="modal-titulo" class="text-2xl font-bold text-gray-900">
						Reportar irregularidad
					</h2>
				</div>

				<!-- Objeto reportado -->
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
					<p class="text-sm font-medium text-gray-700">Reportando:</p>
					<p class="mt-1 text-base font-semibold text-gray-900">
						{tipo_objeto}
						{#if nombre_objeto}
							<span class="text-blue-600">"{nombre_objeto}"</span>
						{:else}
							<span class="text-gray-600">(ID: {id_objeto})</span>
						{/if}
					</p>
				</div>
			</div>

			<!-- Formulario -->
			<form on:submit={enviarReporte} class="space-y-6">
				<!-- Campo: Motivo -->
				<div>
					<label for="motivo" class="block text-sm font-medium text-gray-700">
						Motivo del reporte
						{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
					</label>
					<select
						id="motivo"
						bind:value={motivo}
						required
						disabled={enviando}
						class="mt-2 w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {errorMotivo
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
							{errorMotivo}
						</p>
					{/if}
				</div>

				<!-- Campo adicional: Motivo personalizado (solo si seleccionó "Otro") -->
				{#if motivo === 'Otro'}
					<div class="animate-in fade-in slide-in-from-top-2 duration-200">
						<label for="motivoOtro" class="block text-sm font-medium text-gray-700">
							¿Cuál es el motivo?
							{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
						</label>
						<input
							type="text"
							id="motivoOtro"
							bind:value={motivoOtro}
							required
							disabled={enviando}
							placeholder="Detalle su motivo..."
							class="mt-2 w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {errorMotivoOtro
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

				<!-- Campo: Descripción -->
				<div>
					<label for="descripcion" class="block text-sm font-medium text-gray-700">
						Descripción detallada
						{#if intentoEnvio}<span class="text-red-500">*</span>{/if}
					</label>
					<textarea
						id="descripcion"
						bind:value={descripcion}
						rows="6"
						required
						disabled={enviando}
						placeholder="Describí en detalle la irregularidad observada. Incluí fechas, nombres, montos o cualquier evidencia que ayude a la investigación..."
						class="mt-2 w-full resize-none rounded-lg border px-4 py-3 text-gray-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {errorDescripcion
							? 'border-red-300 focus:border-red-500 focus:ring-red-200'
							: 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'}"
					></textarea>
					{#if errorDescripcion}
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
							{errorDescripcion}
						</p>
					{/if}
					<p class="mt-2 text-xs text-gray-500">
						Mínimo 20 caracteres • Caracteres: {descripcion.length}
					</p>
				</div>

				<!-- Nota de confidencialidad -->
				<div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
					<div class="flex gap-3">
						<svg
							class="h-5 w-5 flex-shrink-0 text-blue-600"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
						<div class="text-sm text-blue-800">
							<p class="font-medium">Confidencialidad garantizada</p>
							<p class="mt-1 text-blue-700">
								Tu reporte será revisado por el equipo de administración de forma confidencial.
							</p>
						</div>
					</div>
				</div>

				<!-- Botones de acción -->
				<div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						type="button"
						label="Cancelar"
						variant="secondary"
						disabled={enviando}
						on:click={cerrarModal}
						customClass="w-full sm:w-auto"
					/>
					<Button
						type="submit"
						label={enviando ? 'Enviando...' : 'Enviar reporte'}
						disabled={enviando}
						customClass="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
					/>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	/* Animación de entrada del modal */
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	div[role='button'] {
		animation: fade-in 0.2s ease-out;
	}

	div[role='dialog'] {
		animation: slide-up 0.3s ease-out;
	}
</style>
