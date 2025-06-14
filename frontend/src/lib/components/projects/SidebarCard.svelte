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

<!-- Card principal -->
<div class="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
	<!-- Título -->
	<h3 class="mb-5 text-lg font-bold text-[rgb(var(--base-color))]">¿Querés colaborar?</h3>

	<!-- Tipo de colaboración -->
	<div class={`mb-5 flex items-start gap-3 rounded-xl ${unidadInfo.bg} ${unidadInfo.border} p-4`}>
		<span class="text-xl">{unidadInfo.icon}</span>
		<p class={`text-sm ${unidadInfo.text}`}>
			Este proyecto necesita <strong class="font-semibold">{unidadInfo.label}</strong>.
		</p>
	</div>

	<!-- Acción -->
	{#if proyecto.estado === 'Activo'}
		<Button
			label={unidadInfo.button}
			on:click={mostrarFormulario}
			customClass="mb-3 w-full font-medium text-white"
		/>
	{:else}
		<div class="mb-4 rounded-lg bg-gray-100 py-4 text-center">
			<p class="text-sm text-gray-500">Este proyecto ya no está activo</p>
		</div>
	{/if}

	<!-- Compartir -->
	<Button
		label="Compartir proyecto"
		href="#"
		variant="secondary"
		disabled={false}
		customClass="w-full font-medium"
	/>
</div>
