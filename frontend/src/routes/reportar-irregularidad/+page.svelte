<script lang="ts">
	import { page } from '$app/stores';
	import type { Reporte } from '$lib/types/Reporte';
	import ReporteForm from '$lib/components/ui/forms/ReporteForm.svelte';
	import { Button } from '$lib';

	let formularioEnviado = false;
	let enviandoFormulario = false;
	let errorEnvio = '';

	$: queryParams = $page.url.searchParams;
	$: tipoObjeto = queryParams.get('type') || 'Sistema';
	$: idObjeto = parseInt(queryParams.get('id') || '0');
	$: nombreObjeto = queryParams.get('name') || '';

	async function handleFormSubmit(event: CustomEvent) {
		const { motivo, motivoOtro, descripcion } = event.detail;
		errorEnvio = '';
		enviandoFormulario = true;

		const nuevoReporte: Reporte = {
			tipo_objeto: tipoObjeto,
			id_objeto: idObjeto,
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
			reportante_id: 1, // TODO: Obtener usuario real si está logueado
			admin_id: null,
			usuario_id: tipoObjeto === 'Usuario' ? idObjeto : undefined
		};

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			console.log('Reporte enviado (simulado):', nuevoReporte);
			formularioEnviado = true;
		} catch (error) {
			console.error('Error al enviar:', error);
			errorEnvio = 'Hubo un error al enviar tu reporte. Por favor intentá nuevamente.';
		} finally {
			enviandoFormulario = false;
		}
	}
</script>

<svelte:head>
	<title>Reportar Irregularidad - Conectando Corazones</title>
	<meta
		name="description"
		content="Reportá situaciones inadecuadas o irregularidades en Conectando Corazones de forma confidencial."
	/>
</svelte:head>

<main class="w-full bg-gradient-to-b from-gray-50 to-white px-6 py-20 md:px-12 lg:px-28">
	<!-- Encabezado -->
	<div class="animate-fade-in-up mb-16">
		<div class="mb-8 flex items-center justify-center gap-4">
			<h1 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
				Reportar irregularidad
			</h1>
		</div>
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-lg leading-relaxed text-gray-600">
				{#if nombreObjeto}
					<!-- El contexto dentro del formulario -->
				{:else}
					¿Detectaste alguna situación inadecuada?
				{/if}
			</p>
		</div>
	</div>

	<!-- Contenedor del formulario -->
	<section class="animate-fade-in-up mx-auto w-full max-w-3xl">
		<div
			class="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg ring-1 ring-gray-100 transition hover:shadow-xl sm:p-10"
		>
			<!-- Mensaje de éxito -->
			{#if formularioEnviado}
				<div class="flex flex-col items-center justify-center p-6 text-center">
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
					<p class="mt-2 text-gray-600">
						Gracias por colaborar. El equipo de administración revisará tu reporte a la brevedad.
					</p>
					<Button href="/" label="Volver al inicio" customClass="mt-8" />
				</div>
			{:else}
				{#if errorEnvio}
					<div class="mb-6 rounded-lg bg-red-50 p-4 text-center text-red-700">
						{errorEnvio}
					</div>
				{/if}

				<ReporteForm
					isLoading={enviandoFormulario}
					{nombreObjeto}
					{tipoObjeto}
					on:submit={handleFormSubmit}
				/>
			{/if}
		</div>
	</section>
</main>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.5s ease-out forwards;
	}
</style>
