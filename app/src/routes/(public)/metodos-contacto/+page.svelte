<script lang="ts">
	import MetodosContactoForm from '\$lib/components/ui/forms/MetodosContactoForm.svelte';
</script>

<!-- Fondo decorativo infinito -->
<div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

<!-- Reflejo suave en el fondo inferior -->
<div
	class="absolute top-[80%] right-0 bottom-0 left-0 -z-10 bg-gradient-to-t from-blue-50 via-white to-transparent"
	style="background-size: 100% 400px; background-repeat: repeat-y;"
></div>

<main class="relative z-10 mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="text-center text-3xl font-extrabold text-gray-900">Agregá formas de contacto</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Agregá al menos un número de teléfono. Podés incluir otros medios como redes sociales o emails
		secundarios.
	</p>

	<MetodosContactoForm />
</main>

