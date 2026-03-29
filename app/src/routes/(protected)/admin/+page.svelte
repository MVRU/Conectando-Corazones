<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';
	import TarjetasMetricasAdmin from '$lib/components/feature/admin/TarjetasMetricasAdmin.svelte';
	import TablaOnboardingAdmin from '$lib/components/feature/admin/TablaOnboardingAdmin.svelte';
	import TablaUsuariosAdmin from '$lib/components/feature/admin/TablaUsuariosAdmin.svelte';
	import TablaReportesAdmin from '$lib/components/feature/admin/TablaReportesAdmin.svelte';
	import TablaAuditoriaAdmin from '$lib/components/feature/admin/TablaAuditoriaAdmin.svelte';
	import type {
		KpisPanelAdminDto,
		RegistroAuditoriaAdminDto,
		ReporteAdminItemDto,
		SolicitudOnboardingAdminDto,
		UsuarioAdminItemDto
	} from '$lib/domain/types/dto/PanelAdmin';

	export let data: PageData;

	let activeTab: 'dashboard' | 'onboarding' | 'usuarios' | 'reportes' | 'auditoria' = 'dashboard';
	let loading = false;

	let kpis: KpisPanelAdminDto = data.kpis;
	let onboarding: SolicitudOnboardingAdminDto[] = data.onboarding;
	let usuarios: UsuarioAdminItemDto[] = data.usuarios;
	let reportes: ReporteAdminItemDto[] = data.reportes;
	let logs: RegistroAuditoriaAdminDto[] = data.logs;
	let auditoriaPaginacion = data.auditoriaPaginacion;

	let filtrosUsuarios = {
		rol: '',
		estado: '',
		fechaAltaDesde: ''
	};

	let filtrosAuditoria = {
		idObjeto: '' as string | number,
		usuarioId: '' as string | number
	};

	const tabs = [
		{ id: 'dashboard', label: 'Inicio' },
		{ id: 'onboarding', label: 'Validación documental' },
		{ id: 'usuarios', label: 'Usuarios' },
		{ id: 'reportes', label: 'Reportes' },
		{ id: 'auditoria', label: 'Auditoría' }
	] as const;

	async function refreshDashboard() {
		const res = await fetch('/api/admin/dashboard');
		if (res.ok) kpis = await res.json();
	}

	async function refreshOnboarding() {
		const res = await fetch('/api/admin/onboarding');
		if (res.ok) onboarding = await res.json();
	}

	async function refreshUsuarios() {
		const query = new URLSearchParams();
		if (filtrosUsuarios.rol) query.set('rol', filtrosUsuarios.rol);
		if (filtrosUsuarios.estado) query.set('estado', filtrosUsuarios.estado);
		if (filtrosUsuarios.fechaAltaDesde) query.set('fechaAltaDesde', filtrosUsuarios.fechaAltaDesde);
		const res = await fetch(`/api/admin/usuarios?${query.toString()}`);
		if (res.ok) usuarios = await res.json();
	}

	async function refreshReportes() {
		const res = await fetch('/api/admin/reportes');
		if (res.ok) reportes = await res.json();
	}

	async function onAprobarOnboarding(event: CustomEvent<{ idVerificacion: number }>) {
		loading = true;
		try {
			const res = await fetch('/api/admin/onboarding', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					idVerificacion: event.detail.idVerificacion,
					accion: 'aprobar'
				})
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo aprobar');
			toastStore.show({ variant: 'success', message: 'Solicitud aprobada correctamente.' });
			await Promise.all([refreshOnboarding(), refreshDashboard(), refreshUsuarios()]);
		} catch (error) {
			toastStore.show({
				variant: 'error',
				message: error instanceof Error ? error.message : 'Error al aprobar solicitud.'
			});
		} finally {
			loading = false;
		}
	}

	async function onRechazarOnboarding(event: CustomEvent<{ idVerificacion: number; motivo: string }>) {
		loading = true;
		try {
			const res = await fetch('/api/admin/onboarding', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					idVerificacion: event.detail.idVerificacion,
					accion: 'rechazar',
					motivo: event.detail.motivo
				})
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo rechazar');
			toastStore.show({ variant: 'success', message: 'Solicitud rechazada y notificada.' });
			await Promise.all([refreshOnboarding(), refreshDashboard(), refreshUsuarios()]);
		} catch (error) {
			toastStore.show({
				variant: 'error',
				message: error instanceof Error ? error.message : 'Error al rechazar solicitud.'
			});
		} finally {
			loading = false;
		}
	}

	async function onToggleEstadoUsuario(event: CustomEvent<{ idUsuario: number; habilitar: boolean }>) {
		loading = true;
		try {
			const res = await fetch(`/api/admin/usuarios/${event.detail.idUsuario}/estado`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ habilitar: event.detail.habilitar })
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo cambiar estado');
			toastStore.show({
				variant: 'success',
				message: event.detail.habilitar
					? 'Cuenta habilitada correctamente.'
					: 'Cuenta inhabilitada correctamente.'
			});
			await Promise.all([refreshUsuarios(), refreshDashboard()]);
		} catch (error) {
			toastStore.show({
				variant: 'error',
				message: error instanceof Error ? error.message : 'Error al actualizar usuario.'
			});
		} finally {
			loading = false;
		}
	}

	function onVerPerfil(event: CustomEvent<{ username: string }>) {
		goto(`/perfil/${event.detail.username}`);
	}

	async function onResolverReporte(
		event: CustomEvent<{
			reporteId: number;
			accion: 'desestimar' | 'inhabilitar_cuenta' | 'forzar_baja_proyecto';
			comentario: string;
		}>
	) {
		loading = true;
		try {
			const res = await fetch('/api/admin/reportes', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(event.detail)
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo resolver reporte');
			toastStore.show({ variant: 'success', message: 'Reporte resuelto.' });
			await Promise.all([refreshReportes(), refreshDashboard(), refreshUsuarios()]);
		} catch (error) {
			toastStore.show({
				variant: 'error',
				message: error instanceof Error ? error.message : 'Error al resolver reporte.'
			});
		} finally {
			loading = false;
		}
	}

	async function fetchAuditoria(page: number = 1) {
		loading = true;
		try {
			const query = new URLSearchParams();
			const idObjeto = String(filtrosAuditoria.idObjeto ?? '').trim();
			const usuarioId = String(filtrosAuditoria.usuarioId ?? '').trim();
			if (idObjeto) query.set('id_objeto', idObjeto);
			if (usuarioId) query.set('usuario_id', usuarioId);
			query.set('page', String(page));
			query.set('pageSize', String(auditoriaPaginacion.pageSize || 100));
			const res = await fetch(`/api/admin/auditoria?${query.toString()}`);
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo consultar auditoría');
			logs = body.items;
			auditoriaPaginacion = {
				total: body.total,
				page: body.page,
				pageSize: body.pageSize
			};
		} catch (error) {
			toastStore.show({
				variant: 'error',
				message: error instanceof Error ? error.message : 'Error al consultar auditoría.'
			});
		} finally {
			loading = false;
		}
	}

	async function onBuscarAuditoria(event: CustomEvent<{ idObjeto: string | number; usuarioId: string | number }>) {
		filtrosAuditoria = event.detail;
		await fetchAuditoria(1);
	}

	async function onCambiarPaginaAuditoria(event: CustomEvent<{ page: number }>) {
		await fetchAuditoria(event.detail.page);
	}
</script>

<svelte:head>
	<title>Panel Admin - Conectando Corazones</title>
</svelte:head>

<main class="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
	<section class="rounded-2xl border border-blue-100 bg-gradient-to-r from-[#0f1029] to-[#1b2a5a] p-6 shadow-sm">
		<h1 class="text-2xl font-bold text-white">Panel de Administración</h1>
	</section>

	<section class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
		<div class="flex flex-wrap gap-2">
			{#each tabs as tab}
				<button
					class={`rounded-full px-4 py-2 text-sm font-semibold transition ${
						activeTab === tab.id
							? 'bg-[#0f1029] text-white'
							: 'bg-blue-50 text-blue-900 hover:bg-blue-100'
					}`}
					on:click={() => (activeTab = tab.id)}
				>
					{tab.label}
				</button>
			{/each}
		</div>
	</section>

	{#if activeTab === 'dashboard'}
		<TarjetasMetricasAdmin {kpis} />
	{/if}

	{#if activeTab === 'onboarding'}
		<TablaOnboardingAdmin
			items={onboarding}
			{loading}
			on:aprobar={onAprobarOnboarding}
			on:rechazar={onRechazarOnboarding}
		/>
	{/if}

	{#if activeTab === 'usuarios'}
		<section class="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
			<div class="grid gap-3 md:grid-cols-4">
				<select class="rounded-lg border border-blue-200 bg-white p-2 text-sm" bind:value={filtrosUsuarios.rol}>
					<option value="">Todos los roles</option>
					<option value="administrador">Administrador</option>
					<option value="institucion">Institución</option>
					<option value="colaborador">Colaborador</option>
				</select>
				<select class="rounded-lg border border-blue-200 bg-white p-2 text-sm" bind:value={filtrosUsuarios.estado}>
					<option value="">Todos los estados</option>
					<option value="activo">Activo</option>
					<option value="pendiente">Pendiente</option>
					<option value="inhabilitado">Inhabilitado</option>
				</select>
				<input
					type="date"
					class="rounded-lg border border-blue-200 bg-white p-2 text-sm"
					bind:value={filtrosUsuarios.fechaAltaDesde}
				/>
				<button
					class="rounded-lg bg-[#0f1029] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1b2a5a]"
					on:click={refreshUsuarios}
				>
					Aplicar filtros
				</button>
			</div>
		</section>

		<TablaUsuariosAdmin
			users={usuarios}
			{loading}
			on:toggleEstado={onToggleEstadoUsuario}
			on:verPerfil={onVerPerfil}
		/>
	{/if}

	{#if activeTab === 'reportes'}
		<TablaReportesAdmin reportes={reportes} {loading} on:resolver={onResolverReporte} />
	{/if}

	{#if activeTab === 'auditoria'}
		<TablaAuditoriaAdmin
			{logs}
			{loading}
			filtros={filtrosAuditoria}
			paginacion={auditoriaPaginacion}
			on:buscar={onBuscarAuditoria}
			on:cambiarPagina={onCambiarPaginaAuditoria}
		/>
	{/if}
</main>
