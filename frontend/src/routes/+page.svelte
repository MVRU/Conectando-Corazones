<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
</script>

<!-- TO-DO: borrar todo esto después, es solo de prueba. Esta es la página HOME o INICIO -->
<div class="m-4">
	<h2>Inicio</h2>
	<h6>Esto es de prueba...</h6>

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
