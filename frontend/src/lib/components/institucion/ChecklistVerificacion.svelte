<script lang="ts">
	export let checks: Record<string, boolean>;
	export let onUpdate: (checks: Record<string, boolean>) => void = () => {};

	// Definición de items del checklist
	const checklistItems = [
		{
			key: 'evidenciasSuficientes',
			label:
				'Para cada objetivo del proyecto, se cargaron evidencias suficientes (ej.: fotos, comprobantes, facturas, documentos).'
		},
		{
			key: 'archivosLegibles',
			label: 'Todos los archivos son legibles, correctos y pertinentes.'
		},
		{
			key: 'evidenciasRespaldadas',
			label:
				'Se revisó que las evidencias respaldan adecuadamente los aportes recibidos de los colaboradores.'
		},
		{
			key: 'noRequiereMasEvidencias',
			label: 'Se confirma que el proyecto ya no requiere más carga de evidencias.'
		},
		{
			key: 'conformidadRevision',
			label: 'Se da conformidad para que el sistema lo envíe a revisión de los colaboradores.'
		}
	];

	$: completados = Object.values(checks).filter((c) => c).length;
	$: totalItems = checklistItems.length;
	$: todosCompletos = completados === totalItems;

	function handleCheckChange(key: string, value: boolean) {
		checks = { ...checks, [key]: value };
		onUpdate(checks);
	}
</script>

<div class="space-y-4">
	<div class="mb-4 flex items-center gap-2">
		<svg
			class="h-5 w-5 text-blue-600"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
			/>
		</svg>
		<h2 class="text-lg font-semibold text-gray-900">Lista de verificación</h2>
	</div>

	<!-- Items del checklist -->
	<div class="space-y-2">
		{#each checklistItems as item}
			<label
				class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50"
			>
				<input
					type="checkbox"
					checked={checks[item.key]}
					on:change={(e) => handleCheckChange(item.key, e.currentTarget.checked)}
					class="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
				/>
				<span class="text-sm leading-relaxed text-gray-700">
					{item.label}
				</span>
			</label>
		{/each}
	</div>

	<!-- Indicador de progreso -->
	<div class="mt-4 border-t border-gray-100 pt-4">
		<div class="flex items-center justify-between text-sm">
			<span class="text-gray-500">
				Completado: {completados} / {totalItems}
			</span>
			<span
				class="font-medium"
				class:text-green-600={todosCompletos}
				class:text-gray-400={!todosCompletos}
			>
				{todosCompletos ? '✓ Listo' : 'Pendiente'}
			</span>
		</div>
	</div>
</div>
