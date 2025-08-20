<script lang="ts">
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ColaboradorDisyuncion, Organizacion, Unipersonal } from '$lib/types/Usuario';
	
	export let proyecto: Proyecto;
	export let formatearFecha: (fecha: Date | string | undefined) => string;

	// -*- Ubicación normalizada para evitar comprobaciones repetidas
	$: ubicacionPrincipal = proyecto.ubicaciones?.[0];
	$: ciudad = ubicacionPrincipal?.direccion?.localidad?.nombre ?? 'Ciudad';
	$: provincia = ubicacionPrincipal?.direccion?.localidad?.provincia?.nombre ?? 'Provincia';

	const colaboradores = proyecto.colaboraciones?.map((c) => c.colaborador).filter((c): c is ColaboradorDisyuncion => !!c) ?? [];

	/**
	 * * Obtiene el nombre de visualización de un colaborador
	 * * Si es organización → muestra razon_social
	 * * Si es unipersonal → muestra nombre + apellido
	 */
	function obtenerNombreColaborador(colaborador: ColaboradorDisyuncion): string {
		
		// Para Organizacion
		if ('razon_social' in colaborador && colaborador.razon_social) {
			return colaborador.razon_social;
		}
		
		// Para Unipersonal o cualquier otro caso, usar nombre + apellido
		return `${colaborador.nombre} ${colaborador.apellido}`.trim() || 'Colaborador';
	}
</script>

<!-- Descripción -->
<section class="animate-fade-up mb-10">
	<h2 class="mb-4 text-2xl font-semibold text-gray-800 sm:text-xl">Descripción del Proyecto</h2>
	<p class="text-sm leading-relaxed text-gray-700 sm:text-base">
		{proyecto.descripcion}
	</p>
</section>

<!-- Detalles del proyecto -->
<div class="grid gap-5 sm:grid-cols-2">
	<!-- Card: Institución -->
	<div
		class="animate-fade-up rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
		style="animation-delay: 100ms"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Institución</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">🏛️</span>
			{proyecto.institucion?.nombre_legal || proyecto.institucion?.nombre || 'No disponible'}
		</p>
	</div>

	<!-- Card: Categorías -->
	<div
		class="animate-fade-up rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
		style="animation-delay: 300ms"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Categorías</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">🏷️</span>
			{#if proyecto.categorias && proyecto.categorias.length > 0}
				{proyecto.categorias.map((c) => c.descripcion).join(', ')}
			{:else}
				Sin especificar
			{/if}
		</p>
	</div>

	<!-- Card: Fecha de inicio -->
	<div
		class="animate-fade-up rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
		style="animation-delay: 400ms"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
			Fecha de Inicio
		</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">📅</span>
			{formatearFecha(proyecto.created_at) || '—'}
		</p>
	</div>

	<!-- Card: Fecha de cierre -->
	<div
		class="animate-fade-up rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
		style="animation-delay: 400ms"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
			Fecha de Cierre Tentativa
		</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">⏳</span>
			{formatearFecha(proyecto.fecha_fin_tentativa) || '—'}
		</p>
	</div>

	<!-- Card: Colaboradores -->
	<div
		class="animate-fade-up rounded-lg border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
		style="animation-delay: 500ms"
	>
		<h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Colaboradores</h4>
		<p class="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
			<span class="text-lg">🤝</span>
			{#if colaboradores.length > 0}
				{colaboradores.map(obtenerNombreColaborador).join(', ')}
			{:else}
				Sin colaboradores
			{/if}
		</p>
	</div>
</div>

<style>
	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-up {
		animation: fade-up 0.4s ease-out both;
	}
</style>
