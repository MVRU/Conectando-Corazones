<!--
* Componente: StepCard
	-*- Descripción: tarjeta visual para representar un paso numerado con fondo de imagen, título y descripción.
	-*- Funcionalidad: muestra el número del paso sobre una imagen. Incluye animación de zoom al hacer hover.

* Props:
	-*- stepNumber (number): número de orden del paso.
	-*- title (string): título del paso.
	-*- description (string): descripción detallada del paso.
	-*- image (string): ruta de la imagen de fondo.
-->

<script lang="ts">
	export let stepNumber: number;
	export let title: string;
	export let description: string;
	export let image: string;
</script>

<div class="group relative h-[420px] select-none overflow-hidden rounded-2xl shadow-md">
	<img
		src={image}
		alt={title}
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
	/>

	<div
		class="relative z-10 flex h-full flex-col justify-end space-y-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-5 text-white"
	>
		<div
			class="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-extrabold text-black shadow-lg"
		>
			{stepNumber}
		</div>
		<h3 class="text-lg font-semibold leading-snug">{title}</h3>
		<p class="text-sm leading-snug text-gray-100">{description}</p>
	</div>
</div>
