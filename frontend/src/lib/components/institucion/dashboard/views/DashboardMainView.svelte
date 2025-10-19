<!--
*- DECISIÓN DE DISEÑO: Esta vista resume el dashboard en secciones autocontenidas para facilitar pruebas A/B.
-->
<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { TransitionConfig } from 'svelte/transition';
	import { ChevronDown, ChevronRight, Filter, TrendingUp, Users } from 'lucide-svelte';
	import Button from '../../../ui/elementos/Button.svelte';

	import type { AidType, Metric, ProgressSegment } from '../types';
	import { filtersResetLabel } from '../data';
	import {
		BG_900,
		BG_CARD,
		BORDER_SUBTLE,
		ERROR_COLOR,
		GREEN,
		PRIMARY_300,
		PRIMARY_500,
		TEXT_100,
		TEXT_300,
		TEXT_400,
		WARNING_COLOR
	} from '../tokens';
	import { getDonutGradient, getGradientCSS, getGradientClass, midHex } from '../helpers';

	export let filters: string[] = [];
	export let metrics: Metric[] = [];
	export let progressSegments: ProgressSegment[] = [];
	export let aidTypes: AidType[] = [];
	export let pendingRequests = 3;

	type FadeFlyOptions = {
		fade?: Parameters<typeof fade>[1];
		fly?: Parameters<typeof fly>[1];
	};

	const fadeFly = (node: Element, options: FadeFlyOptions = {}): TransitionConfig => {
		const { fade: fadeOptions = {}, fly: flyOptions = {} } = options;
		const fadeTransition = fade(node, fadeOptions);
		const flyTransition = fly(node, flyOptions);

		const fadeDelay = fadeTransition.delay ?? 0;
		const flyDelay = flyTransition.delay ?? 0;
		const delay = Math.min(fadeDelay, flyDelay);
		const duration = Math.max(fadeTransition.duration ?? 0, flyTransition.duration ?? 0);
		const easing = flyTransition.easing ?? fadeTransition.easing;

		return {
			delay,
			duration,
			easing,
			css: (t, u) => {
				const fadeCss = fadeTransition.css ? fadeTransition.css(t, u) : '';
				const flyCss = flyTransition.css ? flyTransition.css(t, u) : '';
				return `${fadeCss}${flyCss}`;
			}
		};
	};

	$: donutGradient = getDonutGradient(aidTypes);
	$: totalAidPercent = aidTypes.reduce((acc, item) => acc + (item?.percent ?? 0), 0);
	$: topAidType = aidTypes.reduce<AidType | undefined>((winner, current) => {
		const winnerPercent = winner?.percent ?? -Infinity;
		const currentPercent = current?.percent ?? -Infinity;
		return currentPercent > winnerPercent ? current : winner;
	}, undefined);
	$: hasAidData = aidTypes.length > 0 && totalAidPercent > 0;
	$: totalAidPercentRounded = Math.round(totalAidPercent);
	$: dominantAidCopy = hasAidData
		? `${topAidType?.label ?? 'Sin datos'} lidera (${topAidType?.percent ?? 0}%)`
		: 'A\u00FAn no registraste apoyos';
</script>

<div class="space-y-10">
	<section
		class="filter-toolbar sticky z-30 w-full overflow-hidden rounded-2xl border backdrop-blur-lg"
		in:fadeFly={{ fade: { duration: 200 }, fly: { y: 14, duration: 280 } }}
		style="top: clamp(0.75rem, 2vw, 1.75rem); background: {BG_900}E6; border-color: {BORDER_SUBTLE}; box-shadow: 0 14px 30px rgba(8,12,32,0.25);"
	>
		<div class="relative flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
			<div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style="color:{TEXT_400};">
				<Filter class="h-4 w-4" style="color:{PRIMARY_500};" />
				<span>Filtrar</span>
			</div>
			<Button
				label={filtersResetLabel}
				variant="ghost"
				size="sm"
				type="button"
				customClass="min-w-fit rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em]"
			/>
		</div>
		<div class="border-t border-white/5"></div>
		<div class="grid grid-cols-1 gap-2.5 p-3.5 sm:grid-cols-2 lg:grid-cols-5">
			{#each filters as filterLabel (filterLabel)}
				<div class="group relative col-span-1 transition-all duration-200 hover:-translate-y-0.5">
					<select
						class="filter-select peer w-full rounded-xl border border-white/10 bg-transparent px-3.5 py-2.5 pr-10 text-sm font-medium text-white/90 shadow-[0_12px_26px_-18px_rgba(8,12,32,0.6)] transition-all duration-200 focus:outline-none focus:ring-2"
						style="--tw-ring-color:{PRIMARY_500}; color:{TEXT_100}; background: linear-gradient(135deg, {BG_900}D9, {BG_CARD}F0);"
						aria-label={filterLabel}
					>
						<option disabled selected>{filterLabel}</option>
						<option style="background:{BG_CARD}; color:{TEXT_100};">Opción A</option>
						<option style="background:{BG_CARD}; color:{TEXT_100};">Opción B</option>
					</select>
					<span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-white/60 transition-all duration-200 peer-focus:text-white">
						<ChevronDown class="h-3.5 w-3.5" />
					</span>
				</div>
			{/each}
		</div>
	</section>

	<section
		class="grid grid-cols-1 gap-8 md:grid-cols-4 md:items-stretch"
		in:fadeFly={{ fade: { duration: 240 }, fly: { y: 20, duration: 340 } }}
	>
		{#each metrics as metric (metric.label)}
			<article
				class="rounded-[28px] p-7 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:ring-2"
				style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22); --tw-ring-color: {metric.color}; background-image: linear-gradient(135deg, {BG_CARD}, #20243E);"
			>
				<div class="flex items-start justify-between">
					<div
						class="flex h-14 w-14 items-center justify-center rounded-xl p-2"
						style="background: {metric.color}20; border: 1px solid {metric.color}55; box-shadow: 0 0 10px {metric.color}20;"
					>
						<svelte:component this={metric.icon} class="h-7 w-7" style="color: {metric.color};" />
					</div>
					<p class="text-4xl font-extrabold tracking-tighter" style="color: {TEXT_100};">
						{metric.value}
					</p>
				</div>
				<p class="mt-6 text-sm font-semibold uppercase tracking-widest" style="color: {TEXT_400};">
					{metric.label}
				</p>
			</article>
		{/each}
		<article
			class="flex flex-col justify-center rounded-[28px] p-7"
			style="border: 1px dashed {BORDER_SUBTLE}; color: {TEXT_100};"
		>
			<h3 class="mb-2 text-2xl font-bold">Avance Global</h3>
			<p class="text-sm" style="color: {TEXT_300};">
				Seguimos sumando voluntades para que la comunidad avance.
			</p>
		</article>
	</section>

	<section
		class="flex flex-col gap-5 rounded-2xl border p-5 transition-transform duration-300 hover:-translate-y-1 hover:ring-2"
		in:fadeFly={{ fade: { duration: 240 }, fly: { y: 16, duration: 320 } }}
		style="border: 1px solid {ERROR_COLOR}; background: #201323; color: {TEXT_100}; box-shadow: 0 4px 18px rgba(255, 92, 108, 0.25); --tw-ring-color: {ERROR_COLOR};"
	>
		<div class="flex items-center gap-4">
			<span
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-black"
				style="background: {ERROR_COLOR}; color: white; box-shadow: 0 0 8px rgba(255, 92, 108, 0.5);"
				>!</span
			>
			<p class="flex-1 text-base font-medium sm:text-lg" style="color: {TEXT_300};">
				¡Atención! Tenés <span class="font-extrabold" style="color: {TEXT_100};"
					>{pendingRequests} solicitudes de colaboración</span
				> pendientes de aprobación.
			</p>
		</div>
	</section>

	<section
		class="grid grid-cols-1 gap-8 lg:grid-cols-2"
		in:fadeFly={{ fade: { duration: 260 }, fly: { y: 18, duration: 360 } }}
	>
		<article
			class="rounded-[28px] p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
			style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
		>
			<h3 class="mb-6 text-2xl font-bold" style="color: {TEXT_100};">Seguimiento de objetivos</h3>
			<div
				class="rounded-[18px] p-6 transition-all duration-200 hover:bg-[#20284F]"
				style="border: 1px solid {PRIMARY_500}; background: {BG_900}; box-shadow: 0 4px 18px rgba(0,0,32,0.40);"
			>
				<h4 class="mb-1 text-xl font-bold" style="color: {TEXT_100};">Luz para Aprender</h4>
				<p class="text-sm font-semibold" style="color: {GREEN};">En Curso</p>
				<div class="mt-4 space-y-3">
					{#each progressSegments as goal (goal.label)}
						<div class="flex flex-col gap-1">
							<div class="flex justify-between text-sm font-medium">
								<span style="color: {TEXT_300};">{goal.label}</span>
								<span
									style="color: {goal.grad === 'blue'
										? '#38bdf8'
										: goal.grad === 'green'
											? '#34d399'
											: '#a78bfa'};">{goal.percent}%</span
								>
							</div>
							<div class="h-2 overflow-hidden rounded-full" style="background: {BORDER_SUBTLE};">
								<div
									class={`h-full rounded-full bg-gradient-to-r ${getGradientClass(goal.grad)}`}
									style={`width: ${goal.percent}%; background-image: ${getGradientCSS(goal.grad)};`}
								></div>
							</div>
						</div>
					{/each}
				</div>
				<div
					class="mt-8 flex w-full flex-wrap items-center justify-end gap-3 text-sm font-semibold"
					style="color:{PRIMARY_300};"
				>
					<button
						type="button"
						class="group inline-flex items-center gap-1 underline-offset-4 transition-all duration-200 hover:underline focus:outline-none focus-visible:underline"
					>
						Actualizar progreso
						<ChevronRight
							class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
							style="color:{PRIMARY_300};"
						/>
					</button>
					<button
						type="button"
						class="group inline-flex items-center gap-1 underline-offset-4 transition-all duration-200 hover:underline focus:outline-none focus-visible:underline"
					>
						Subir evidencia
						<ChevronRight
							class="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
							style="color:{PRIMARY_300};"
						/>
					</button>
				</div>
			</div>
			<div
				class="mt-8 cursor-pointer rounded-[18px] border-2 border-dashed p-7 text-center transition-all duration-200 hover:bg-[#20284F]"
				style="border-color: {PRIMARY_300}; background: {BG_900}; box-shadow: 0 4px 12px {PRIMARY_500}20;"
			>
				<span
					class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
					style="background:{PRIMARY_500}20; border:1px solid {PRIMARY_500}55;"
				>
					<ChevronRight class="h-6 w-6" style="color:{PRIMARY_500};" />
				</span>
				<p class="text-xl font-bold" style="color: {TEXT_100};">¿Crear otro proyecto?</p>
				<p class="mt-1 text-sm" style="color: {TEXT_400};">
					Todo gran impacto empieza en blanco. ¡Empecemos a escribirlo juntos!
				</p>
			</div>
		</article>

		<article
			class="rounded-[28px] p-7 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
			style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
		>
			<h3 class="mb-3 text-2xl font-bold" style="color: {TEXT_100};">Tipos de ayuda</h3>
			<p class="mx-auto mb-6 max-w-xs text-sm" style="color: {TEXT_400};">
				Visualiz&aacute; c&oacute;mo se reparte el soporte entre las iniciativas activas.
			</p>
			<div
				class="relative mx-auto grid h-48 w-48 place-items-center rounded-full shadow-lg transition-transform duration-300 hover:scale-[1.02] sm:h-56 sm:w-56"
				style={`background: ${donutGradient}; padding: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);`}
			>
				<div
					class="flex h-full w-full flex-col items-center justify-center gap-1 rounded-full text-center shadow-inner"
					style="background: {BG_CARD}; border: 6px solid {BG_900};"
				>
					<p class="text-4xl font-black tracking-tight" style="color: {TEXT_100};">
						{hasAidData ? `${totalAidPercentRounded}%` : '0%'}
					</p>
					<p
						class="text-[11px] font-semibold uppercase tracking-[0.35em]"
						style="color: {TEXT_400};"
					>
						Cobertura
					</p>
				</div>
			</div>
			<div
				class="mt-6 rounded-2xl border px-4 py-3 text-left transition-colors duration-200"
				style="border-color:{BORDER_SUBTLE}; background:{BG_900}; color:{TEXT_300};"
			>
				<p class="text-sm font-semibold" style="color: {TEXT_100};">{dominantAidCopy}</p>
				<p class="mt-1 text-xs" style="color: {TEXT_400};">
					{hasAidData
						? `Registraste ${aidTypes.length === 1 ? '1 tipo' : `${aidTypes.length} tipos`} de ayuda.`
						: 'Sum&aacute; registros para identificar d&oacute;nde se focaliza la ayuda.'}
				</p>
			</div>
			<div class="mt-8 grid w-full gap-4 text-sm sm:grid-cols-2">
				{#if aidTypes.length}
					{#each aidTypes as item (item.label)}
						<div
							class="group flex flex-col gap-2 rounded-2xl border px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5"
							style="border-color:{BORDER_SUBTLE}; background:{BG_900};"
						>
							<div class="flex items-center justify-between gap-2">
								<span class="flex items-center gap-2 font-medium" style="color: {TEXT_300};">
									<span
										class="h-3 w-3 rounded-full shadow-md"
										style={`background-image: ${getGradientCSS(item.grad)}; box-shadow: 0 0 10px ${midHex(item.grad)}40;`}
									></span>
									{item.label}
								</span>
								<span class="font-bold tracking-tight" style="color: {TEXT_100};"
									>{item.percent}%</span
								>
							</div>
							<div
								class="h-1.5 w-full overflow-hidden rounded-full"
								style="background: {BORDER_SUBTLE};"
							>
								<div
									class="h-full rounded-full"
									style={`width:${item.percent}%; background-image:${getGradientCSS(item.grad)}; box-shadow: 0 0 8px ${midHex(item.grad)}50;`}
								></div>
							</div>
						</div>
					{/each}
				{:else}
					<p
						class="rounded-2xl border px-4 py-3 text-center text-sm"
						style="border-color:{BORDER_SUBTLE}; background:{BG_900}; color:{TEXT_300};"
					>
						A&uacute;n no hay registros para mostrar. Cuando cargues datos vas a visualizar cada
						tipo de apoyo.
					</p>
				{/if}
			</div>
		</article>
	</section>

	<section
		class="rounded-[28px] p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
		in:fadeFly={{ fade: { duration: 260 }, fly: { y: 18, duration: 340 } }}
		style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
	>
		<h3 class="mb-6 text-2xl font-bold" style="color: {TEXT_100};">Actividad de colaboradores</h3>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div
				class="rounded-[18px] p-5 text-center transition-transform duration-200 hover:-translate-y-1"
				style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
			>
				<h4 class="mb-3 text-lg font-bold" style="color: {PRIMARY_500};">Top Colaboradores</h4>
				<div class="flex items-center justify-center py-6">
					<Users class="h-10 w-10" style="color: {TEXT_400};" />
				</div>
				<p class="text-sm" style="color: {TEXT_400};">
					Aún no hay datos suficientes. ¡Animá a la comunidad a unirse!
				</p>
			</div>
			<div
				class="rounded-[18px] p-5 text-center transition-transform duration-200 hover:-translate-y-1"
				style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
			>
				<h4 class="mb-3 text-lg font-bold" style="color: {PRIMARY_300};">
					Actividades más recientes
				</h4>
				<div class="flex items-center justify-center py-6">
					<TrendingUp class="h-10 w-10 rotate-90" style="color: {TEXT_400};" />
				</div>
				<p class="text-sm" style="color: {TEXT_400};">
					La actividad comenzará a registrarse tan pronto como inicies un nuevo proyecto.
				</p>
			</div>
		</div>
	</section>

	<section
		class="grid grid-cols-1 gap-8 md:grid-cols-2"
		in:fadeFly={{ fade: { duration: 280 }, fly: { y: 20, duration: 360 } }}
	>
		<article
			class="rounded-[28px] p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
			style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
		>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-2xl font-bold" style="color: {TEXT_100};">Últimas reseñas</h3>
				<span class="text-lg font-extrabold" style="color: {PRIMARY_500};">Promedio 4.8</span>
			</div>
			<div
				class="rounded-[18px] p-6 text-center"
				style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
			>
				<p class="text-base font-medium italic" style="color: {TEXT_300};">
					"Los colaboradores aún no han dejado comentarios, pero el silencio también habla de
					comienzos"
				</p>
				<p class="mt-3 text-sm font-semibold" style="color: {TEXT_400};">
					— Equipo de Conectando Corazones
				</p>
			</div>
			<a
				href="#"
				class="group mt-6 flex w-full items-center justify-end gap-1 text-sm font-semibold transition-all duration-200 hover:text-white"
				style="color: {PRIMARY_500};"
			>
				Ver todas las rese&ntilde;as <ChevronRight
					class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</article>
		<article
			class="rounded-[28px] p-7 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
			style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
		>
			<h3 class="mb-4 text-2xl font-bold" style="color: {TEXT_100};">Aspectos a mejorar</h3>
			<div
				class="rounded-[18px] border-2 border-dashed p-6 text-center"
				style="border-color: {WARNING_COLOR}; background: {BG_900}; box-shadow: 0 4px 12px {WARNING_COLOR}20;"
			>
				<p class="text-xl font-bold" style="color: {TEXT_100};">No hay aspectos a mejorar...</p>
				<p class="text-xl font-bold" style="color: {TEXT_100};">
					¡porque todo está recién empezando!
				</p>
				<p class="mt-4 text-sm" style="color: {TEXT_400};">
					Cuando los primeros proyectos se completen, este espacio te ayudará a crecer aún más.
				</p>
			</div>
			<a
				href="#"
				class="group mt-6 flex w-full items-center justify-end gap-1 text-sm font-semibold transition-all duration-200 hover:text-white"
				style="color: {PRIMARY_500};"
			>
				Ver todas las sugerencias <ChevronRight
					class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
				/>
			</a>
		</article>
	</section>
</div>

<style>
	:global(.filter-toolbar) {
		position: relative;
	}

	:global(.filter-toolbar::before) {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 8px 18px rgba(8, 12, 32, 0.22);
	}

	:global(.filter-select) {
		-webkit-appearance: none;
		appearance: none;
		background-color: transparent;
		background-image: none !important;
		padding-right: 2.75rem;
	}

	:global(.filter-select::-ms-expand) {
		display: none;
	}
</style>
