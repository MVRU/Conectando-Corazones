<script lang="ts">
	import Button from '$lib/components/ui/elements/Button.svelte';

	type Unidad = 'dinero' | 'materiales' | 'voluntarios';

	export let proyecto: {
		unidad: Unidad;
		estado: string;
		especie?: string;
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

	const especie = proyecto.especie?.toLowerCase() || '';
	const especieIcon = especieEmoji[especie] || '📦';

	const unidadInfo = {
		dinero: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-700',
			icon: '💰',
			label: 'donaciones monetarias',
			button: 'Enviar donación'
		},
		materiales: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-700',
			icon: especieIcon,
			label: especie ? `donaciones de ${especie}` : 'donaciones específicas',
			button: 'Donar materiales'
		},
		voluntarios: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			text: 'text-purple-700',
			icon: '🙋‍♀️',
			label: 'voluntariado',
			button: 'Postularme como voluntario'
		}
	}[proyecto.unidad];
</script>

<div class="rounded-2xl bg-white p-6 shadow-lg">
	<h3 class="mb-4 text-xl font-semibold text-[rgb(var(--base-color))]">¿Querés colaborar?</h3>

	<!-- Tipo de colaboración -->
	<div class={`mb-4 rounded-lg ${unidadInfo.border} ${unidadInfo.bg} p-3`}>
		<p class={`text-sm ${unidadInfo.text}`}>
			{unidadInfo.icon} Este proyecto necesita <strong>{unidadInfo.label}</strong>.
		</p>
	</div>

	<!-- Botón de acción o mensaje si está inactivo -->
	{#if proyecto.estado === 'Activo'}
		<Button label={unidadInfo.button} on:click={mostrarFormulario} customClass="mb-3 w-full" />
	{:else}
		<div class="rounded-lg bg-gray-100 py-4 text-center">
			<p class="text-gray-600">Este proyecto ya no está activo</p>
		</div>
	{/if}

	<!-- Botón para compartir -->
	<Button
		label="Compartir proyecto"
		href="#"
		variant="secondary"
		disabled={false}
		customClass="w-full"
	/>
</div>
