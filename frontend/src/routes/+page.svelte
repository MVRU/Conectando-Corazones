<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Bagde from '$lib/components/ui/Badge.svelte';
	import Ticker from '$lib/components/visual/Ticker.svelte';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];
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
