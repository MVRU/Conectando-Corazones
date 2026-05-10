<script lang="ts">
	import { onMount } from 'svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';

	import { MENSAJES_ERROR, validarUrl } from '$lib/utils/validaciones';
	import { construirUrlsVistaPreviaGoogleMaps } from '$lib/utils/googleMaps';

	import type { Provincia } from '$lib/domain/entities/Provincia';
	import type { Localidad } from '$lib/domain/entities/Localidad';
	import { toastStore } from '$lib/stores/toast';

	interface Props {
		mostrarOmitir?: boolean;
		etiquetaOmitir?: string;
		solicitarSoloUbicacion?: boolean;
		onsubmit: (payload: DireccionPayload | undefined) => void;
		onskip?: () => void;
	}

	let {
		mostrarOmitir = false,
		etiquetaOmitir = 'Omitir',
		solicitarSoloUbicacion = false,
		onsubmit,
		onskip
	}: Props = $props();

	let provincias: Provincia[] = $state([]);
	let cargandoProvincias = $state(true);
	let cargandoLocalidades = $state(false);

	export type DireccionPayload = {
		provinciaId: number | null;
		provinciaNombre: string;
		localidadId: number | null;
		localidadNombre: string;
		referencia?: string;
		url_google_maps?: string;
	};

	let enviando = $state(false);
	let editandoUrlMapaGoogle = $state(false);
	let idProvincia = $state('');
	let idLocalidad = $state('');
	let localidadesProvincia: Localidad[] = $state([]);
	let urlGoogleMaps = $state('');
	let referencia = $state('');
	let intentoEnvio = $state(false);

	function decodeUrlForDisplay(url: string): string {
		try {
			return decodeURI(url);
		} catch {
			return url;
		}
	}

	let urlGoogleMapsLegible = $derived(urlGoogleMaps ? decodeUrlForDisplay(urlGoogleMaps) : '');

	const convertirAString = (n?: number) => (n == null ? '' : String(n));

	let requiereGeolocalizacion = $derived(!solicitarSoloUbicacion);

	let provincia = $derived(
		provincias.find((p) => convertirAString(p.id_provincia) === idProvincia)
	);

	onMount(async () => {
		try {
			const response = await fetch('/api/ubicaciones/provincias');
			if (response.ok) {
				provincias = await response.json();
			}
		} catch (e) {
			console.error('Error cargando provincias:', e);
		} finally {
			cargandoProvincias = false;
		}
	});

	async function cargarLocalidades(idProv: number) {
		cargandoLocalidades = true;
		localidadesProvincia = [];
		try {
			const response = await fetch(`/api/ubicaciones/provincias/${idProv}/localidades`);
			if (response.ok) {
				localidadesProvincia = await response.json();
			}
		} catch (e) {
			console.error('Error cargando localidades:', e);
		} finally {
			cargandoLocalidades = false;
		}
	}

	$effect(() => {
		if (provincia?.id_provincia) {
			cargarLocalidades(provincia.id_provincia);
		} else {
			localidadesProvincia = [];
		}
	});

	$effect(() => {
		if (
			provincia &&
			idLocalidad &&
			!localidadesProvincia.some((l) => convertirAString(l.id_localidad) === idLocalidad)
		) {
			idLocalidad = '';
		}
	});

	let localidad = $derived(
		localidadesProvincia.find((l) => convertirAString(l.id_localidad) === idLocalidad)
	);

	let googleMapsPreview = $derived.by(() => {
		if (!requiereGeolocalizacion || !provincia || !localidad) return null;
		if (localidad.id_provincia !== provincia.id_provincia) return null;

		return construirUrlsVistaPreviaGoogleMaps({
			localidad: localidad.nombre,
			provincia: provincia.nombre
		});
	});

	$effect(() => {
		if (!requiereGeolocalizacion) {
			urlGoogleMaps = '';
			editandoUrlMapaGoogle = false;
		} else if (googleMapsPreview) {
			urlGoogleMaps = googleMapsPreview.urlLugar ?? '';
		} else {
			urlGoogleMaps = '';
		}
	});

	let errores = $derived({
		provincia: provincia ? '' : MENSAJES_ERROR.provinciaInvalida,
		localidad:
			localidad?.id_provincia === provincia?.id_provincia
				? ''
				: MENSAJES_ERROR.ciudadNoPerteneceProvincia,
		url_google_maps:
			requiereGeolocalizacion && editandoUrlMapaGoogle && urlGoogleMaps.trim() && !validarUrl(urlGoogleMaps)
				? MENSAJES_ERROR.urlInvalida
				: ''
	});

	let tieneErrores = $derived(Object.values(errores).some((mensajeError) => mensajeError !== ''));

	function manejarEnvio(event: SubmitEvent) {
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
			onsubmit(payload);
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
			message: 'Podés completar tu ubicación más adelante desde tu panel.'
		});
		onskip?.();
	}
</script>

<form
	onsubmit={manejarEnvio}
	class="space-y-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10"
>
	<div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="space-y-2">
			<label for="provincia" class="block text-sm font-semibold text-gray-800">
				Provincia <span class="text-red-600">*</span>
			</label>
			<Select
				id="provincia"
				required={true}
				placeholder={cargandoProvincias ? 'Cargando...' : 'Seleccioná una provincia'}
				disabled={cargandoProvincias}
				options={provincias
					.filter((p) => p.id_provincia != null)
					.map((p) => ({ value: String(p.id_provincia), label: p.nombre }))}
				bind:value={idProvincia}
				error={intentoEnvio ? errores.provincia : ''}
				ariaDescribedBy="provincia-helper"
			/>
		</div>

		<div class="space-y-2">
			<label for="localidad" class="block text-sm font-semibold text-gray-800">
				Localidad <span class="text-red-600">*</span>
			</label>
			<Select
				id="localidad"
				required={true}
				placeholder={cargandoLocalidades ? 'Cargando...' : 'Seleccioná una localidad'}
				options={localidadesProvincia
					.filter((c) => c.id_localidad != null)
					.map((c) => ({ value: String(c.id_localidad), label: c.nombre }))}
				bind:value={idLocalidad}
				disabled={!provincia || cargandoLocalidades}
				error={intentoEnvio ? errores.localidad : ''}
				ariaDescribedBy="localidad-helper"
			/>
		</div>

		{#if requiereGeolocalizacion}
			<div class="md:col-span-2">
				<label for="urlGoogleMaps" class="mb-2 block text-sm font-semibold text-gray-800">
					URL de Google Maps
				</label>
				<div class="relative">
					{#if editandoUrlMapaGoogle}
						<Input
							id="urlGoogleMaps"
							bind:value={urlGoogleMaps}
							error={intentoEnvio ? errores.url_google_maps : ''}
							placeholder="Se genera automáticamente"
							customClass="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
						/>
					{:else if urlGoogleMaps}
						<a
							href={urlGoogleMaps}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full rounded-2xl border border-transparent bg-blue-50 px-4 py-3 pr-14 text-base text-blue-700 underline transition-colors duration-200 hover:bg-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
						>
							{urlGoogleMapsLegible}
						</a>
					{:else}
						<p
							class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 pr-14 text-base text-gray-500 italic"
						>
							Se genera automáticamente
						</p>
					{/if}

					<button
						type="button"
						onclick={() => (editandoUrlMapaGoogle = !editandoUrlMapaGoogle)}
						class="absolute top-0 right-0 flex h-full w-11 items-center justify-center rounded-r-2xl border border-gray-200 bg-white text-blue-600 shadow-sm transition-colors duration-200 hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
				{#if intentoEnvio && errores.url_google_maps}
					<p class="mt-2 text-sm text-red-600">{errores.url_google_maps}</p>
				{/if}
			</div>

			{#if googleMapsPreview && !editandoUrlMapaGoogle}
				<section class="space-y-6 md:col-span-2">
					<div class="space-y-2 text-center lg:text-left">
						<h4 class="text-lg font-semibold text-slate-900">Vista previa del mapa</h4>
						<p class="text-sm text-slate-500">Confirmá que el marcador se ubique correctamente.</p>
					</div>
					<div
						class="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-2 shadow-inner"
					>
						<div class="relative overflow-hidden rounded-2xl bg-white">
							<iframe
								src={googleMapsPreview.urlInsertar}
								class="h-[320px] w-full border-0 sm:h-[400px]"
								title="Vista previa del mapa"
								aria-label="Vista previa de la ubicación seleccionada en Google Maps"
								allowfullscreen
								loading="lazy"
								referrerpolicy="no-referrer-when-downgrade"
							></iframe>
						</div>
					</div>
				</section>
			{/if}
		{/if}
	</div>

	<div
		class="mt-12 flex flex-col-reverse gap-4 text-center md:flex-row md:items-center md:justify-end"
	>
		{#if mostrarOmitir}
			<button
				type="button"
				class="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
				onclick={omitirDireccion}
			>
				{etiquetaOmitir}
			</button>
		{/if}
		<Button
			type="submit"
			label={enviando ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={tieneErrores || enviando}
			customClass="w-full md:w-auto"
		/>
	</div>
</form>
