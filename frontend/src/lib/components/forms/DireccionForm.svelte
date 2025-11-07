<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Select from '$lib/components/ui/elementos/Select.svelte';

	import { validarCiudadEnProvincia, MENSAJES_ERROR } from '$lib/utils/validaciones';

	import { mockLocalidades } from '$lib/mocks/mock-localidades';
	import { provincias } from '$lib/data/provincias';
	import type { Provincia } from '$lib/types/Provincia';
	import type { Localidad } from '$lib/types/Localidad';
	import { createEventDispatcher } from 'svelte';

	let enviando = false;
	let editandoUrlMapaGoogle = false;
	// let calle = '';
	// let numero = '';
	// let piso = '';
	// let departamento = '';
	let idProvincia = '';
	let idLocalidad = '';
	let provincia: Provincia | undefined;
	let localidad: Localidad | undefined;
	let localidadesProvincia: Localidad[] = [];
	let referencia = '';
	let urlGoogleMaps = '';
	let intentoEnvio = false;

	export let mostrarOmitir = false;
	export let etiquetaOmitir = 'Omitir';
	export let solicitarSoloUbicacion = false;

	const dispatch = createEventDispatcher();

	const convertirAString = (n?: number) => (n == null ? '' : String(n));

	$: requiereDireccionDetallada = !solicitarSoloUbicacion;

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
		if (!requiereDireccionDetallada) {
			urlGoogleMaps = '';
			editandoUrlMapaGoogle = false;
		} else if (
			// validarCalle(calle) &&
			// validarNumeroCalle(numero) &&
			validarCiudadEnProvincia(localidad?.id_localidad, provincia?.id_provincia)
		) {
			const direccionCompleta = `${localidad?.nombre}, ${provincia?.nombre}`;
			urlGoogleMaps = `https://maps.google.com/?q=${encodeURIComponent(direccionCompleta)}`;
		}
	}

	$: errores = {
		// calle: requiereDireccionDetallada
		// 	? validarCalle(calle)
		// 		? ''
		// 		: MENSAJES_ERROR.calleInvalida
		// 	: '',
		// numero: requiereDireccionDetallada
		// 	? validarNumeroCalle(numero)
		// 		? ''
		// 		: MENSAJES_ERROR.numeroCalleInvalido
		// 	: '',
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

		// setTimeout(() => {
		// 	enviando = false;
		// 	const direccion: Direccion = {
		// 		calle: requiereDireccionDetallada ? calle : '',
		// 		numero: requiereDireccionDetallada ? numero : '',
		// 		piso: requiereDireccionDetallada && piso ? piso : undefined,
		// 		departamento: requiereDireccionDetallada && departamento ? departamento : undefined,
		// 		referencia: requiereDireccionDetallada && referencia ? referencia : undefined,
		// 		url_google_maps: requiereDireccionDetallada && urlGoogleMaps ? urlGoogleMaps : undefined,
		// 		localidad_id: localidad?.id_localidad,
		// 		localidad
		// 	};
		// 	dispatch('submit', direccion);
		// }, 800);
	}
</script>

<form
	on:submit={manejarEnvio}
	class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 md:p-10"
>
	<h3 class="mb-10 text-center text-xl font-semibold text-gray-800">Ubicación principal</h3>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Calle -->
		<!-- <div>
			<label for="calle" class="mb-2 block text-sm font-semibold text-gray-700"> Calle </label>
			<Input id="calle" bind:value={calle} error={intentoEnvio ? errores.calle : ''} />
		</div> -->

		<!-- Número -->
		<!-- <div>
			<label for="numero" class="mb-2 block text-sm font-semibold text-gray-700"> Número </label>
			<Input id="numero" bind:value={numero} error={intentoEnvio ? errores.numero : ''} />
		</div> -->

		<!-- Piso -->
		<!-- <div>
			<label for="piso" class="mb-2 block text-sm font-semibold text-gray-700">
				Piso (opcional)
			</label>
			<Input id="piso" bind:value={piso} placeholder="Ej: PB, 1, 2" />
		</div> -->

		<!-- Departamento -->
		<!-- <div>
			<label for="departamento" class="mb-2 block text-sm font-semibold text-gray-700">
				Departamento (opcional)
			</label>
			<Input id="departamento" bind:value={departamento} placeholder="Ej: A, B, 101" />
		</div> -->

		<!-- Provincia -->
		<div>
			<label for="departamento" class="mb-2 block text-sm font-semibold text-gray-700">
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
			/>
		</div>

		<!-- Localidad -->
		<div>
			<label for="departamento" class="mb-2 block text-sm font-semibold text-gray-700">
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
			/>
		</div>

		<!-- Referencia -->
		{#if requiereDireccionDetallada}
			<!-- Referencia -->
			<!-- <div class="md:col-span-2">
				<label for="referencia" class="mb-2 block text-sm font-semibold text-gray-700">
					Referencia (opcional)
				</label>
				<Input
					id="referencia"
					bind:value={referencia}
					placeholder="Ej: Edificio al lado de la plaza"
					customClass="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
				/>
			</div> -->
			<!-- Campo URL Google Maps -->
			<div class="md:col-span-2">
				<label for="urlGoogleMaps" class="mb-2 block text-sm font-semibold text-gray-700">
					URL de Google Maps (opcional)
				</label>
				<div class="relative">
					{#if editandoUrlMapaGoogle}
						<!-- Modo edición: Input -->
						<Input
							id="urlGoogleMaps"
							bind:value={urlGoogleMaps}
							placeholder="Se genera automáticamente"
							customClass="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
						/>
					{:else if urlGoogleMaps}
						<!-- Modo lectura: Enlace clickeable -->
						<a
							href={urlGoogleMaps}
							target="_blank"
							rel="noopener noreferrer"
							class="block w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-base text-blue-600 underline placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
						>
							{urlGoogleMaps}
						</a>
					{:else}
						<!-- Sin URL: solo texto informativo -->
						<p
							class="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-base italic text-gray-400"
						>
							Se genera automáticamente
						</p>
					{/if}

					<!-- Botón de edición -->
					<button
						type="button"
						on:click={() => (editandoUrlMapaGoogle = !editandoUrlMapaGoogle)}
						class="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-xl border border-gray-300 bg-gray-100 text-blue-600 transition-all duration-300 hover:bg-gray-200 focus:outline-none"
						aria-label={editandoUrlMapaGoogle ? 'Cancelar edición' : 'Editar URL'}
					>
						{#if editandoUrlMapaGoogle}
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						{:else}
							<svg
								width="45px"
								height="45px"
								viewBox="-9 -9 36.00 36.00"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								fill="#000000"
							>
								<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
								<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									<title>icon/18/icon-edit</title>
									<desc>Created with Sketch.</desc>
									<defs></defs>
									<g id="out" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
										<path
											d="M2.25,12.9378906 L2.25,15.75 L5.06210943,15.75 L13.3559575,7.45615192 L10.5438481,4.64404249 L2.25,12.9378906 Z M15.5306555,5.28145396 C15.8231148,4.98899458 15.8231148,4.5165602 15.5306555,4.22410082 L13.7758992,2.46934454 C13.4834398,2.17688515 13.0110054,2.17688515 12.718546,2.46934454 L11.3462366,3.84165394 L14.1583461,6.65376337 L15.5306555,5.28145396 Z"
											id="path"
											fill="#007fff"
										/>
									</g>
								</g>
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Vista previa del mapa -->
			{#if urlGoogleMaps && !editandoUrlMapaGoogle}
				<div
					class="relative mx-auto mt-10 aspect-square max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:shadow-2xl"
				>
					<div class="relative w-full overflow-hidden rounded-3xl bg-gray-200 shadow-md">
						<iframe
							src="{urlGoogleMaps}&output=embed"
							class="min-h-[350px] w-full border-0 sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px] xl:min-h-[580px]"
							title="Vista previa del mapa"
							allowfullscreen
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
						></iframe>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	<!-- Botones de acción -->
	<div class="mt-8 flex justify-end gap-4">
		{#if mostrarOmitir}
			<Button
				label={etiquetaOmitir}
				variant="secondary"
				size="md"
				on:click={() => dispatch('skip')}
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
