<script lang="ts">
	import type { Project } from '$lib/types/Project';
	import Button from '../elements/Button.svelte';
	import ProgressDetailsModal from './ProgressDetailsModal.svelte';
	let showModal = false;
	let tipoModal: 'estimado' | 'recaudado' = 'estimado';

	export let proyecto!: Project;
	export let mostrarBotones: boolean = false;

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

	function abrirModal(tipo: 'estimado' | 'recaudado') {
		tipoModal = tipo;
		showModal = true;
	}

	const getEmojiEspecie = (especie?: string) => especieEmoji[especie?.toLowerCase() || ''] || '📦';

	// Variables reactivas para valores dependientes de "proyecto"
	let mostrarTooltipEstimado: boolean = false;
	let mostrarTooltipRecaudado: boolean = false;
	let percentEstimado: number;
	let percentRecaudado: number;
	let actualLabel: string;
	let objetivoLabel: string;
	let color: 'green' | 'blue' | 'purple';
	let icono: string;

	$: if (proyecto.objetivos && proyecto.objetivos.length > 0) {
		const totalObjetivo = proyecto.objetivos.reduce((acc, o) => acc + (o.objetivo || 0), 0);
		const totalEstimado = proyecto.objetivos.reduce((acc, o) => acc + (o.cantidadEstimada || 0), 0);
		const totalRecaudado = proyecto.objetivos.reduce(
			(acc, o) => acc + (o.cantidadRecaudada || 0),
			0
		);
		const primerObjetivo = proyecto.objetivos[0];

		percentEstimado = totalObjetivo > 0 ? Math.min((totalEstimado / totalObjetivo) * 100, 100) : 0;
		percentRecaudado = totalObjetivo > 0 ? (totalRecaudado / totalObjetivo) * 100 : 0;

		actualLabel =
			primerObjetivo.unidad === 'dinero'
				? `$${totalRecaudado.toLocaleString('es-AR')}`
				: primerObjetivo.unidad === 'voluntarios'
					? `${totalRecaudado} voluntarios`
					: `${totalRecaudado} ${primerObjetivo.especie || 'unidades'}`;

		objetivoLabel =
			primerObjetivo.unidad === 'dinero'
				? `$${totalObjetivo.toLocaleString('es-AR')}`
				: primerObjetivo.unidad === 'voluntarios'
					? `${totalObjetivo} voluntarios`
					: `${totalObjetivo} ${primerObjetivo.especie || 'unidades'}`;

		color =
			primerObjetivo.unidad === 'dinero'
				? 'green'
				: primerObjetivo.unidad === 'voluntarios'
					? 'purple'
					: 'blue';
		icono =
			primerObjetivo.unidad === 'materiales'
				? getEmojiEspecie(primerObjetivo.especie)
				: primerObjetivo.unidad === 'dinero'
					? '💰'
					: primerObjetivo.unidad === 'voluntarios'
						? '🙋‍♀️'
						: '🤝';
	}

	const formatearFechaCorta = (fecha?: string) => {
		if (!fecha) return '—';
		const f = new Date(fecha);
		return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear().toString().slice(-2)}`;
	};

	const getBadgeClasses = (valor: string) => {
		const base =
			'rounded-full bg-white px-3 py-2 text-[11px] font-semibold shadow-sm ring-1 ring-white/40 backdrop-blur-sm';
		const colores = {
			alta: 'text-red-700',
			media: 'text-orange-500',
			baja: 'text-blue-500'
		};
		return `${base} ${colores[valor.toLowerCase() as keyof typeof colores] || 'text-gray-600'}`;
	};

	const getRgbColor = (color: 'green' | 'blue' | 'purple') => {
		switch (color) {
			case 'green':
				return 'rgb(110,231,183)';
			case 'blue':
				return 'rgb(125,211,252)';
			case 'purple':
				return 'rgb(196,181,253)';
			default:
				return 'rgb(203,213,225)';
		}
	};

	const getGradientClass = (color: 'green' | 'blue' | 'purple') => {
		switch (color) {
			case 'green':
				return 'from-emerald-300 via-emerald-400 to-emerald-500';
			case 'blue':
				return 'from-sky-300 via-sky-400 to-sky-500';
			case 'purple':
				return 'from-violet-300 via-violet-400 to-violet-500';
			default:
				return 'from-slate-300 via-slate-400 to-slate-500';
		}
	};

	const hoy = new Date();
	const inicio = proyecto.fechaInicio ? new Date(proyecto.fechaInicio) : null;
	const cierre = proyecto.fechaCierre ? new Date(proyecto.fechaCierre) : null;

	let estadoTemporizador = '—';
	let emojiTemporizador = '⌛';

	if (inicio && cierre) {
		if (hoy > cierre) {
			estadoTemporizador = 'Finalizado';
			emojiTemporizador = '✅';
		} else if (hoy >= inicio && hoy <= cierre) {
			estadoTemporizador = 'En ejecución';
			emojiTemporizador = '🟢';
		} else {
			const diff = inicio.getTime() - hoy.getTime();
			const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
			if (dias <= 0) {
				estadoTemporizador = 'Hoy comienza';
				emojiTemporizador = '⏱️';
			} else if (dias === 1) {
				estadoTemporizador = 'Comienza mañana';
				emojiTemporizador = '📆';
			} else if (dias < 7) {
				estadoTemporizador = `En ${dias} días`;
				emojiTemporizador = '⏳';
			} else {
				const semanas = Math.floor(dias / 7);
				estadoTemporizador = semanas === 1 ? 'En 1 semana' : `En ${semanas} semanas`;
				emojiTemporizador = '⏳';
			}
		}
	}

	const disabled = estadoTemporizador === 'En ejecución' || estadoTemporizador === 'Finalizado';
</script>

<a
	href={`/projects/${proyecto.id}`}
	class="animate-fade-in-up group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
>
	<!-- Imagen destacada -->
	<div class="relative aspect-[4/3] w-full overflow-hidden">
		<img
			src={proyecto.imagen}
			alt={proyecto.titulo}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<!-- Estado y Fechas -->
		<div
			class="absolute bottom-3 left-3 z-50 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-md"
		>
			<span class="text-sm">{emojiTemporizador}</span>
			<span class="font-medium">{estadoTemporizador}</span>
			<span class="mx-1 text-gray-300">|</span>
			<span class="text-gray-500">
				{formatearFechaCorta(proyecto.fechaInicio)} - {formatearFechaCorta(proyecto.fechaCierre)}
			</span>
		</div>

		<!-- Gradiente oscuro sutil -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent">
			{#if proyecto.urgencia}
				<div class="absolute right-4 top-4">
					<span class={getBadgeClasses(proyecto.urgencia)}>
						<span>Urgencia {proyecto.urgencia}</span>
					</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Contenido textual -->
	<div class="flex flex-1 flex-col justify-between gap-6 p-6">
		<div class="space-y-2">
			<div class="flex flex-wrap items-center justify-between text-xs text-gray-500">
				<span class="font-semibold text-[rgb(var(--color-primary))]"
					>{proyecto.institucion?.razonSocial}</span
				>

				<div class="flex items-center gap-1 text-xs text-gray-500">
					<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11.8a2.8 2.8 0 100-5.6 2.8 2.8 0 000 5.6z"
						/>
					</svg>
					<span>{proyecto.ciudad}, {proyecto.provincia}</span>
				</div>
			</div>

			<h3 class="line-clamp-2 text-lg font-semibold text-gray-900">
				{proyecto.titulo}
			</h3>
			<p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
				{proyecto.descripcion}
			</p>
		</div>

		<!-- Progreso visual -->
		<div class="mt-2 flex flex-col gap-2">
			<div class="flex justify-between text-xs font-medium text-gray-700">
				<span>{icono} Objetivo</span>
				{#if percentRecaudado > 100}
					<span class="font-semibold text-purple-600">¡Objetivo superado!</span>
				{:else if Math.round(percentRecaudado) === 100}
					<span class="font-semibold text-emerald-600">¡Objetivo alcanzado!</span>
				{:else}
					<span>{percentRecaudado.toFixed(0)}% alcanzado</span>
				{/if}
			</div>
			<div class="relative h-3 w-full rounded-full bg-slate-100 shadow-inner">
				<!-- Estimado -->
				<button
					type="button"
					class="absolute left-0 top-0 h-full cursor-pointer focus:outline-none"
					style={`width: ${percentEstimado}%`}
					on:mouseenter={() => (mostrarTooltipEstimado = true)}
					on:mouseleave={() => (mostrarTooltipEstimado = false)}
					on:click={() => abrirModal('estimado')}
				>
					<div
						class="pointer-events-none h-full rounded-full opacity-50"
						style={`background: repeating-linear-gradient(135deg, ${getRgbColor(color)} 0, ${getRgbColor(color)} 4px, transparent 4px, transparent 8px)`}
					></div>
					{#if mostrarTooltipEstimado}
						<div
							class="absolute -top-10 left-[95%] z-50 w-max -translate-x-1/2 rounded-md bg-white/80 px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200 backdrop-blur-sm"
						>
							🤝 Compromisos de ayuda
						</div>
					{/if}
				</button>

				<!-- Recaudado -->
				<button
					type="button"
					class="absolute inset-y-0 left-0 h-full cursor-pointer focus:outline-none"
					style={`width: ${Math.min(percentRecaudado, 100)}%`}
					on:mouseenter={() => (mostrarTooltipRecaudado = true)}
					on:mouseleave={() => (mostrarTooltipRecaudado = false)}
					on:click={() => abrirModal('recaudado')}
				>
					<div
						class={`h-full rounded-full bg-gradient-to-r ${getGradientClass(color)} pointer-events-none`}
					></div>
					{#if mostrarTooltipRecaudado}
						<div
							class="absolute -top-10 left-1/2 z-50 w-max -translate-x-1/2 rounded-md bg-white/80 px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200 backdrop-blur-sm"
						>
							✅ Colaboraciones efectivas
						</div>
					{/if}
				</button>
			</div>

			{#if mostrarBotones}
				<div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row">
					<Button
						label="Ver detalles"
						href={`/projects/${proyecto.id}`}
						variant="secondary"
						size="sm"
						customClass="flex-1"
					/>
					<Button
						label="Colaborar ahora"
						href={`/projects/${proyecto.id}#colaborar`}
						size="sm"
						{disabled}
						customClass="flex-1"
					/>
				</div>
			{/if}
		</div>
	</div>

	<ProgressDetailsModal open={showModal} tipo={tipoModal} on:close={() => (showModal = false)} />
</a>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@keyframes fade-in-up {
		0% {
			opacity: 0;
			transform: translateY(16px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out forwards;
	}
</style>
