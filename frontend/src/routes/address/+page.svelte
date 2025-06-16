<script lang="ts">
	import AddressForm from '$lib/components/forms/AddressForm.svelte';

	// Estado para controlar la carga
	let sending = false;
</script>

<!-- Fondo principal -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<!-- Reflejo en la parte inferior -->
<div
	class="absolute bottom-0 left-0 right-0 top-[80%] -z-10 bg-gradient-to-t from-blue-50 via-white to-transparent"
	style="background-size: 100% 400px; background-repeat: repeat-y;"
></div>

<!-- Contenido principal -->
<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
	<!-- Título -->
	<div class="text-center">
		<h2 class="mb-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
			Ingresá la dirección de la sede
		</h2>
		<p class="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
			Completá con la dirección principal donde funciona la institución u organización. Más adelante
			podrás agregar otras direcciones si lo preferís.
		</p>
	</div>

	<AddressForm />
</div>
