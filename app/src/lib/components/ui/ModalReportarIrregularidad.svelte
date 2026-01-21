<script lang="ts">
	import { usuario as usuarioStore } from '$lib/stores/auth';
	import ReporteForm from '$lib/components/ui/forms/ReporteForm.svelte';
	import { crearReporte } from '$lib/utils/util-reportes';
	import { portal } from '\$lib/utils/actions/portal';
	import { Button } from '$lib';

	// recibidas del componente padre
	let { 
		open = $bindable(false), 
		tipo_objeto, 
		id_objeto, 
		nombre_objeto = '',
		onclose,
		onsuccess
	} = $props<{
		open: boolean;
		tipo_objeto: 'Usuario' | 'Proyecto';
		id_objeto: number;
		nombre_objeto?: string;
		onclose?: () => void;
		onsuccess?: (detail: { reporte: any }) => void;
	}>();

	let enviando = $state(false);
	let reporteEnviado = $state(false);
	let errorEnvio = $state('');
	let formComponent = $state<ReporteForm>();

	let usuario = $derived($usuarioStore);

	function cerrarModal() {
		if (!enviando) {
			if (formComponent) formComponent.resetear();
			errorEnvio = '';
			reporteEnviado = false;
			open = false;
			if (onclose) onclose();
		}
	}

	async function handleFormSubmit(detail: { motivo: string; motivoOtro?: string; descripcion: string }) {
		const { motivo, motivoOtro, descripcion } = detail;
		errorEnvio = '';

		if (!usuario?.id_usuario) {
			errorEnvio = 'Debés estar autenticado para reportar';
			return;
		}

		enviando = true;

		try {
			const nuevoReporte = await crearReporte({
				tipo_objeto,
				id_objeto,
				motivo: motivo as any,
				descripcion:
					motivo === 'Otro'
						? `Motivo: ${motivoOtro?.trim() || ''}\n\n${descripcion.trim()}`
						: descripcion.trim(),
				reportante_id: usuario.id_usuario,
				admin_id: null
			});

			console.log('Reporte enviado real:', nuevoReporte);
			if (onsuccess) onsuccess({ reporte: nuevoReporte });

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
		onclick={cerrarModal}
		onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && cerrarModal()}
		role="button"
		tabindex="0"
		aria-label="Cerrar modal"
	>
		<!-- Modal -->
		<div
			class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-titulo"
			tabindex="-1"
		>
			<!-- Botón cerrar -->
			<button
				type="button"
				onclick={cerrarModal}
				disabled={enviando}
				class="absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
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
					<Button onclick={cerrarModal} label="Cerrar" customClass="mt-8" />
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
					onsubmit={handleFormSubmit}
					oncancel={cerrarModal}
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
