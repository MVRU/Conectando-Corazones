<script lang="ts">
	export let proyecto;
	export let formatearFecha;
</script>

<!-- Descripción -->
<section class="mb-10">
	<h2 class="mb-4 text-2xl font-semibold text-gray-800 sm:text-xl">Descripción del Proyecto</h2>
	<p class="text-sm leading-relaxed text-gray-700 sm:text-base">
		{proyecto.descripcion}
	</p>
</section>

<!-- Detalles del proyecto -->
<section class="grid gap-5 sm:grid-cols-2">
	<!-- Card: Institución -->
	<div
		class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Institución</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">🏛️</span>
			{proyecto.institucion?.razonSocial || 'No disponible'}
		</p>
	</div>

	<!-- Card: Beneficiarios -->
	<div
		class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Beneficiarios</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">👥</span>
			{proyecto.beneficiarios ? `${proyecto.beneficiarios} personas` : 'Sin especificar'}
		</p>
	</div>

	<!-- Card: Fecha de inicio -->
	<div
		class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
			Fecha de Inicio
		</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">📅</span>
			{formatearFecha(proyecto.fechaInicio) || '—'}
		</p>
	</div>

	<!-- Card: Fecha de cierre -->
	<div
		class="rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
			Fecha de Cierre
		</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">⏳</span>
			{formatearFecha(proyecto.fechaCierre) || '—'}
		</p>
	</div>
</section>
