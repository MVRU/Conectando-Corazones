<script lang="ts">
	import type { Project } from '$lib/models/Project';
	import Button from '../elements/Button.svelte';
	import ProgressBar from '../elements/ProgressBar.svelte';

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

	const getEmojiEspecie = (especie?: string) => especieEmoji[especie?.toLowerCase() || ''] || '📦';

	// Variables reactivas para valores dependientes de "proyecto"
	let objetivo: number;
	let unidad: string;
	let especie: string;
	let estimado: number;
	let recaudado: number;
	let percentEstimado: number;
	let percentRecaudado: number;
	let actualLabel: string;
	let objetivoLabel: string;
	let color: 'green' | 'blue' | 'purple';
	let icono: string;
	let mostrarTooltipEstimado: boolean = false;
	let mostrarTooltipRecaudado: boolean = false;
	let dentroDeCard: boolean = false;

	function toggleTooltip(tipo: 'estimado' | 'recaudado') {
		if (tipo === 'estimado') {
			mostrarTooltipEstimado = !mostrarTooltipEstimado;
			mostrarTooltipRecaudado = false;
		} else {
			mostrarTooltipRecaudado = !mostrarTooltipRecaudado;
			mostrarTooltipEstimado = false;
		}
	}

	$: {
		estimado = Number(proyecto.cantidadEstimada);
		recaudado = Number(proyecto.cantidadRecaudada);
		objetivo = Number(proyecto.objetivo);
		unidad = proyecto.unidad;
		especie = (proyecto.especie || '').trim();

		percentEstimado = objetivo > 0 ? Math.min((estimado / objetivo) * 100, 100) : 0;
		percentRecaudado = objetivo > 0 ? Math.min((recaudado / objetivo) * 100, 100) : 0;

		actualLabel =
			unidad === 'dinero'
				? `$${recaudado.toLocaleString('es-AR')}`
				: unidad === 'voluntarios'
					? `${recaudado} voluntarios`
					: `${recaudado} ${especie || 'unidades'}`;

		objetivoLabel =
			unidad === 'dinero'
				? `$${objetivo.toLocaleString('es-AR')}`
				: unidad === 'voluntarios'
					? `${objetivo} voluntarios`
					: `${objetivo} ${especie || 'unidades'}`;

		color = unidad === 'dinero' ? 'green' : unidad === 'voluntarios' ? 'purple' : 'blue';

		icono =
			unidad === 'materiales'
				? getEmojiEspecie(especie)
				: unidad === 'dinero'
					? '💰'
					: unidad === 'voluntarios'
						? '🙋‍♀️'
						: '🤝';
	}

	const formatearFechaCorta = (fecha?: string) => {
		if (!fecha) return '—';
		const f = new Date(fecha);
		return `${f.getDate()}/${f.getMonth() + 1}`;
	};

	const getBadgeColor = (valor: string) => {
		switch (valor) {
			case 'Alta':
				return 'bg-red-100 text-red-700';
			case 'Media':
				return 'bg-yellow-100 text-yellow-700';
			case 'Baja':
				return 'bg-green-100 text-green-700';
			case 'Activo':
				return 'bg-green-100 text-green-700';
			case 'Cerrado':
				return 'bg-gray-100 text-gray-500';
			default:
				return 'bg-gray-100 text-gray-700';
		}
	};

	const getRgbColor = (color: 'green' | 'blue' | 'purple') => {
		switch (color) {
			case 'green':
				return 'rgb(110,231,183)'; // emerald-300
			case 'blue':
				return 'rgb(125,211,252)'; // sky-300
			case 'purple':
				return 'rgb(196,181,253)'; // violet-300
			default:
				return 'rgb(203,213,225)'; // slate-300
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

<svelte:window
	on:click={(e) => {
		const path = e.composedPath();
		const dentroDeBarra = path.some((el: any) => el.classList?.contains('barra-tooltip'));
		if (!dentroDeBarra) {
			mostrarTooltipEstimado = false;
			mostrarTooltipRecaudado = false;
		}
	}}
/>
<article
	class="group relative flex h-full flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
	on:mouseenter={() => (dentroDeCard = true)}
	on:mouseleave={() => {
		dentroDeCard = false;
		mostrarTooltipEstimado = false;
		mostrarTooltipRecaudado = false;
	}}
>
	<!-- Imagen destacada -->
	<div class="relative aspect-[4/3] w-full overflow-hidden">
		<img
			src={proyecto.imagen}
			alt={proyecto.titulo}
			class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>

		<!-- Estado temporal y fechas -->
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

		<!-- Badges -->
		<div class="absolute right-3 top-3 flex flex-row items-end gap-2 text-xs">
			{#if proyecto.urgencia}
				<span
					class={`rounded-full px-3 py-0.5 font-semibold shadow-sm backdrop-blur-sm ${getBadgeColor(proyecto.urgencia)} bg-white/90`}
				>
					{proyecto.urgencia}
				</span>
			{/if}
			{#if proyecto.estado}
				<span
					class={`rounded-full px-3 py-0.5 font-semibold shadow-sm backdrop-blur-sm ${getBadgeColor(proyecto.estado)} bg-white/90`}
				>
					{proyecto.estado}
				</span>
			{/if}
		</div>
	</div>

	<!-- Contenido -->
	<div class="flex flex-1 flex-col justify-between gap-5 p-6">
		<div class="space-y-3">
			<div class="flex flex-wrap items-center justify-between text-xs text-gray-500">
				<span class="font-semibold text-[rgb(var(--color-primary))]">{proyecto.institucion}</span>
				<span>📍 {proyecto.ciudad}, {proyecto.provincia}</span>
			</div>

			<h3 class="text-lg font-bold leading-tight text-gray-800">{proyecto.titulo}</h3>
			<p class="line-clamp-3 text-sm text-gray-600">{proyecto.descripcion}</p>
		</div>

		<!-- Progreso -->
		<div class="mt-2 flex flex-col gap-2">
			<div class="flex justify-between text-xs font-medium text-gray-700">
				<span>{icono} Objetivo</span>
				<span>{actualLabel} / {objetivoLabel}</span>
			</div>
			<!-- Progreso doble: estimado (punteado) + recaudado (degradado) -->
			<div class="relative h-3 w-full rounded-full bg-gray-200 shadow-inner">
				<!-- Estimado (punteado) con tooltip -->
				<button
					type="button"
					class="barra-tooltip absolute left-0 top-0 h-full cursor-pointer focus:outline-none"
					style="width: {percentEstimado}%"
					aria-label="Mostrar información de compromisos"
					on:click={() => toggleTooltip('estimado')}
				>
					<div
						class="pointer-events-none h-full rounded-full opacity-40"
						style="
            background: repeating-linear-gradient(
                135deg,
                {getRgbColor(color)} 0,
                {getRgbColor(color)} 4px,
                transparent 4px,
                transparent 8px
            );
        "
					></div>

					{#if mostrarTooltipEstimado}
						<div
							class="absolute -top-10 left-[95%] z-50 w-max -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-md ring-1 ring-gray-200 transition-opacity duration-200 before:absolute before:-bottom-1 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-white"
							style="background-color: {getRgbColor(color)}66;"
						>
							<span class="flex items-center gap-1">
								⚠️ Compromisos de ayuda (aún no efectivas)
							</span>
						</div>
					{/if}
				</button>

				<!-- Recaudado (degradado) con tooltip -->
				<button
					type="button"
					class="barra-tooltip absolute inset-y-0 left-0 h-full cursor-pointer focus:outline-none"
					style="width: {percentRecaudado}%"
					aria-label="Mostrar información de donaciones recibidas"
					on:click={() => toggleTooltip('recaudado')}
				>
					<div
						class={`h-full rounded-full bg-gradient-to-r ${getGradientClass(color)} pointer-events-none transition-all duration-1000`}
					></div>

					{#if mostrarTooltipRecaudado}
						<div
							class="absolute -top-10 left-1/2 z-50 w-max -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-md ring-1 ring-gray-200 transition-opacity duration-200 before:absolute before:-bottom-1 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:rotate-45 before:bg-white
"
						>
							<span class="flex items-center gap-1"> ✅ Colaboraciones efectivas recibidas </span>
						</div>
					{/if}
				</button>
			</div>

			<!-- Botones -->
			{#if mostrarBotones}
				<div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
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
</article>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
