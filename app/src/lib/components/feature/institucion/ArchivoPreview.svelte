<script lang="ts">
	import type { Archivo } from '$lib/domain/types/Archivo';
	import { obtenerNombreUsuario } from '$lib/utils/util-usuarios';
	import {
		formatearTamaño,
		obtenerExtension,
		esImagen,
		esPDF,
		descargarArchivo as descargarArchivoUtil,
		abrirArchivo as abrirArchivoUtil
	} from '$lib/utils/util-archivos';

	export let archivo: Archivo;

	// Determinar si es una imagen o PDF usando las utilidades
	$: esImagenArchivo = esImagen(archivo.tipo_mime);
	$: esPDFArchivo = esPDF(archivo.tipo_mime);

	// Funciones wrapper para mantener compatibilidad con el componente
	function descargarArchivo() {
		descargarArchivoUtil(archivo);
	}

	function abrirArchivo() {
		abrirArchivoUtil(archivo);
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm">
	<!-- Información del archivo -->
	<div class="flex items-start gap-3">
		<!-- Ícono según tipo -->
		<div class="flex-shrink-0">
			{#if esImagenArchivo}
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
					<svg
						class="h-6 w-6 text-blue-600"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						/>
					</svg>
				</div>
			{:else if esPDFArchivo}
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
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
							d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
						/>
					</svg>
				</div>
			{:else}
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
					<svg
						class="h-6 w-6 text-gray-600"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
						/>
					</svg>
				</div>
			{/if}
		</div>

		<!-- Contenido del archivo -->
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-medium text-gray-900" title={archivo.descripcion}>
				{archivo.descripcion || 'Archivo sin descripción'}
			</p>

			<!-- Metadatos -->
			<div class="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
				<span class="inline-flex items-center gap-1">
					<svg
						class="h-3 w-3"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
						/>
					</svg>
					{obtenerNombreUsuario(archivo.usuario_id || 0)}
				</span>
				<span>•</span>
				<span>{obtenerExtension(archivo.tipo_mime, archivo.url)}</span>
				{#if archivo.tamaño}
					<span>•</span>
					<span>{formatearTamaño(archivo.tamaño)}</span>
				{/if}
			</div>

			<!-- Botones de acción -->
			<div class="mt-2 flex items-center gap-2">
				{#if esImagenArchivo || esPDFArchivo}
					<button
						type="button"
						on:click={abrirArchivo}
						class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none"
					>
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
							/>
						</svg>
						Abrir
					</button>
				{/if}
				<button
					type="button"
					on:click={descargarArchivo}
					class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 focus:outline-none"
				>
					<svg
						class="h-3.5 w-3.5"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
						/>
					</svg>
					Descargar
				</button>
			</div>
		</div>
	</div>
</div>

