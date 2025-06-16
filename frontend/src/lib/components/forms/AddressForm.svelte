<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import {
		isValidStreet,
		isValidStreetNumber,
		isValidCityInProvince,
		ERROR_MESSAGES
	} from '$lib/utils/validators';
	import { getAllProvinceNames, getCitiesByProvince } from '$lib/utils/helpers';
	import { createEventDispatcher } from 'svelte';

	let sending = false;
	let isEditingMapUrl = false;
	let street = '';
	let streetNumber = '';
	let floorOrDepartment = '';
	let province = '';
	let location = '';
	let reference = '';
	let googleMapsUrl = '';

	const dispatch = createEventDispatcher();

	// Ciudades según provincia
	$: locations = province ? getCitiesByProvince(province) : [];

	// Genera la URL automáticamente
	$: {
		if (
			isValidStreet(street) &&
			isValidStreetNumber(streetNumber) &&
			isValidCityInProvince(location, province)
		) {
			const direccionCompleta = `${street} ${streetNumber}, ${location}, ${province}`;
			googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(direccionCompleta)}`;
		}
	}

	// Errores reactivos
	$: errors = {
		street: isValidStreet(street) ? '' : ERROR_MESSAGES.addressStreetInvalid,
		streetNumber: isValidStreetNumber(streetNumber) ? '' : ERROR_MESSAGES.addressNumberInvalid,
		province: province.trim() ? '' : ERROR_MESSAGES.provinceInvalid,
		location: isValidCityInProvince(location, province) ? '' : ERROR_MESSAGES.cityNotInProvince
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (hasErrors) return;

		sending = true;

		setTimeout(() => {
			sending = false;
			// Simula un envío exitoso

			dispatch('submit');
		}, 800);
	}
</script>

<form
	on:submit={handleSubmit}
	class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 md:p-10"
>
	<h3 class="mb-10 text-center text-xl font-semibold text-gray-800">
		Dirección de la institución u organización
	</h3>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Calle -->
		<div>
			<label for="street" class="mb-2 block text-sm font-semibold text-gray-700">
				Calle <span class="text-red-600">*</span>
			</label>
			<Input id="street" bind:value={street} error={errors.street} />
		</div>

		<!-- Número -->
		<div>
			<label for="streetNumber" class="mb-2 block text-sm font-semibold text-gray-700">
				Número <span class="text-red-600">*</span>
			</label>
			<Input id="streetNumber" bind:value={streetNumber} error={errors.streetNumber} />
		</div>

		<!-- Piso / Depto -->
		<div>
			<label for="floorOrDepartment" class="mb-2 block text-sm font-semibold text-gray-700">
				Piso / Departamento (opcional)
			</label>
			<Input id="floorOrDepartment" bind:value={floorOrDepartment} placeholder="Ej: PB / 3B" />
		</div>

		<!-- Provincia -->
		<div>
			<label for="province" class="mb-2 block text-sm font-semibold text-gray-700">
				Provincia <span class="text-red-600">*</span>
			</label>
			<select
				id="province"
				bind:value={province}
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
			>
				<option value="">Selecciona una provincia</option>
				{#each getAllProvinceNames() as prov}
					<option value={prov}>{prov}</option>
				{/each}
			</select>
			{#if errors.province}
				<p role="alert" class="mt-1 text-sm text-red-600">{errors.province}</p>
			{/if}
		</div>

		<!-- Ciudad -->
		<div>
			<label for="location" class="mb-2 block text-sm font-semibold text-gray-700">
				Ciudad <span class="text-red-600">*</span>
			</label>
			<select
				id="location"
				bind:value={location}
				disabled={!province}
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
			>
				<option value="">Selecciona una ciudad</option>
				{#each locations as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
			{#if errors.location}
				<p role="alert" class="mt-1 text-sm text-red-600">{errors.location}</p>
			{/if}
		</div>

		<!-- Referencia -->
		<div class="md:col-span-2">
			<label for="reference" class="mb-2 block text-sm font-semibold text-gray-700">
				Referencia (opcional)
			</label>
			<input
				id="reference"
				bind:value={reference}
				placeholder="Ej: Edificio al lado de la plaza"
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
			/>
		</div>

		<!-- Campo URL Google Maps -->
		<div class="md:col-span-2">
			<label for="googleMapsUrl" class="mb-2 block text-sm font-semibold text-gray-700">
				URL de Google Maps (opcional)
			</label>
			<div class="relative">
				{#if isEditingMapUrl}
					<!-- Modo edición: Input -->
					<input
						id="googleMapsUrl"
						bind:value={googleMapsUrl}
						placeholder="Se genera automáticamente"
						class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
					/>
				{:else if googleMapsUrl}
					<!-- Modo lectura: Enlace clickeable -->
					<a
						href={googleMapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="block w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-base text-blue-600 underline placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
					>
						{googleMapsUrl}
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
					on:click={() => (isEditingMapUrl = !isEditingMapUrl)}
					class="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-xl border border-gray-300 bg-gray-100 text-blue-600 transition-all duration-300 hover:bg-gray-200 focus:outline-none"
					aria-label={isEditingMapUrl ? 'Cancelar edición' : 'Editar URL'}
				>
					{#if isEditingMapUrl}
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
	</div>

	<!-- Botón de envío -->
	<div class="mt-8 flex justify-end">
		<Button
			label={sending ? 'Guardando...' : 'Continuar'}
			variant="primary"
			size="md"
			disabled={sending || hasErrors}
			customClass="w-full md:w-auto"
			href="/"
		/>
	</div>
</form>
