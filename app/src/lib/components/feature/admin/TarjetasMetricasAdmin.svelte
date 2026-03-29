<script lang="ts">
	import type { KpisPanelAdminDto } from '$lib/domain/types/dto/PanelAdmin';
	export let kpis: KpisPanelAdminDto;
</script>

<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
	<div class="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm" title="Total de usuarios con cuenta creada">
		<p class="text-xs font-semibold tracking-wide text-blue-700 uppercase">Usuarios</p>
		<p class="mt-2 text-2xl font-bold text-[#0f1029]">{kpis.totalUsuarios}</p>
		<p class="mt-1 text-xs text-blue-700">Activos {kpis.usuariosActivos} · Pendientes {kpis.usuariosPendientes}</p>
	</div>

	<div class="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm" title="Proyectos con estado en curso">
		<p class="text-xs font-semibold tracking-wide text-emerald-700 uppercase">Proyectos en curso</p>
		<p class="mt-2 text-2xl font-bold text-emerald-800">{kpis.proyectosEnCurso}</p>
		<p class="mt-1 text-xs text-emerald-700">Finalizados {kpis.proyectosFinalizados}</p>
	</div>

	<div class="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm" title="Reportes pendientes de resolución administrativa">
		<p class="text-xs font-semibold tracking-wide text-amber-700 uppercase">Reportes</p>
		<p class="mt-2 text-2xl font-bold text-amber-800">{kpis.reportesPendientes}</p>
		<p class="mt-1 text-xs text-amber-700">Pendientes de resolución</p>
	</div>

	<div class="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm" title="Solicitudes de validación documental en estado pendiente">
		<p class="text-xs font-semibold tracking-wide text-purple-700 uppercase">Validación documental</p>
		<p class="mt-2 text-2xl font-bold text-purple-800">{kpis.onboardingPendiente}</p>
		<p class="mt-1 text-xs text-purple-700">Solicitudes documentales pendientes</p>
	</div>
</section>

<section class="grid gap-4 sm:grid-cols-3">
	<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" title="Distribución total por tipo de cuenta">
		<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Roles</p>
		<p class="mt-2 text-sm text-gray-700">
			Admin: {kpis.usuariosPorRol.administrador ?? 0} · Instituciones: {kpis.usuariosPorRol.institucion ?? 0}
			· Colaboradores: {kpis.usuariosPorRol.colaborador ?? 0}
		</p>
	</div>
	<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" title="Resumen de cuentas inhabilitadas y pendientes de validación">
		<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Estado de cuentas</p>
		<p class="mt-2 text-xl font-bold text-red-700">Inhabilitados: {kpis.usuariosInhabilitados}</p>
		<p class="mt-1 text-sm font-semibold text-amber-700">Pendientes: {kpis.usuariosPendientes}</p>
	</div>
	<div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" title="Incluye reportes desestimados y resueltos en los últimos 30 días">
		<p class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Reportes resueltos (30 días)</p>
		<p class="mt-2 text-xl font-bold text-blue-700">{kpis.reportesResueltosMes}</p>
	</div>
</section>
