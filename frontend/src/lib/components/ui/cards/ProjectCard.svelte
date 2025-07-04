<script lang="ts">
	import type { Project } from '$lib/models/Project';
	import Button from '../elements/Button.svelte';
	import ProgressBar from '../elements/ProgressBar.svelte';
	import { user } from '$lib/stores/auth';
	import { get } from 'svelte/store';

	export let proyecto!: Project;
	export let mostrarBotones: boolean = false;
	const usuario = get(user);
	const mostrarReporte =
		proyecto.estado === 'Finalizado' &&
		(usuario?.id ===
			(typeof proyecto.institucion === 'string'
				? proyecto.institucion
				: proyecto.institucion?.id) ||
			proyecto.colaboradores?.some((c) => c.id === usuario?.id));

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
	let actual: number;
	let objetivo: number;
	let unidad: string;
	let especie: string;
	let percent: number;
	let actualLabel: string;
	let objetivoLabel: string;
	let color: 'green' | 'blue' | 'purple';
	let icono: string;

	$: {
		actual = Number(proyecto.actual);
		objetivo = Number(proyecto.objetivo);
		unidad = proyecto.unidad;
		especie = (proyecto.especie || '').trim();

		percent = objetivo > 0 ? Math.min((actual / objetivo) * 100, 100) : 0;

		actualLabel =
			unidad === 'dinero'
				? `$${actual.toLocaleString('es-AR')}`
				: unidad === 'voluntarios'
					? `${actual} voluntarios`
					: `${actual} ${especie || 'unidades'}`;

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

<article
	class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
>
	<a
		href={`/projects/${proyecto.id}`}
		class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white no-underline shadow-sm transition-all hover:shadow-md"
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
					<span class="font-semibold text-[rgb(var(--color-primary))]">
						{typeof proyecto.institucion === 'string'
							? 'Institución'
							: proyecto.institucion.razonSocial}
					</span>
					<span>📍 {proyecto.ciudad}, {proyecto.provincia}</span>
				</div>

				<h3 class="text-lg font-bold leading-tight text-gray-800">{proyecto.titulo}</h3>
				<p class="line-clamp-3 text-sm text-gray-600">{proyecto.descripcion}</p>
			</div>

			<!-- Progreso y/o Reporte -->
			<div class="mt-2 flex flex-col gap-3">
				{#if mostrarReporte}
					{#if mostrarBotones}
						<div class="flex justify-between text-xs font-medium text-gray-700">
							<span>{icono} Objetivo</span>
							<span>{actualLabel} / {objetivoLabel}</span>
						</div>
						<ProgressBar {percent} {color} />
					{/if}

					<div class="flex justify-center">
						<Button
							label="Ver reporte"
							href={`/projects/${proyecto.id}/reporte`}
							size="sm"
							variant="secondary"
							customClass="w-full "
							on:click={(e) => e.stopPropagation()}
						/>
					</div>
				{:else}
					<div class="flex justify-between text-xs font-medium text-gray-700">
						<span>{icono} Objetivo</span>
						<span>{actualLabel} / {objetivoLabel}</span>
					</div>
					<ProgressBar {percent} {color} />
				{/if}
			</div>

			<!-- Botones solo si mostrarBotones es true y mostrarReporte es false -->
			{#if mostrarBotones && !mostrarReporte}
				<div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row">
					<Button
						label="Ver detalles"
						href={`/projects/${proyecto.id}`}
						variant="secondary"
						size="sm"
						customClass="flex-1"
						on:click={(e) => e.stopPropagation()}
					/>

					<Button
						label={unidad === 'dinero'
							? 'Enviar donación'
							: unidad === 'materiales'
								? 'Donar materiales'
								: 'Postularme como voluntario'}
						href={`/projects/${proyecto.id}#colaborar`}
						size="sm"
						{disabled}
						customClass="flex-1"
						on:click={(e) => e.stopPropagation()}
					/>
				</div>
			{/if}
		</div>
	</a>
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
