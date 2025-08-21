<!--

	FIX: corregir para que coincida con DER

* Componente: ColaboradoresActivos
  -*- Descripción: Lista de colaboradores activos en el proyecto
-->

<script lang="ts">
	import type { ColaboradorActivo } from '$lib/types/Postulacion'; // FIX: usar Colaboracion

	export let colaboradoresActivos: ColaboradorActivo[] = [];

	// TODO: centralizar esta función pq se está creando muchas veces
	function formatearFecha(fecha: string): string {
		return new Date(fecha).toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function getTipoIcon(tipo: string): string {
		return tipo === 'persona' ? '👤' : '🏢';
	}

	function getTipoLabel(tipo: string): string {
		return tipo === 'persona' ? 'Persona' : 'Organización';
	}

	function calcularDiasActivo(fecha: string): number {
		const fechaAceptacion = new Date(fecha);
		const hoy = new Date();
		const diferencia = hoy.getTime() - fechaAceptacion.getTime();
		return Math.floor(diferencia / (1000 * 3600 * 24));
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white shadow-sm">
	<div class="border-b border-gray-200 px-6 py-4">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">Colaboradores activos</h2>
			<span
				class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
			>
				{colaboradoresActivos.length} activo{colaboradoresActivos.length !== 1 ? 's' : ''}
			</span>
		</div>
	</div>

	<div class="divide-y divide-gray-200">
		{#if colaboradoresActivos.length === 0}
			<div class="px-6 py-12 text-center">
				<div class="mb-4 text-4xl">🤝</div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Aún no tienes colaboradores</h3>
				<p class="text-gray-500">
					Los colaboradores aceptados aparecerán aquí. Revisa las postulaciones pendientes para
					encontrar personas dispuestas a ayudar.
				</p>
			</div>
		{:else}
			{#each colaboradoresActivos as colaborador (colaborador.id)}
				<div class="px-6 py-4">
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3">
							<span class="text-2xl">{getTipoIcon(colaborador.tipo)}</span>
							<div>
								<h3 class="text-base font-medium text-gray-900">
									{colaborador.nombre}
								</h3>
								<p class="text-sm text-gray-500">
									{getTipoLabel(colaborador.tipo)}
								</p>
								<p class="mt-1 text-xs text-gray-400">
									Colaborando desde el {formatearFecha(colaborador.fechaAceptacion)}
									({calcularDiasActivo(colaborador.fechaAceptacion)} días)
								</p>
							</div>
						</div>

						<div class="flex items-center gap-2">
							<span
								class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
							>
								✓ Activo
							</span>
							<button
								class="text-gray-400 transition-colors hover:text-gray-600"
								title="Ver detalles del colaborador"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</button>
						</div>
					</div>

					{#if colaborador.email}
						<div class="mt-3 pl-11">
							<p class="text-sm text-gray-600">
								<span class="font-medium">Email:</span>
								<a
									href="mailto:{colaborador.email}"
									class="text-blue-600 transition-colors hover:text-blue-800"
								>
									{colaborador.email}
								</a>
							</p>
						</div>
					{/if}

					{#if colaborador.telefono}
						<div class="mt-1 pl-11">
							<p class="text-sm text-gray-600">
								<span class="font-medium">Teléfono:</span>
								<a
									href="tel:{colaborador.telefono}"
									class="text-blue-600 transition-colors hover:text-blue-800"
								>
									{colaborador.telefono}
								</a>
							</p>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>

	{#if colaboradoresActivos.length > 0}
		<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-600">
					Total de colaboradores: {colaboradoresActivos.length}
				</span>
				<button class="font-medium text-blue-600 transition-colors hover:text-blue-800">
					Contactar a todos
				</button>
			</div>
		</div>
	{/if}
</div>
