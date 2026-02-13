<script lang="ts">
	import {
		FolderOpen,
		Users,
		CalendarClock,
		Flame,
		AlertTriangle,
		Clock,
		Calendar,
		CheckCircle2,
		Smile
	} from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import type { ComponentType } from 'svelte';

	const dispatch = createEventDispatcher();

	export let metricas: {
		proyectosActivos: number;
		institucionesAlcanzadas: number;
		nuevasInstituciones: number;
		proximoCierre: number; // días pendientes
	};

	const tProyectos = tweened(0, { duration: 2000, easing: cubicOut });
	const tInstituciones = tweened(0, { duration: 2000, easing: cubicOut });
	const tCierre = tweened(0, { duration: 2000, easing: cubicOut });

	function handleReveal() {
		tProyectos.set(metricas.proyectosActivos);
		tInstituciones.set(metricas.institucionesAlcanzadas);
		tCierre.set(metricas.proximoCierre);
	}

	// Función para generar mensaje contextual según días restantes
	function getMensajeCierre(dias: number): {
		texto: string;
		icono: ComponentType;
		colorTexto: string;
		colorIcono: string;
	} {
		if (dias === 0) {
			return {
				texto: '¡Hoy es el día!',
				icono: Flame,
				colorTexto: 'text-amber-300',
				colorIcono: 'text-amber-400'
			};
		} else if (dias <= 3) {
			return {
				texto: '¡Fecha límite inminente!',
				icono: AlertTriangle,
				colorTexto: 'text-amber-300',
				colorIcono: 'text-amber-400'
			};
		} else if (dias <= 7) {
			return {
				texto: 'Fecha límite cercana',
				icono: Clock,
				colorTexto: 'text-amber-400',
				colorIcono: 'text-amber-500'
			};
		} else if (dias <= 14) {
			return {
				texto: 'Aún hay tiempo',
				icono: Calendar,
				colorTexto: 'text-amber-400',
				colorIcono: 'text-amber-500'
			};
		} else if (dias <= 30) {
			return {
				texto: 'Todo bajo control',
				icono: CheckCircle2,
				colorTexto: 'text-amber-400/80',
				colorIcono: 'text-amber-500/80'
			};
		} else {
			return {
				texto: 'Sin urgencias',
				icono: Smile,
				colorTexto: 'text-amber-400/60',
				colorIcono: 'text-amber-500/60'
			};
		}
	}

	$: mensajeCierre = getMensajeCierre(metricas.proximoCierre);
</script>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
	<!-- Métrica 1: Proyectos Totales -->
	<button
		on:click={() => dispatch('clickProyectos')}
		use:reveal={{ threshold: 0.2 }}
		on:reveal={handleReveal}
		class="reveal-hidden group relative w-full cursor-pointer overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-[40px] transition-all duration-700 group-hover:bg-emerald-500/20"
		></div>

		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium tracking-wider text-emerald-400 uppercase">Proyectos</p>
					<h3 class="mt-2 text-4xl font-bold tracking-tight text-white">
						{Math.floor($tProyectos)}
					</h3>
				</div>
				<div class="rounded-2xl bg-emerald-500/20 p-3 text-emerald-400">
					<FolderOpen size={24} />
				</div>
			</div>
			<div class="mt-4">
				<span
					class="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300"
				>
					+2 nuevos este mes
				</span>
			</div>
		</div>
	</button>

	<!-- Métrica 2: Instituciones Alcanzadas -->
	<button
		on:click={() => dispatch('clickInstituciones')}
		use:reveal={{ threshold: 0.2 }}
		class="reveal-hidden group relative w-full cursor-pointer overflow-hidden rounded-[2rem] border border-blue-500/20 bg-blue-500/10 p-6 text-left backdrop-blur-md transition-all delay-100 duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px] transition-all duration-700 group-hover:bg-blue-500/20"
		></div>

		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium tracking-wider text-blue-400 uppercase">
						Instituciones Alcanzadas
					</p>
					<h3 class="mt-2 text-4xl font-bold tracking-tight text-white">
						{Math.floor($tInstituciones)}
					</h3>
				</div>
				<div class="rounded-2xl bg-blue-500/20 p-3 text-blue-400">
					<Users size={24} />
				</div>
			</div>
			<div class="mt-4">
				<span class="text-sm text-slate-400">
					<span class="font-bold text-blue-400">+{metricas.nuevasInstituciones}</span> nuevas este mes
				</span>
			</div>
		</div>
	</button>

	<!-- Métrica 3: Próximo Cierre -->
	<button
		on:click={() => dispatch('clickAgenda')}
		use:reveal={{ threshold: 0.2 }}
		class="reveal-hidden group relative w-full cursor-pointer overflow-hidden rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6 text-left backdrop-blur-md transition-all delay-200 duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-amber-500/10 blur-[40px] transition-all duration-700 group-hover:bg-amber-500/20"
		></div>

		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-sm font-medium tracking-wider text-amber-400 uppercase">Próximo cierre</p>
					<h3 class="mt-2 text-4xl font-bold tracking-tight text-white">
						{Math.floor($tCierre)} <span class="text-lg font-medium text-slate-400">días</span>
					</h3>
				</div>
				<div class="rounded-2xl bg-amber-500/20 p-3 text-amber-400">
					<CalendarClock size={24} />
				</div>
			</div>
			<div class="mt-4">
				<span class="flex items-center gap-1.5 text-sm {mensajeCierre.colorTexto}">
					<svelte:component this={mensajeCierre.icono} size={16} class={mensajeCierre.colorIcono} />
					{mensajeCierre.texto}
				</span>
			</div>
		</div>
	</button>
</div>
