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
		percentRecaudado =
			totalObjetivo > 0 ? Math.min((totalRecaudado / totalObjetivo) * 100, 100) : 0;

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
		return `${f.getDate()}/${f.getMonth() + 1}`;
	};

	const getBadgeClasses = (tipo: 'urgencia' | 'estado', valor: string) => {
		const base =
			'inline-flex items-center gap-1 rounded-full px-3 py-[6px] text-[11px] font-semibold ring-1 ring-white/30 shadow-lg backdrop-blur-md transition-all duration-200';

		const estilos = {
			urgencia: {
				Alta: 'bg-red-100/80 text-red-800 hover:brightness-105',
				Media: 'bg-yellow-100/80 text-yellow-800 hover:brightness-105',
				Baja: 'bg-emerald-100/80 text-emerald-800 hover:brightness-105'
			},
			estado: {
				Abierto: 'bg-emerald-100/80 text-emerald-800 hover:brightness-105',
				'En ejecución': 'bg-blue-100/80 text-blue-800 hover:brightness-105',
				Finalizado: 'bg-gray-100/80 text-gray-800 hover:brightness-105',
				Cerrado: 'bg-gray-100/80 text-gray-800 hover:brightness-105'
			}
		};

		if (tipo === 'urgencia' && valor in estilos.urgencia) {
			return `${base} ${estilos.urgencia[valor as keyof typeof estilos.urgencia]}`;
		}

		if (tipo === 'estado' && valor in estilos.estado) {
			return `${base} ${estilos.estado[valor as keyof typeof estilos.estado]}`;
		}

		return `${base} bg-gray-300/90 text-gray-800`;
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
	class="animate-fade-in-up group relative flex h-full translate-y-4 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white opacity-0
		shadow-sm transition-all hover:shadow-md"
>
	<!-- Imagen destacada -->
	<div class="relative aspect-[4/3] w-full overflow-hidden">
		<img
			src={proyecto.imagen}
			alt={proyecto.titulo}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		<div
			class="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-gray-700 shadow backdrop-blur-sm"
		>
			<span>{emojiTemporizador} {estadoTemporizador}</span>
			<span class="text-gray-400">•</span>
			<span
				>{formatearFechaCorta(proyecto.fechaInicio)} → {formatearFechaCorta(
					proyecto.fechaCierre
				)}</span
			>
		</div>
		<div class="absolute right-3 top-3 flex flex-wrap gap-2 text-xs">
			{#if proyecto.urgencia}
				<span class={getBadgeClasses('urgencia', proyecto.urgencia)}>
					{proyecto.urgencia}
				</span>
			{/if}
			{#if proyecto.estado}
				<span class={getBadgeClasses('estado', estadoTemporizador)}>
					{estadoTemporizador}
				</span>
			{/if}
		</div>
	</div>

	<!-- Contenido textual -->
	<div class="flex flex-1 flex-col justify-between gap-4 p-5 sm:p-6">
		<div class="space-y-2">
			<div class="flex flex-wrap items-center justify-between text-xs text-gray-500">
				<span class="font-semibold text-[rgb(var(--color-primary))]"
					>{proyecto.institucion?.razonSocial}</span
				>
				<span>📍 {proyecto.ciudad}, {proyecto.provincia}</span>
			</div>
			<h3 class="line-clamp-2 text-base font-bold leading-tight text-gray-800 sm:text-lg">
				{proyecto.titulo}
			</h3>
			<p class="line-clamp-3 text-sm text-gray-600">{proyecto.descripcion}</p>
		</div>

		<!-- Progreso visual -->
		<div class="mt-2 flex flex-col gap-2">
			<div class="flex justify-between text-xs font-medium text-gray-700">
				<span>{icono} Objetivo</span>
				{#if percentRecaudado < 100}
					<span>{percentRecaudado.toFixed(0)}% alcanzado</span>
				{:else if estadoTemporizador !== 'Finalizado' && cierre && hoy < cierre}
					<span class="font-semibold text-emerald-600">Proyecto pendiente de finalizar</span>
				{:else}
					<span class="text-gray-500">Objetivo alcanzado</span>
				{/if}
			</div>
			<div class="relative h-3 w-full rounded-full bg-gray-200 shadow-inner">
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
						class="pointer-events-none h-full rounded-full opacity-70"
						style={`background: repeating-linear-gradient(135deg, ${getRgbColor(color)} 0, ${getRgbColor(color)} 4px, transparent 4px, transparent 8px)`}
					></div>
					{#if mostrarTooltipEstimado}
						<div
							class="absolute -top-10 left-[95%] z-50 w-max -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200"
						>
							🤝 Compromisos de ayuda
						</div>
					{/if}
				</button>

				<!-- Recaudado -->
				<button
					type="button"
					class="absolute inset-y-0 left-0 h-full cursor-pointer focus:outline-none"
					style={`width: ${percentRecaudado}%`}
					on:mouseenter={() => (mostrarTooltipRecaudado = true)}
					on:mouseleave={() => (mostrarTooltipRecaudado = false)}
					on:click={() => abrirModal('recaudado')}
				>
					<div
						class={`h-full rounded-full bg-gradient-to-r ${getGradientClass(color)} pointer-events-none`}
					></div>
					{#if mostrarTooltipRecaudado}
						<div
							class="absolute -top-10 left-1/2 z-50 w-max -translate-x-1/2 rounded-md bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow ring-1 ring-gray-200"
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
