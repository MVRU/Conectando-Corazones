<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';

	import { validarCiudadEnProvincia, MENSAJES_ERROR } from '$lib/utils/validaciones';
	import {
		construirUrlsVistaPreviaGoogleMaps,
		type UrlsVistaPreviaGoogleMaps
	} from '$lib/utils/googleMaps';

	import { mockLocalidades } from '$lib/mocks/mock-localidades';
	import { provincias } from '$lib/data/provincias';
	import type { Provincia } from '$lib/types/Provincia';
	import { crearUrlGoogleMapsBasica } from '$lib/utils/util-ubicaciones';
	import type { Localidad } from '$lib/types/Localidad';
	import { createEventDispatcher } from 'svelte';
	import { toastStore } from '$lib/stores/toast';

	type DireccionPayload = {
		provinciaId: number | null;
		provinciaNombre: string;
		localidadId: number | null;
		localidadNombre: string;
		referencia?: string;
		url_google_maps?: string;
	};

	let enviando = false;
	let editandoUrlMapaGoogle = false;
	let idProvincia = '';
	let idLocalidad = '';
	let provincia: Provincia | undefined;
	let localidad: Localidad | undefined;
	let localidadesProvincia: Localidad[] = [];
	let referencia = '';
	let urlGoogleMaps = '';
	let googleMapsPreview: UrlsVistaPreviaGoogleMaps | null = null;
	let urlGoogleMapsLegible = '';

	function decodeUrlForDisplay(url: string): string {
		try {
			return decodeURI(url);
		} catch (_error) {
			return url;
		}
	}

	$: urlGoogleMapsLegible = urlGoogleMaps ? decodeUrlForDisplay(urlGoogleMaps) : '';
	let intentoEnvio = false;

	export let mostrarOmitir = false;
	export let etiquetaOmitir = 'Omitir';
	export let solicitarSoloUbicacion = false;

	const dispatch = createEventDispatcher<{ submit: DireccionPayload | undefined; skip: void }>();

	const convertirAString = (n?: number) => (n == null ? '' : String(n));

	$: requiereGeolocalizacion = !solicitarSoloUbicacion;

	$: provincia = provincias.find((p) => convertirAString(p.id_provincia) === idProvincia);

	$: localidadesProvincia = provincia
		? mockLocalidades.filter((l) => l.id_provincia === provincia.id_provincia)
		: [];

	$: if (
		provincia &&
		idLocalidad &&
		!localidadesProvincia.some((l) => convertirAString(l.id_localidad) === idLocalidad)
	) {
		idLocalidad = '';
	}

	$: localidad = localidadesProvincia.find((l) => convertirAString(l.id_localidad) === idLocalidad);

	// Genera la URL automáticamente
	$: {
		if (!requiereGeolocalizacion) {
			urlGoogleMaps = '';
			googleMapsPreview = null;
			editandoUrlMapaGoogle = false;
		} else if (validarCiudadEnProvincia(localidad?.id_localidad, provincia?.id_provincia)) {
			googleMapsPreview = construirUrlsVistaPreviaGoogleMaps({
				localidad: localidad?.nombre,
				provincia: provincia?.nombre
			});

			urlGoogleMaps = googleMapsPreview?.urlLugar ?? '';
		} else {
			googleMapsPreview = null;
			urlGoogleMaps = '';
		}
	}

	$: errores = {
		provincia: provincia ? '' : MENSAJES_ERROR.provinciaInvalida,
		localidad: validarCiudadEnProvincia(localidad?.id_localidad, provincia?.id_provincia)
			? ''
			: MENSAJES_ERROR.ciudadNoPerteneceProvincia
	};

	$: tieneErrores = Object.values(errores).some((mensajeError) => mensajeError !== '');

	function manejarEnvio(event: Event) {
		event.preventDefault();
		intentoEnvio = true;
		if (tieneErrores) return;

		enviando = true;

		setTimeout(() => {
			enviando = false;
			const payload: DireccionPayload = {
				provinciaId: provincia?.id_provincia ?? null,
				provinciaNombre: provincia?.nombre ?? '',
				localidadId: localidad?.id_localidad ?? null,
				localidadNombre: localidad?.nombre ?? '',
				referencia: referencia?.trim() || undefined,
				url_google_maps: requiereGeolocalizacion && urlGoogleMaps ? urlGoogleMaps : undefined
			};
			dispatch('submit', payload);
			toastStore.show({
				variant: 'success',
				title: 'Ubicación guardada',
				message: 'Registramos tu ubicación principal. Podrás sumar más direcciones desde tu panel.'
			});
		}, 800);
	}

	function omitirDireccion() {
		toastStore.show({
			variant: 'info',
			title: 'Paso omitido',
			message: 'Podés completar tu ubicación más adelante desde el panel de la institución.'
		});
		dispatch('skip');
	}
</script>

<form
	on:submit={manejarEnvio}
	class="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 sm:p-8 md:p-12"
>
	<header class="mx-auto max-w-3xl text-center">
		<h3 class="text-2xl font-semibold text-gray-900 md:text-3xl">Definí tu ubicación principal</h3>
	</header>

	<div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
		<!-- Provincia -->
		<div class="space-y-2">
			<label for="provincia" class="block text-sm font-semibold text-gray-800">
				Provincia <span class="text-red-600">*</span>
			</label>
			<Select
				id="provincia"
				required={true}
				placeholder="Seleccioná una provincia"
				options={provincias
					.filter((p) => p.id_provincia != null)
					.map((p) => ({ value: String(p.id_provincia), label: p.nombre }))}
				bind:value={idProvincia}
				error={intentoEnvio ? errores.provincia : ''}
				ariaDescribedBy="provincia-helper"
			/>
		</div>

		<!-- Localidad -->
		<div class="space-y-2">
			<label for="localidad" class="block text-sm font-semibold text-gray-800">
				Localidad <span class="text-red-600">*</span>
			</label>
			<Select
				id="localidad"
				required={true}
				placeholder="Seleccioná una localidad"
				options={localidadesProvincia
					.filter((c) => c.id_localidad != null)
					.map((c) => ({ value: String(c.id_localidad), label: c.nombre }))}
				bind:value={idLocalidad}
				disabled={!provincia}
				error={intentoEnvio ? errores.localidad : ''}
				ariaDescribedBy="localidad-helper"
			/>
		</div>

		{#if requiereGeolocalizacion}
			<!-- Campo URL Google Maps -->
			<div class="md:col-span-2">
				<label for="urlGoogleMaps" class="mb-2 block text-sm font-semibold text-gray-800">
					URL de Google Maps
				</label>
				<div class="relative">
					{#if editandoUrlMapaGoogle}
						<!-- Modo edición: Input -->
						<Input
							id="urlGoogleMaps"
							bind:value={urlGoogleMaps}
							placeholder="Se genera automáticamente"
							customClass="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
						/>
					{:else if urlGoogleMaps}
						<!-- Modo lectura: Enlace clickeable -->
						<a
							href={urlGoogleMaps}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full rounded-2xl border border-transparent bg-blue-50 px-4 py-3 text-base text-blue-700 underline transition-colors duration-200 hover:bg-blue-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
						>
							{urlGoogleMapsLegible}
						</a>
					{:else}
						<!-- Sin URL: solo texto informativo -->
						<p
							class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-base italic text-gray-500"
						>
							Se genera automáticamente
						</p>
					{/if}

					<!-- Botón de edición -->
					<button
						type="button"
						on:click={() => (editandoUrlMapaGoogle = !editandoUrlMapaGoogle)}
						class="absolute right-0 top-0 flex h-full w-11 items-center justify-center rounded-r-2xl border border-gray-200 bg-white text-blue-600 shadow-sm transition-colors duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
						aria-label={editandoUrlMapaGoogle ? 'Cancelar edición' : 'Editar URL'}
						aria-pressed={editandoUrlMapaGoogle}
					>
						{#if editandoUrlMapaGoogle}
							<svg
								class="h-5 w-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						{:else}
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path d="M4 16.5V20h3.5l10-10-3.5-3.5-10 10z"></path>
								<path d="M14.5 5.5l3 3" fill="none" stroke="currentColor" stroke-linecap="round"
								></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Vista previa del mapa -->
			{#if googleMapsPreview && !editandoUrlMapaGoogle}
				<section class="md:col-span-2">
					<div class="mx-auto w-full max-w-3xl text-center">
						<h4 class="text-lg font-semibold text-gray-900">Vista previa del mapa</h4>
						<p class="mt-2 text-sm text-gray-600 md:text-base">
							Confirmá que el marcador se ubique donde esperás. Podés abrirlo en una nueva pestaña
							para ajustar detalles si lo necesitás.
						</p>
					</div>
					<div class="mx-auto mt-6 w-full max-w-3xl">
						<div
							class="rounded-[28px] bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 p-[1px] shadow-lg"
						>
							<div class="rounded-[26px] bg-white p-3 sm:p-4">
								<div class="relative overflow-hidden rounded-3xl">
									<iframe
										src={googleMapsPreview.urlInsertar}
										class="h-[320px] w-full border-0 sm:h-[360px] md:h-[420px] lg:h-[460px] xl:h-[500px]"
										title="Vista previa del mapa"
										aria-label="Vista previa de la ubicación seleccionada en Google Maps"
										allowfullscreen
										loading="lazy"
										referrerpolicy="no-referrer-when-downgrade"
									></iframe>
								</div>
							</div>
						</div>
					</div>
				</section>
			{/if}
		{/if}
	</div>

	<!-- Botones de acción -->
	<div
		class="mt-12 flex flex-col-reverse gap-4 text-center md:flex-row md:items-center md:justify-end"
	>
		{#if mostrarOmitir}
			<Button
				label={etiquetaOmitir}
				variant="secondary"
				size="md"
				on:click={omitirDireccion}
				customClass="w-full md:w-auto"
			/>
		{/if}
		<Button
			label={enviando ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={tieneErrores || enviando}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
