<script lang="ts">
	export let proyecto;
	export let formatearFecha;
</script>

<!-- Descripción -->
<section class="mb-10">
	<h3 class="mb-3 text-xl font-bold text-[rgb(var(--base-color))]">Descripción del Proyecto</h3>
	<p class="text-base leading-relaxed text-gray-700 sm:text-lg sm:leading-8">
		{proyecto.descripcion}
	</p>
</section>

<!-- Detalles del proyecto -->
<section class="mb-10 grid gap-4 sm:grid-cols-2">
	<!-- Card: Institución -->
	<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
		<h4 class="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">Institución</h4>
		<p class="text-base font-semibold text-gray-800">{proyecto.institucion}</p>
	</div>

	<!-- Card: Beneficiarios -->
	<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
		<h4 class="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">Beneficiarios</h4>
		<p class="text-base font-semibold text-gray-800">{proyecto.beneficiarios} personas</p>
	</div>

	<!-- Card: Fecha de inicio -->
	<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
		<h4 class="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">Inicio</h4>
		<p class="text-base font-semibold text-gray-800">{formatearFecha(proyecto.fechaInicio)}</p>
	</div>

	<!-- Card: Fecha de cierre -->
	<div class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
		<h4 class="mb-1 text-sm font-medium uppercase tracking-wide text-gray-500">Cierre</h4>
		<p class="text-base font-semibold text-gray-800">{formatearFecha(proyecto.fechaCierre)}</p>
	</div>
</section>
