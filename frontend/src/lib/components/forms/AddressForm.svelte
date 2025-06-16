<!-- AddressForm.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { getCitiesByProvince, getAllProvinceNames } from '$lib/utils/helpers';

	import {
		isValidStreet,
		isValidStreetNumber,
		isValidCityInProvince,
		ERROR_MESSAGES
	} from '$lib/utils/validators';

	let sending = false;
	let calle = '';
	let numero = '';
	let piso = '';
	let provincia = '';
	let ciudad = '';

	$: ciudades = provincia ? getCitiesByProvince(provincia) : [];

	const dispatch = createEventDispatcher();

	// Errores reactivos
	$: errors = {
		calle: isValidStreet(calle) ? '' : ERROR_MESSAGES.addressStreetInvalid,
		numero: isValidStreetNumber(numero) ? '' : ERROR_MESSAGES.addressNumberInvalid,
		provincia: provincia.trim() ? '' : ERROR_MESSAGES.provinceInvalid,
		ciudad: isValidCityInProvince(ciudad, provincia) ? '' : ERROR_MESSAGES.cityNotInProvince
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (hasErrors) return;

		sending = true;

		setTimeout(() => {
			sending = false;
			dispatch('submit', {
				calle,
				numero,
				piso,
				provincia,
				ciudad
			});
		}, 800);
	}
</script>

<form
	on:submit={handleSubmit}
	class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 md:p-10"
>
	<h3 class="mb-6 text-center text-xl font-semibold text-gray-800">Dirección de la institución</h3>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Calle -->
		<div>
			<label for="calle" class="mb-2 block text-sm font-semibold text-gray-700">
				Calle <span class="text-red-600">*</span>
			</label>
			<Input id="calle" bind:value={calle} error={errors.calle} />
		</div>

		<!-- Número -->
		<div>
			<label for="numero" class="mb-2 block text-sm font-semibold text-gray-700">
				Número <span class="text-red-600">*</span>
			</label>
			<Input id="numero" bind:value={numero} error={errors.numero} />
		</div>

		<!-- Piso -->
		<div>
			<label for="piso" class="mb-2 block text-sm font-semibold text-gray-700">
				Piso / Depto (opcional)
			</label>
			<Input id="piso" bind:value={piso} placeholder="Ej: PB / 3B" />
		</div>

		<!-- Provincia -->
		<div>
			<label for="provincia" class="mb-2 block text-sm font-semibold text-gray-700">
				Provincia <span class="text-red-600">*</span>
			</label>
			<select
				id="provincia"
				bind:value={provincia}
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
			>
				<option value="">Selecciona una provincia</option>
				{#each getAllProvinceNames() as prov}
					<option value={prov}>{prov}</option>
				{/each}
			</select>
			{#if errors.provincia}
				<p role="alert" class="mt-1 text-sm text-red-600">{errors.provincia}</p>
			{/if}
		</div>

		<!-- Ciudad -->
		<div>
			<label for="ciudad" class="mb-2 block text-sm font-semibold text-gray-700">
				Ciudad <span class="text-red-600">*</span>
			</label>
			<select
				id="ciudad"
				bind:value={ciudad}
				disabled={!provincia}
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
			>
				<option value="">Selecciona una ciudad</option>
				{#each ciudades as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
			{#if errors.ciudad}
				<p role="alert" class="mt-1 text-sm text-red-600">{errors.ciudad}</p>
			{/if}
		</div>
	</div>

	<!-- Botón de envío -->
	<div class="mt-8 flex justify-end">
		<Button
			label={sending ? 'Guardando...' : 'Continuar'}
			disabled={sending || hasErrors}
			variant="primary"
			size="md"
			href="/contact-methods"
		/>
	</div>
</form>
