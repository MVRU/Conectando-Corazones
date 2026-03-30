<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { toastStore } from '$lib/stores/toast';
	import TarjetasMetricasAdmin from '$lib/components/feature/admin/TarjetasMetricasAdmin.svelte';
	import TablaOnboardingAdmin from '$lib/components/feature/admin/TablaOnboardingAdmin.svelte';
	import TablaUsuariosAdmin from '$lib/components/feature/admin/TablaUsuariosAdmin.svelte';
	import TablaAuditoriaAdmin from '$lib/components/feature/admin/TablaAuditoriaAdmin.svelte';

	let { data } = $props<{ data: PageData }>();

	let activeTab = $state<'dashboard' | 'onboarding' | 'usuarios' | 'auditoria'>(
		'dashboard'
	);
	let loading = $state(false);

	let kpis = $state(data.kpis);
	let onboarding = $state(data.onboarding);
	let usuarios = $state(data.usuarios);
	let logs = $state(data.logs);
	let auditoriaPaginacion = $state(data.auditoriaPaginacion);

	let filtrosUsuarios = $state({
		rol: '',
		estado: '',
		fechaAltaDesde: ''
	});

	let filtrosAuditoria = $state({
		idObjeto: '' as string | number,
		usuarioId: '' as string | number,
		tipoObjeto: '',
		accion: '',
		atributoAfectado: '',
		fechaDesde: '',
		fechaHasta: '',
		texto: ''
	});

	const tabs = [
		{ id: 'dashboard', label: 'Inicio' },
		{ id: 'onboarding', label: 'Validación documental' },
		{ id: 'usuarios', label: 'Usuarios' },
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

	async function onAprobarOnboarding(detail: { idVerificacion: number }) {
		loading = true;
		try {
			const res = await fetch('/api/admin/onboarding', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					idVerificacion: detail.idVerificacion,
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

	async function onRechazarOnboarding(detail: { idVerificacion: number; motivo: string }) {
		loading = true;
		try {
			const res = await fetch('/api/admin/onboarding', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					idVerificacion: detail.idVerificacion,
					accion: 'rechazar',
					motivo: detail.motivo
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

	async function onToggleEstadoUsuario(detail: { idUsuario: number; habilitar: boolean }) {
		loading = true;
		try {
			const res = await fetch(`/api/admin/usuarios/${detail.idUsuario}/estado`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ habilitar: detail.habilitar })
			});
			const body = await res.json().catch(() => null);
			if (!res.ok) throw new Error(body?.error || 'No se pudo cambiar estado');
			toastStore.show({
				variant: 'success',
				message: detail.habilitar
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

	function onVerPerfil(detail: { username: string }) {
		goto(`/perfil/${detail.username}`);
	}

	async function fetchAuditoria(page: number = 1) {
		loading = true;
		try {
			const query = new URLSearchParams();
			const idObjeto = String(filtrosAuditoria.idObjeto ?? '').trim();
			const usuarioId = String(filtrosAuditoria.usuarioId ?? '').trim();
			const tipoObjeto = filtrosAuditoria.tipoObjeto.trim();
			const accion = filtrosAuditoria.accion.trim();
			const atributoAfectado = filtrosAuditoria.atributoAfectado.trim();
			const fechaDesde = filtrosAuditoria.fechaDesde.trim();
			const fechaHasta = filtrosAuditoria.fechaHasta.trim();
			const texto = filtrosAuditoria.texto.trim();
			if (idObjeto) query.set('id_objeto', idObjeto);
			if (usuarioId) query.set('usuario_id', usuarioId);
			if (tipoObjeto) query.set('tipo_objeto', tipoObjeto);
			if (accion) query.set('accion', accion);
			if (atributoAfectado) query.set('atributo_afectado', atributoAfectado);
			if (fechaDesde) query.set('fecha_desde', fechaDesde);
			if (fechaHasta) query.set('fecha_hasta', fechaHasta);
			if (texto) query.set('texto', texto);
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

	async function onBuscarAuditoria(detail: {
		idObjeto: string | number;
		usuarioId: string | number;
		tipoObjeto: string;
		accion: string;
		atributoAfectado: string;
		fechaDesde: string;
		fechaHasta: string;
		texto: string;
	}) {
		filtrosAuditoria = detail;
		await fetchAuditoria(1);
	}

	async function onCambiarPaginaAuditoria(detail: { page: number }) {
		await fetchAuditoria(detail.page);
	}
</script>

<svelte:head>
	<title>Panel Admin - Conectando Corazones</title>
</svelte:head>

<div
	class="min-h-screen overflow-x-hidden bg-[#0F1029] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-200"
>
	<!-- overlay de textura con ruido -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E');"
	></div>

	<div class="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
		<!-- Elementos Decorativos de Fondo -->
		<div
			class="fixed top-0 left-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]"
		></div>
		<div
			class="fixed top-20 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]"
		></div>
		<div
			class="fixed bottom-0 left-1/3 -z-10 h-[300px] w-[300px] translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]"
		></div>

		<!-- Información del Encabezado -->
		<div
			class="animate-fade-in-up flex w-full flex-col justify-between gap-6 md:flex-row md:items-end"
		>
			<div class="w-full">
				<div class="mb-4 flex items-center gap-2 md:mb-6">
					<span
						class="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
					>
						<span class="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
						Panel de administración
					</span>
				</div>
				<h1
					class="font-display mb-6 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:mb-8 md:text-5xl lg:text-6xl"
				>
					Panel de <span
						class="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
						>Administración</span
					>
				</h1>
			</div>
		</div>

		<!-- Pestañas -->
		<div class="animate-fade-in-up delay-100">
			<section
				class="rounded-2xl border border-white/5 bg-white/5 p-2 backdrop-blur-md shadow-sm overflow-x-auto"
			>
				<div class="flex gap-2 min-w-max p-1">
					{#each tabs as tab}
						<button
							class={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
								activeTab === tab.id
									? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 scale-105'
									: 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
							}`}
							onclick={() => (activeTab = tab.id)}
						>
							{tab.label}
						</button>
					{/each}
				</div>
			</section>
		</div>

		{#if activeTab === 'dashboard'}
			<div class="animate-fade-in-up delay-200">
				<TarjetasMetricasAdmin {kpis} />
			</div>
		{/if}

		{#if activeTab === 'onboarding'}
			<div class="animate-fade-in-up delay-200">
				<TablaOnboardingAdmin
					items={onboarding}
					{loading}
					onAprobar={onAprobarOnboarding}
					onRechazar={onRechazarOnboarding}
				/>
			</div>
		{/if}

		{#if activeTab === 'usuarios'}
			<div class="animate-fade-in-up space-y-6 delay-200">
				<section
					class="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md shadow-sm"
				>
					<div class="grid gap-4 md:grid-cols-4">
						<div class="relative">
							<select
								class="w-full appearance-none rounded-lg border border-white/10 bg-[#151730] py-2.5 pr-10 pl-4 text-sm font-medium text-slate-300 transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
								bind:value={filtrosUsuarios.rol}
							>
								<option value="">Todos los roles</option>
								<option value="administrador">Administrador</option>
								<option value="institucion">Institución</option>
								<option value="colaborador">Colaborador</option>
							</select>
						</div>
						<div class="relative">
							<select
								class="w-full appearance-none rounded-lg border border-white/10 bg-[#151730] py-2.5 pr-10 pl-4 text-sm font-medium text-slate-300 transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
								bind:value={filtrosUsuarios.estado}
							>
								<option value="">Todos los estados</option>
								<option value="activo">Activo</option>
								<option value="pendiente">Pendiente</option>
								<option value="inhabilitado">Inhabilitado</option>
							</select>
						</div>
						<input
							type="date"
							class="rounded-lg border border-white/10 bg-[#151730] px-4 py-2.5 text-sm font-medium text-slate-300 transition-all focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
							bind:value={filtrosUsuarios.fechaAltaDesde}
						/>
						<button
							class="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
							onclick={refreshUsuarios}
						>
							Aplicar filtros
						</button>
					</div>
				</section>

				<TablaUsuariosAdmin
					users={usuarios}
					{loading}
					onToggleEstado={onToggleEstadoUsuario}
					onVerPerfil={onVerPerfil}
				/>
			</div>
		{/if}

		{#if activeTab === 'auditoria'}
			<div class="animate-fade-in-up delay-200">
				<TablaAuditoriaAdmin
					logs={logs}
					{loading}
					filtros={filtrosAuditoria}
					paginacion={auditoriaPaginacion}
					onBuscar={onBuscarAuditoria}
					onCambiarPagina={onCambiarPaginaAuditoria}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Animación personalizada de aparición (Fade In) */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		opacity: 0;
	}
	.delay-100 {
		animation-delay: 100ms;
	}
	.delay-200 {
		animation-delay: 200ms;
	}
</style>
