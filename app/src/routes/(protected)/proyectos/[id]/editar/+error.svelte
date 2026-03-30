<script lang="ts">
	import { page } from '$app/stores';
	import PaginaError from '$lib/components/ui/feedback/errores/PaginaError.svelte';

	let estado = $derived($page.status);
	let mensaje = $derived($page.error?.message);
</script>

<PaginaError {estado} {mensaje} />
