<script lang="ts">
	import type { Project } from '$lib/types/Project';
	import Button from '../elements/Button.svelte';
<<<<<<< HEAD
	import ProgressBar from '../elements/ProgressBar.svelte';
	import { user } from '$lib/stores/auth';
	import { get } from 'svelte/store';
=======
	import { calcularProgresoTotal } from '$lib/utils/progress';
	import ProjectProgress from '$lib/components/projects/ProjectProgress.svelte';
>>>>>>> main

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

	// Variables reactivas para valores dependientes de "proyecto"
	let percentCantidad: number;
	let actualLabel: string;
	let objetivoLabel: string;
	let color: 'green' | 'blue' | 'purple';
	let icono: string;

	$: if (proyecto.objetivos && proyecto.objetivos.length > 0) {
		const objetivos = proyecto.objetivos;
		const totalObjetivo = objetivos.reduce((acc, o) => acc + (o.objetivo || 0), 0);
		const totalCantidad = objetivos.reduce((acc, o) => acc + (o.cantidad || 0), 0);
		const primerObjetivo = objetivos[0];

		percentCantidad = calcularProgresoTotal(proyecto);

		actualLabel =
			primerObjetivo.unidad === 'dinero'
				? `$${totalCantidad.toLocaleString('es-AR')}`
				: primerObjetivo.unidad === 'voluntarios'
					? `${totalCantidad} voluntarios`
					: `${totalCantidad} ${primerObjetivo.especie || 'unidades'}`;

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
<<<<<<< HEAD
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
=======
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
			<ProjectProgress {proyecto} variant="compact" />

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
</a>
>>>>>>> main

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
