<script lang="ts">
	import ContactMethodsForm from '$lib/components/forms/ContactMethodsForm.svelte';
	import { goto } from '$app/navigation';

	interface Contacto {
		tipo: string;
		valor: string;
		etiqueta?: string | null;
	}

	function onSubmit(contactos: CustomEvent<Contacto[]>) {
		const data = contactos.detail;
		console.log('Contactos guardados:', data);
	}
</script>

<div class="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
	<h2 class="text-center text-3xl font-extrabold text-gray-900">Agregá formas de contacto</h2>
	<p class="mx-auto max-w-2xl text-center text-base text-gray-600">
		Agregá al menos un número de teléfono. Podés incluir otros medios como redes sociales o emails
		secundarios.
	</p>

	<ContactMethodsForm on:submit={onSubmit} />
</div>
