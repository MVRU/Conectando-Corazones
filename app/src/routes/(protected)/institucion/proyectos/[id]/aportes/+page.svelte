<script lang="ts">
	import AportesList from '$lib/components/feature/aportes/AportesList.svelte';
	let { data } = $props();
</script>

<AportesList colaboradores={data.colaboradores} />
