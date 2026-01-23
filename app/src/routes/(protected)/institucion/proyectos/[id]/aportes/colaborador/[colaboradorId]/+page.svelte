<script lang="ts">
	import { page } from "$app/stores";
	import AportesList from '$lib/components/feature/aportes/AportesList.svelte';
	import ModalDetalle from '$lib/components/feature/aportes/ModalDetalle.svelte';

	let { data } = $props();
	let colaboradorId = $derived($page.params.colaboradorId);
</script>

<AportesList colaboradores={data.colaboradores} />
<ModalDetalle {colaboradorId} {data} />
