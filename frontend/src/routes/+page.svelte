<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Bagde from '$lib/components/ui/Badge.svelte';
	import Ticker from '$lib/components/visual/Ticker.svelte';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];

	// Establecer breadcrumbs al montar la página
	onMount(() => {
		setBreadcrumbs([
			{ label: 'Inicio' } // Sin href porque es la página actual
		]);
	});
</script>

<div class="m-4">
	<h2 class="text-[rgb(var(--base-color))]">Inicio</h2>
	<h6>Esto es de prueba...</h6>

	<Ticker {logos} />

	<Bagde text="Cada acción cuenta, empezá la tuya" />

	<Button label="Botón primario" />

	<div class="mt-4">
		<Image
			src="https://framerusercontent.com/images/dwZui6vRJBZAaMuIKjbS43NrTI.jpg"
			width="200px"
			alt="Imagen de prueba"
			animate="zoom"
			variant="default"
		/>
	</div>
</div>
