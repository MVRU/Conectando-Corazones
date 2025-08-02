<script lang="ts">
	// * DECISIÓN DE DISEÑO
	// - Utiliza formulario accesible para permitir envío con Enter.
	// - Sanitiza el contenido para mitigar XSS.
	// TODO: Sustituir sanitización manual por librería dedicada.
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ send: string }>();
	let text = '';

	function sanitize(input: string): string {
		const div = document.createElement('div');
		div.textContent = input;
		return div.innerHTML;
	}

	function submit() {
		const clean = sanitize(text.trim());
		if (!clean) return;
		dispatch('send', clean);
		text = '';
	}
</script>

<form class="flex gap-2 border-t p-4" on:submit|preventDefault={submit}>
	<input
		bind:value={text}
		type="text"
		placeholder="Escribe un mensaje"
		class="flex-1 rounded border px-2 py-1"
		aria-label="Escribe un mensaje"
	/>
	<button
		type="submit"
		class="rounded bg-blue-600 px-4 py-1 text-white"
		aria-label="Enviar mensaje"
	>
		Enviar
	</button>
</form>
