<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';

	type Unidad = 'dinero' | 'materiales' | 'voluntarios';
	export let proyecto: {
		objetivos?: {
			unidad: Unidad;
			especie?: string;
		}[];
		estado: string;
	};
	export let mostrarFormulario: () => void;

	const especieEmoji: Record<string, string> = {
		libros: '📚',
		colchones: '🛏️',
		alimentos: '🍽️',
		juguetes: '🧸',
		computadoras: '💻',
		prendas: '👕',
		medicamentos: '💊',
		herramientas: '🔧',
		utiles: '✏️'
	};

	const tieneUnSoloObjetivo = proyecto.objetivos?.length === 1;
	const unicoObjetivo = tieneUnSoloObjetivo ? proyecto.objetivos?.[0] : null;

	const unidadInfo = {
		dinero: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-800',
			icon: '💰',
			label: 'donaciones monetarias',
			button: 'Donar ahora'
		},
		materiales: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-800',
			icon: especieEmoji[unicoObjetivo?.especie?.toLowerCase() || ''] || '📦',
			label: unicoObjetivo?.especie
				? `donaciones de ${unicoObjetivo.especie}`
				: 'donaciones específicas',
			button: 'Donar materiales'
		},
		voluntarios: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			text: 'text-purple-800',
			icon: '🙋‍♀️',
			label: 'voluntariado',
			button: 'Postularme como voluntario'
		},
		multiples: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-200',
			text: 'text-yellow-800',
			icon: '🤝',
			label: 'ayuda múltiple (donaciones, materiales o voluntariado)',
			button: 'Colaborar ahora'
		}
	}[unicoObjetivo?.unidad ?? 'multiples'];
</script>

<div
	class="animate-fade-up rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
>
	<h3 class="mb-4 text-center text-lg font-semibold text-gray-800">¿Querés colaborar?</h3>

	{#if tieneUnSoloObjetivo}
		<div class={`mb-5 flex items-start gap-3 rounded-lg p-3 ${unidadInfo.bg} ${unidadInfo.border}`}>
			<span class="text-xl">{unidadInfo.icon}</span>
			<p class={`text-sm ${unidadInfo.text}`}>
				Este proyecto necesita <strong>{unidadInfo.label}</strong>.
			</p>
		</div>
	{/if}

	<!-- Acción -->
	{#if proyecto.estado === 'Abierto'}
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
