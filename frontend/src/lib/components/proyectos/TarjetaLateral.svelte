<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import type { Proyecto } from '$lib/types/Proyecto';
	import type { ParticipacionPermitida } from '$lib/types/ParticipacionPermitida';
	import { getEstadoCodigo } from '$lib/utils/util-estados';

	export let proyecto: Proyecto;
	export let mostrarFormulario: () => void;

	const unidadEmoji: Record<string, string> = {
		libros: '📚',
		colchones: '🛏️',
		alimentos: '🍽️',
		juguetes: '🧸',
		computadoras: '💻',
		prendas: '👕',
		medicamentos: '💊',
		herramientas: '🔧',
		utiles: '✏️',
		personas: '🙋‍♀️',
		kilogramos: '⚖️',
		unidades: '📦',
		pesos: '💰',
		dolares: '💵'
	};

	const participaciones = proyecto.participacion_permitida ?? [];
	const tieneUnSoloObjetivo = participaciones.length === 1;
	const multiplesObjetivos = participaciones.length > 1;
	const unicoObjetivo = tieneUnSoloObjetivo ? participaciones[0] : null;

	function getUnidadInfo(obj: ParticipacionPermitida | null, multiples: boolean) {
		if (multiples) {
			return {
				bg: 'bg-yellow-50',
				border: 'border-yellow-200',
				text: 'text-yellow-800',
				icon: '🤝',
				label: 'ayuda múltiple (donaciones, materiales o voluntariado)',
				button: 'Colaborar ahora'
			};
		}
		if (!obj)
			return {
				bg: 'bg-gray-50',
				border: 'border-gray-200',
				text: 'text-gray-800',
				icon: '❓',
				label: 'colaboración',
				button: 'Colaborar'
			};
		const tipo = obj.tipo_participacion?.descripcion?.toLowerCase() || '';
		if (tipo === 'Voluntariado') {
			return {
				bg: 'bg-purple-50',
				border: 'border-purple-200',
				text: 'text-purple-800',
				icon: '🙋‍♀️',
				label: 'voluntariado',
				button: 'Postularme como voluntario'
			};
		}
		if (tipo === 'Especie') {
			const unidad = obj.unidad || 'materiales';
			return {
				bg: 'bg-blue-50',
				border: 'border-blue-200',
				text: 'text-blue-800',
				icon: unidadEmoji[unidad.toLowerCase()] || '📦',
				label: unidad ? `donaciones de ${unidad}` : 'donaciones específicas',
				button: 'Donar materiales'
			};
		}
		if (tipo === 'Monetaria') {
			const unidad = obj.unidad || 'pesos';
			return {
				bg: 'bg-green-50',
				border: 'border-green-200',
				text: 'text-green-800',
				icon: unidadEmoji[unidad.toLowerCase()] || '💰',
				label: `donaciones monetarias (${unidad})`,
				button: 'Donar ahora'
			};
		}
		return {
			bg: 'bg-gray-50',
			border: 'border-gray-200',
			text: 'text-gray-800',
			icon: '❓',
			label: 'colaboración',
			button: 'Colaborar'
		};
	}

	const unidadInfo = getUnidadInfo(unicoObjetivo, multiplesObjetivos);

	function ProyectoAbierto() {
		// Estado válido para colaborar: 'en_curso'
		return getEstadoCodigo(proyecto.estado, proyecto.id_estado) === 'en_curso';
	}
</script>

<div
	class="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
>
	<h3 class="mb-4 text-center text-lg font-semibold text-gray-800">¿Querés colaborar?</h3>

	{#if multiplesObjetivos}
		<div class={`mb-5 flex items-start gap-3 rounded-lg p-3 ${unidadInfo.bg} ${unidadInfo.border}`}>
			<span class="text-xl">{unidadInfo.icon}</span>
			<p class={`text-sm ${unidadInfo.text}`}>
				Este proyecto necesita <strong>{unidadInfo.label}</strong>.
			</p>
		</div>
	{:else if tieneUnSoloObjetivo}
		<div class={`mb-5 flex items-start gap-3 rounded-lg p-3 ${unidadInfo.bg} ${unidadInfo.border}`}>
			<span class="text-xl">{unidadInfo.icon}</span>
			<p class={`text-sm ${unidadInfo.text}`}>
				Este proyecto necesita <strong>{unidadInfo.label}</strong>.
				{#if unicoObjetivo}
					<span class="mt-1 block text-xs text-gray-500">
						Objetivo: {unicoObjetivo.objetivo}
						{unicoObjetivo.unidad}
						{#if unicoObjetivo.actual !== undefined}
							&nbsp;|&nbsp; Actual: {unicoObjetivo.actual} {unicoObjetivo.unidad}
						{/if}
					</span>
				{/if}
			</p>
		</div>
	{/if}

	<!-- Acción -->
	{#if ProyectoAbierto()}
		<Button
			label={unidadInfo.button}
			on:click={mostrarFormulario}
			variant="primary"
			size="sm"
			customClass="mb-4 w-full"
		/>
	{:else}
		<div class="mb-4 rounded-lg bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
			Este proyecto ya no está abierto para nuevas colaboraciones
		</div>
	{/if}

	<!-- Compartir -->
	<Button label="Compartir proyecto" variant="secondary" size="sm" customClass="w-full" />
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
