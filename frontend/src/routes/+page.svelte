<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Bagde from '$lib/components/ui/Bagde.svelte';
</script>

<!-- TO-DO: borrar todo esto después, es solo de prueba. Esta es la página HOME o INICIO -->
<div class="m-4">
	<h2 class="text-[rgb(var(--base-color))]">Inicio</h2>
	<h6>Esto es de prueba...</h6>

	<Bagde text="Cada acción cuenta, empezá la tuya"></Bagde>

	<Button label="Botón primario"></Button>

	<div class="mt-4">
		<Image
			src="https://framerusercontent.com/images/dwZui6vRJBZAaMuIKjbS43NrTI.jpg"
			width="200px"
			alt="Imagen de prueba"
			animate="zoom"
			variant="default"
		></Image>
	</div>
</div>
