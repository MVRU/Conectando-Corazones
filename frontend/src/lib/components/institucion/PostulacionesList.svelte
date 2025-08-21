<!--

FIX: corregir para que coincida con DER

* Componente: PostulacionesList
  -*- Descripción: Lista de postulaciones pendientes con acciones para aceptar/rechazar
-->

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Postulacion } from '$lib/types/Postulacion'; // FIX: usar Colaboracion
	import Button from '$lib/components/ui/elementos/Button.svelte';

	export let postulaciones: Postulacion[] = [];

	const dispatch = createEventDispatcher<{
		aceptar: number;
		rechazar: number;
	}>();

	function aceptarPostulacion(id: number) {
		dispatch('aceptar', id);
	}

	function rechazarPostulacion(id: number) {
		dispatch('rechazar', id);
	}

	// TODO: centralizar esta función pq se está creando muchas veces
	function formatearFecha(fecha: string): string {
		return new Date(fecha).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function getTipoIcon(tipo: string): string {
		return tipo === 'persona' ? '👤' : '🏢';
	}

	function getTipoLabel(tipo: string): string {
		return tipo === 'persona' ? 'Persona' : 'Organización';
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
	<div class="border-b border-gray-200 px-6 py-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">Postulaciones pendientes</h2>
			<span
				class="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800"
			>
				{postulaciones.length} pendiente{postulaciones.length !== 1 ? 's' : ''}
			</span>
		</div>
	</div>

	<div class="divide-y divide-gray-200">
		{#if postulaciones.length === 0}
			<div class="px-6 py-12 text-center">
				<div class="mb-4 text-4xl">📥</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">No hay postulaciones pendientes</h3>
				<p class="text-gray-500">
					Cuando recibas solicitudes de colaboración aparecerán aquí para que puedas gestionarlas.
				</p>
			</div>
		{:else}
			{#each postulaciones as postulacion (postulacion.id)}
				<div class="px-6 py-4 transition-colors hover:bg-gray-50">
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-2 flex items-center gap-3">
								<span class="text-2xl">{getTipoIcon(postulacion.tipo)}</span>
								<div>
									<h3 class="text-base font-medium text-gray-900">
										{postulacion.nombre}
									</h3>
									<p class="text-sm text-gray-500">
										{getTipoLabel(postulacion.tipo)} • Postulado el {formatearFecha(
											postulacion.fecha
										)}
									</p>
								</div>
							</div>

							{#if postulacion.email}
								<p class="mb-1 text-sm text-gray-600">
									<span class="font-medium">Email:</span>
									{postulacion.email}
								</p>
							{/if}

							{#if postulacion.telefono}
								<p class="mb-1 text-sm text-gray-600">
									<span class="font-medium">Teléfono:</span>
									{postulacion.telefono}
								</p>
							{/if}

							{#if postulacion.mensaje}
								<div class="mt-3 rounded-lg bg-gray-50 p-3">
									<p class="text-sm text-gray-700">
										<span class="font-medium">Mensaje:</span>
									</p>
									<p class="mt-1 text-sm text-gray-600">
										{postulacion.mensaje}
									</p>
								</div>
							{/if}
						</div>

						<div class="ml-6 flex flex-col gap-2">
							<button
								on:click={() => aceptarPostulacion(postulacion.id)}
								class="inline-flex items-center rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
							>
								✓ Aceptar
							</button>
							<button
								on:click={() => rechazarPostulacion(postulacion.id)}
								class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
							>
								✕ Rechazar
							</button>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
