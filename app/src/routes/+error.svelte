<!--
* DECISIÓN DE DISEÑO: se centraliza el manejo de errores para que 404 y 500 usen la misma vista.
-!- Riesgo: otros códigos HTTP compartirán la presentación genérica.
-->

<script lang="ts">
	import PaginaError from '$lib/components/ui/feedback/errores/PaginaError.svelte';

	let { data }: { data: { error: Error; estado: number } } = $props();

	let error = $derived(data.error);
	let estado = $derived(data.estado);
</script>

<PaginaError {estado} mensaje={error?.message} />
