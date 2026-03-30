<script lang="ts">
	import type { KpisPanelAdminDto } from '$lib/domain/types/dto/PanelAdmin';
	import {
		Users,
		FolderOpen,
		ShieldAlert,
		ClipboardCheck,
		UserCog,
		Activity,
		CheckCircle2
	} from 'lucide-svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let kpis: KpisPanelAdminDto;

	// Animaciones para los números principales
	const tUsuarios = tweened(0, { duration: 2000, easing: cubicOut });
	const tProyectos = tweened(0, { duration: 2000, easing: cubicOut });
	const tReportes = tweened(0, { duration: 2000, easing: cubicOut });
	const tOnboarding = tweened(0, { duration: 2000, easing: cubicOut });

	onMount(() => {
		tUsuarios.set(kpis.totalUsuarios);
		tProyectos.set(kpis.proyectosEnCurso);
		tReportes.set(kpis.reportesPendientes);
		tOnboarding.set(kpis.onboardingPendiente);
	});

	// Reactividad para cuando cambian los KPIs (ej: filtros)
	$: {
		tUsuarios.set(kpis.totalUsuarios);
		tProyectos.set(kpis.proyectosEnCurso);
		tReportes.set(kpis.reportesPendientes);
		tOnboarding.set(kpis.onboardingPendiente);
	}
</script>

<!-- KPIs Principales -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
	<!-- Usuarios -->
	<div
		class="group relative overflow-hidden rounded-[2rem] border border-blue-500/20 bg-blue-500/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-blue-500/10 blur-[40px] transition-all duration-700 group-hover:bg-blue-500/20"
		></div>
		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-xs font-bold tracking-widest text-blue-400 uppercase">Usuarios Totales</p>
					<h3 class="mt-3 text-4xl font-black tracking-tighter text-white">
						{Math.floor($tUsuarios)}
					</h3>
				</div>
				<div class="rounded-2xl bg-blue-500/20 p-3 text-blue-400 shadow-inner">
					<Users size={24} />
				</div>
			</div>
			<div class="mt-5 flex items-center gap-3">
				<span
					class="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30"
				>
					{kpis.usuariosActivos} Activos
				</span>
				<span
					class="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30"
				>
					{kpis.usuariosPendientes} Pendientes
				</span>
			</div>
		</div>
	</div>

	<!-- Proyectos -->
	<div
		class="group relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-[40px] transition-all duration-700 group-hover:bg-emerald-500/20"
		></div>
		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-xs font-bold tracking-widest text-emerald-400 uppercase">
						Proyectos en curso
					</p>
					<h3 class="mt-3 text-4xl font-black tracking-tighter text-white">
						{Math.floor($tProyectos)}
					</h3>
				</div>
				<div class="rounded-2xl bg-emerald-500/20 p-3 text-emerald-400 shadow-inner">
					<FolderOpen size={24} />
				</div>
			</div>
			<div class="mt-5">
				<p class="text-xs font-medium text-slate-400">
					<span class="text-emerald-400 font-bold">{kpis.proyectosFinalizados}</span> finalizados exitosamente
				</p>
			</div>
		</div>
	</div>

	<!-- Reportes -->
	<a
		href="/reportes"
		class="group relative overflow-hidden rounded-[2rem] border border-rose-500/20 bg-rose-500/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 block"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-rose-500/10 blur-[40px] transition-all duration-700 group-hover:bg-rose-500/20"
		></div>
		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-xs font-bold tracking-widest text-rose-400 uppercase">Reportes</p>
					<h3 class="mt-3 text-4xl font-black tracking-tighter text-white">
						{Math.floor($tReportes)}
					</h3>
				</div>
				<div class="rounded-2xl bg-rose-500/20 p-3 text-rose-400 shadow-inner">
					<ShieldAlert size={24} />
				</div>
			</div>
			<div class="mt-5 space-y-1">
				<span
					class="inline-flex items-center gap-1 text-xs font-bold {kpis.reportesPendientes > 0
						? 'text-rose-400 animate-pulse'
						: 'text-slate-400'}"
				>
					{#if kpis.reportesPendientes > 0}
						Atención requerida
					{:else}
						Todo al día
					{/if}
				</span>
				<p class="text-[11px] font-semibold text-rose-300/90 group-hover:text-rose-200">
					Ir a Gestión de reportes
				</p>
			</div>
		</div>
	</a>

	<!-- Validación -->
	<div
		class="group relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
	>
		<div
			class="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-purple-500/10 blur-[40px] transition-all duration-700 group-hover:bg-purple-500/20"
		></div>
		<div class="relative z-10 flex h-full flex-col justify-between">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-xs font-bold tracking-widest text-purple-400 uppercase">Validación</p>
					<h3 class="mt-3 text-4xl font-black tracking-tighter text-white">
						{Math.floor($tOnboarding)}
					</h3>
				</div>
				<div class="rounded-2xl bg-purple-500/20 p-3 text-purple-400 shadow-inner">
					<ClipboardCheck size={24} />
				</div>
			</div>
			<div class="mt-5">
				<p class="text-xs font-medium text-slate-400">Solicitudes pendientes de revisión</p>
			</div>
		</div>
	</div>
</div>

<!-- Resumen Secundario -->
<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
	<!-- Roles -->
	<div
		class="rounded-[1.5rem] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
	>
		<div class="mb-4 flex items-center gap-2">
			<UserCog size={18} class="text-slate-400" />
			<p class="text-xs font-bold tracking-widest text-slate-500 uppercase">Distribución de Roles</p>
		</div>
		<div class="flex flex-col gap-3">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-slate-300">Administradores</span>
				<span class="text-sm font-black text-white">{kpis.usuariosPorRol.administrador ?? 0}</span>
			</div>
			<div class="h-1 w-full rounded-full bg-white/5 overflow-hidden">
				<div
					class="h-full bg-blue-500"
					style="width: {((kpis.usuariosPorRol.administrador || 0) / kpis.totalUsuarios) * 100}%"
				></div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-slate-300">Instituciones</span>
				<span class="text-sm font-black text-white">{kpis.usuariosPorRol.institucion ?? 0}</span>
			</div>
			<div class="h-1 w-full rounded-full bg-white/5 overflow-hidden">
				<div
					class="h-full bg-emerald-500"
					style="width: {((kpis.usuariosPorRol.institucion || 0) / kpis.totalUsuarios) * 100}%"
				></div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-slate-300">Colaboradores</span>
				<span class="text-sm font-black text-white">{kpis.usuariosPorRol.colaborador ?? 0}</span>
			</div>
			<div class="h-1 w-full rounded-full bg-white/5 overflow-hidden">
				<div
					class="h-full bg-purple-500"
					style="width: {((kpis.usuariosPorRol.colaborador || 0) / kpis.totalUsuarios) * 100}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Estado General -->
	<div
		class="rounded-[1.5rem] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
	>
		<div class="mb-4 flex items-center gap-2">
			<Activity size={18} class="text-slate-400" />
			<p class="text-xs font-bold tracking-widest text-slate-500 uppercase">Estado General</p>
		</div>
		<div class="space-y-4">
			<div class="flex items-center justify-between rounded-xl bg-rose-500/10 p-4 border border-rose-500/20">
				<div>
					<p class="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Inhabilitados</p>
					<p class="text-2xl font-black text-white">{kpis.usuariosInhabilitados}</p>
				</div>
                <div class="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                    !
                </div>
			</div>
			<div class="flex items-center justify-between rounded-xl bg-amber-500/10 p-4 border border-amber-500/20">
				<div>
					<p class="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Pendientes</p>
					<p class="text-2xl font-black text-white">{kpis.usuariosPendientes}</p>
				</div>
                <div class="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold italic">
                    ?
                </div>
			</div>
		</div>
	</div>

	<!-- Rendimiento -->
	<div
		class="rounded-[1.5rem] border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 flex flex-col justify-between"
	>
		<div>
			<div class="mb-4 flex items-center gap-2">
				<CheckCircle2 size={18} class="text-emerald-400" />
				<p class="text-xs font-bold tracking-widest text-slate-500 uppercase">Resolución mensual</p>
			</div>
			<div class="mt-6 flex flex-col items-center justify-center text-center">
				<p class="text-6xl font-black text-white tracking-tighter">{kpis.reportesResueltosMes}</p>
				<p class="mt-2 text-sm font-bold text-emerald-400 uppercase tracking-widest">
					Reportes resueltos
				</p>
			</div>
		</div>
		<div class="mt-6">
			<p class="text-center text-[10px] font-medium text-slate-500 uppercase tracking-[0.2em]">
				Últimos 30 días
			</p>
		</div>
	</div>
</div>


