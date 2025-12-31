<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { usuario as usuarioStore } from '$lib/stores/auth';
	import type { Reporte } from '$lib/types/Reporte';
	import ReporteForm from '$lib/components/ui/forms/ReporteForm.svelte';
	import { portal } from '$lib/actions/portal';
	import { Button } from '$lib';

	const dispatch = createEventDispatcher();

	// recibidas del componente padre
	export let open = false;
	export let tipo_objeto: 'Usuario' | 'Proyecto';
	export let id_objeto: number;
	export let nombre_objeto = '';

	let enviando = false;
	let reporteEnviado = false;
	let errorEnvio = '';
	let formComponent: ReporteForm;

	$: usuario = $usuarioStore;

	function cerrarModal() {
		if (!enviando) {
			if (formComponent) formComponent.resetear();
			errorEnvio = '';
			reporteEnviado = false;
			open = false;
			dispatch('close');
		}
	}

	async function handleFormSubmit(event: CustomEvent) {
		const { motivo, motivoOtro, descripcion } = event.detail;
		errorEnvio = '';

		if (!usuario?.id_usuario) {
			errorEnvio = 'Debés estar autenticado para reportar';
			return;
		}

		enviando = true;

		const nuevoReporte: Reporte = {
			tipo_objeto,
			id_objeto,
			motivo,
			descripcion:
				motivo === 'Otro'
					? `Motivo: ${motivoOtro.trim()}\n\n${descripcion.trim()}`
					: descripcion.trim(),
			id_reporte: undefined,
			created_at: new Date(),
			estado: 'pendiente',
			fecha_resolucion: null,
			comentario_resolucion: null,
			reportante_id: usuario.id_usuario,
			admin_id: null,
			usuario_id: tipo_objeto === 'Usuario' ? id_objeto : undefined
		};

		try {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			console.log('Reporte enviado (simulado):', nuevoReporte);
			dispatch('success', { reporte: nuevoReporte });

			enviando = false;
			reporteEnviado = true;
		} catch (error) {
			console.error('Error al enviar reporte:', error);
			errorEnvio = 'Hubo un error al enviar el reporte. Intentá nuevamente.';
		} finally {
			enviando = false;
		}
	}

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
		use:portal
		class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-md transition-all duration-300"
		on:click={cerrarModal}
		on:keydown={(e) => e.key === 'Enter' && cerrarModal()}
		role="button"
		tabindex="0"
		aria-label="Cerrar modal"
	>
		<!-- Modal -->
		<div
			class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
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
				<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Encabezado -->
			<div class="mb-6">
				<div class="mb-4 flex items-center gap-3">
					<h2 id="modal-titulo" class="text-2xl font-bold text-gray-900">Reportar irregularidad</h2>
				</div>
			</div>

			<!-- Mensaje de éxito -->
			{#if reporteEnviado}
				<div
					class="animate-in fade-in zoom-in flex flex-col items-center justify-center py-8 text-center duration-300"
				>
					<div class="mb-4 rounded-full bg-green-100 p-4">
						<svg
							class="h-10 w-10 text-green-600"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h3 class="text-xl font-bold text-gray-900">¡Reporte enviado!</h3>
					<p class="mt-2 max-w-sm text-gray-600">
						Gracias por colaborar. El equipo de administración revisará tu reporte a la brevedad.
					</p>
					<Button on:click={cerrarModal} label="Cerrar" customClass="mt-8" />
				</div>
			{:else}
				<!-- Error general de envío -->
				{#if errorEnvio}
					<div class="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
						{errorEnvio}
					</div>
				{/if}

				<!-- Formulario compartido -->
				<ReporteForm
					bind:this={formComponent}
					isLoading={enviando}
					showCancelButton={true}
					nombreObjeto={nombre_objeto}
					tipoObjeto={tipo_objeto}
					on:submit={handleFormSubmit}
					on:cancel={cerrarModal}
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
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
