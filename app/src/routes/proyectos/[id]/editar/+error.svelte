<script lang="ts">
	import { page } from '$app/stores';
	import PaginaError from '$lib/components/feedback/errores/PaginaError.svelte';

	$: estado = $page.status;
	$: mensaje = $page.error?.message;
</script>

<PaginaError {estado} {mensaje} />
