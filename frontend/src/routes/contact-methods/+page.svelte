<script lang="ts">
	import ContactMethodsForm from '$lib/components/forms/ContactMethodsForm.svelte';
	import { goto } from '$app/navigation';

	interface Contacto {
		tipo: string;
		valor: string;
		etiqueta?: string | null;
	}
</script>

<!-- Fondo decorativo infinito -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<!-- Reflejo suave en el fondo inferior -->
<div
	class="absolute bottom-0 left-0 right-0 top-[80%] -z-10 bg-gradient-to-t from-blue-50 via-white to-transparent"
	style="background-size: 100% 400px; background-repeat: repeat-y;"
></div>

<main class="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="text-center text-3xl font-extrabold text-gray-900">Agregá formas de contacto</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Agregá al menos un número de teléfono. Podés incluir otros medios como redes sociales o emails
		secundarios.
	</p>

	<ContactMethodsForm />
</main>
