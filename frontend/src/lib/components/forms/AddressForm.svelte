<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let calle = '';
	let numero = '';
	let piso = '';
	let provincia = '';
	let ciudad = '';
	let sending = false;

	// Lista de provincias
	const provinciasArgentinas = [
		'Buenos Aires',
		'Ciudad de Buenos Aires',
		'Catamarca',
		'Chaco',
		'Chubut',
		'Córdoba',
		'Corrientes',
		'Entre Ríos',
		'Formosa',
		'Jujuy',
		'La Pampa',
		'La Rioja',
		'Mendoza',
		'Misiones',
		'Neuquén',
		'Río Negro',
		'Salta',
		'San Juan',
		'San Luis',
		'Santa Cruz',
		'Santa Fe',
		'Santiago del Estero',
		'Tierra del Fuego',
		'Tucumán'
	];

	// Definimos el objeto con firma de índice
	const ciudadesPorProvincia: Record<string, string[]> = {
		'Buenos Aires': ['La Plata', 'Mar del Plata', 'Bahía Blanca'],
		Córdoba: ['Córdoba Capital', 'Villa María', 'Río Cuarto'],
		'Santa Fe': ['Santa Fe', 'Rosario', 'Santo Tomé'],
		'Ciudad de Buenos Aires': ['Palermo', 'Recoleta', 'San Telmo']
	};

	// Ciudades según provincia seleccionada
	$: ciudades = provincia in ciudadesPorProvincia ? ciudadesPorProvincia[provincia] : [];

	// Errores
	$: errors = {
		calle: calle.trim() ? '' : 'La calle es obligatoria',
		numero: numero.trim() ? '' : 'El número es obligatorio',
		provincia: provincia.trim() ? '' : 'Selecciona una provincia',
		ciudad: ciudad.trim() ? '' : 'Selecciona una ciudad'
	};

	$: hasErrors = Object.values(errors).some((error) => error !== '');

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (hasErrors) return;

		sending = true;

		// Hacer fetch a API o guardar temporalmente
		setTimeout(() => {
			sending = false;
			const direccion = { calle, numero, piso, provincia, ciudad };
			dispatch('submit', direccion);
		}, 800);
	}
</script>

<form on:submit={handleSubmit} class="rounded-xl bg-white p-6 shadow-md">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<label for="calle" class="mb-2 block text-sm font-semibold text-gray-700"
				>Calle <span class="text-red-600">*</span></label
			>
			<Input id="calle" bind:value={calle} error={errors.calle} />
		</div>

		<div>
			<label for="numero" class="mb-2 block text-sm font-semibold text-gray-700"
				>Número <span class="text-red-600">*</span></label
			>
			<Input id="numero" bind:value={numero} error={errors.numero} />
		</div>

		<div>
			<label for="piso" class="mb-2 block text-sm font-semibold text-gray-700"
				>Piso / Depto (opcional)</label
			>
			<Input id="piso" bind:value={piso} placeholder="Ej: 3B" />
		</div>

		<div>
			<label for="provincia" class="mb-2 block text-sm font-semibold text-gray-700"
				>Provincia <span class="text-red-600">*</span></label
			>
			<select
				id="provincia"
				bind:value={provincia}
				class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-base text-black transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
			>
				<option value="">Selecciona una provincia</option>
				{#each provinciasArgentinas as prov}
					<option value={prov}>{prov}</option>
				{/each}
			</select>
			{#if errors.provincia}
				<p class="mt-1 text-sm text-red-600">{errors.provincia}</p>
			{/if}
		</div>

		<div>
			<label for="ciudad" class="mb-2 block text-sm font-semibold text-gray-700"
				>Ciudad <span class="text-red-600">*</span></label
			>
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
				<p class="mt-1 text-sm text-red-600">{errors.ciudad}</p>
			{/if}
		</div>
	</div>

	<div class="mt-8 flex justify-end">
		<Button
			label={sending ? 'Guardando...' : 'Continuar'}
			disabled={sending || hasErrors}
			href="contact-methods"
		/>
	</div>
</form>
