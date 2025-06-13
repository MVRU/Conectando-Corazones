<script lang="ts">
	export let proyecto;
	export let formatearFecha;
</script>

<div class="mb-8">
	<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">Descripción del Proyecto</h3>
	<p class="text-lg leading-relaxed text-gray-700">{proyecto.descripcion}</p>
</div>

<div class="mb-8 grid gap-6 md:grid-cols-2">
	<div class="rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Institución</h4>
		<p class="text-gray-700">{proyecto.institucion}</p>
	</div>
	<div class="rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Beneficiarios</h4>
		<p class="text-gray-700">{proyecto.beneficiarios} personas</p>
	</div>
	<div class="rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Fecha de inicio</h4>
		<p class="text-gray-700">{formatearFecha(proyecto.fechaInicio)}</p>
	</div>
	<div class="rounded-lg bg-gray-50 p-4">
		<h4 class="mb-2 font-semibold text-[rgb(var(--base-color))]">Fecha de cierre</h4>
		<p class="text-gray-700">{formatearFecha(proyecto.fechaCierre)}</p>
	</div>
</div>
