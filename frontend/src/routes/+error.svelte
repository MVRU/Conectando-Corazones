<!--
* DECISIÓN DE DISEÑO: se centraliza el manejo de errores para que 404 y 500 usen la misma vista.
-!- Riesgo: otros códigos HTTP compartirán la presentación genérica.
-->

<script lang="ts">
	export let data: { error: Error; estado: number };
	import PaginaError from '$lib/components/errores/PaginaError.svelte';

	const { error, estado } = data;
</script>

<PaginaError {estado} mensaje={error?.message} />
