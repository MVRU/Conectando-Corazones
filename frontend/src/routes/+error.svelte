<!--
* DECISIÓN DE DISEÑO: se centraliza el manejo de errores para que 404 y 500 usen la misma vista.
-!- Riesgo: otros códigos HTTP compartirán la presentación genérica.
-->

<script lang="ts">
	export let error: Error;
	export let status: number;
	import ErrorPage from '$lib/components/errors/ErrorPage.svelte';
</script>

<ErrorPage {status} message={error.message} />
