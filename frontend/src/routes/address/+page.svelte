<script lang="ts">
	import AddressForm from '$lib/components/forms/AddressForm.svelte';
	import { goto } from '$app/navigation';

	interface Direccion {
		calle: string;
		numero: string;
		piso: string;
		provincia: string;
		ciudad: string;
	}

	function onSubmit(event: CustomEvent<Direccion>) {
		const data = event.detail;
		console.log('Dirección guardada:', data);
	}
</script>

<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="text-center text-3xl font-extrabold text-gray-900">Ingresá la dirección de la sede</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Completá con la dirección principal donde funciona la institución u organización. Más adelante
		podrás agregar otras direcciones si lo preferís.
	</p>

	<AddressForm on:submit={onSubmit} />
</div>
