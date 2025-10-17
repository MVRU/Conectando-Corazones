<!--
* Página de landing page o "Mi panel" (por ahora se contempla el de institución para ppt)
-->
<script lang="ts">
	import InstitutionDashboard from '$lib/components/institucion/DashboardInstitucion.svelte';
</script>

<svelte:head>
	<title>Panel institucional - Conectando Corazones</title>
	<meta
		name="description"
		content="Panel institucional con métricas clave, objetivos y acciones sugeridas para organizaciones."
	/>
</svelte:head>
<InstitutionDashboard />
