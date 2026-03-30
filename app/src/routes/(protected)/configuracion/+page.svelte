<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import Modal from '$lib/components/ui/overlays/Modal.svelte';
	import { usuario as currentUser, authActions } from '$lib/stores/auth';
	import type { PageData } from './$types';
	import { toastStore } from '$lib/stores/toast';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { Bell, Trash2, Settings, UserCircle2, ChevronRight, ShieldCheck, AlertTriangle, Eye, EyeOff } from 'lucide-svelte';

	let { data } = $props<{ data: PageData }>();

	let usuario = $derived($currentUser ?? data.usuario);

	type Tab = 'seguridad' | 'notificaciones' | 'cuenta';
	let tabActiva = $state<Tab>('seguridad');
	let montado = $state(false);

	$effect(() => {
		const t = setTimeout(() => (montado = true), 50);
		return () => clearTimeout(t);
	});

	let passActual = $state('');
	let passNueva = $state('');
	let passConfirm = $state('');
	let mostrarPassActual = $state(false);
	let mostrarPassNueva = $state(false);
	let mostrarPassConfirm = $state(false);

	let notificacionesPush = $state(true);
	let notificacionesMail = $state(true);

	let isLoadingPassword = $state(false);
	let isLoadingDelete = $state(false);
	let showDeleteModal = $state(false);

	type TabItem = { id: Tab; label: string; icon: typeof ShieldCheck };
	const tabs: TabItem[] = [
		{ id: 'seguridad', label: 'Seguridad', icon: ShieldCheck },
		{ id: 'notificaciones', label: 'Notificaciones', icon: Bell },
		{ id: 'cuenta', label: 'Mi cuenta', icon: UserCircle2 }
	];

	function obtenerNombreDisplay(): string {
		const u = usuario as Record<string, string | undefined>;
		if (u?.rol === 'institucion') return u.nombre_legal || u.nombre || '';
		if (u?.rol === 'colaborador' && u?.tipo_colaborador === 'organizacion') return u.razon_social || `${u.nombre} ${u.apellido}`;
		return `${u?.nombre || ''} ${u?.apellido || ''}`.trim();
	}

	async function cambiarPassword() {
		if (!passActual.trim()) {
			toastStore.show({ variant: 'error', title: 'Falta contraseña actual', message: 'Para tu seguridad, ingresá tu contraseña actual.' });
			return;
		}
		if (!passNueva.trim()) {
			toastStore.show({ variant: 'error', title: 'Campo requerido', message: 'Por favor, ingresá una contraseña nueva.' });
			return;
		}
		if (passNueva.length < 8) {
			toastStore.show({ variant: 'error', title: 'Contraseña muy corta', message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
			return;
		}
		if (passNueva !== passConfirm) {
			toastStore.show({ variant: 'error', title: 'Error de validación', message: 'Las contraseñas nuevas no coinciden.' });
			return;
		}
		isLoadingPassword = true;
		try {
			const res = await fetch('/api/usuarios/me/contrasena', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nuevaContrasena: passNueva })
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? 'Error al cambiar la contraseña');
			}
			passActual = '';
			passNueva = '';
			passConfirm = '';
			toastStore.show({ variant: 'success', title: 'Contraseña actualizada', message: 'Tu contraseña se cambió con éxito.' });
		} catch (err) {
			toastStore.show({ variant: 'error', title: 'Error', message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.' });
		} finally {
			isLoadingPassword = false;
		}
	}

	async function confirmarEliminarCuenta() {
		isLoadingDelete = true;
		try {
			const res = await fetch('/api/usuarios/me', { method: 'DELETE' });
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? 'No se pudo eliminar la cuenta');
			}
			showDeleteModal = false;
			await authActions.logout();
			goto('/');
		} catch (err) {
			isLoadingDelete = false;
			toastStore.show({ variant: 'error', title: 'Error', message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.' });
		}
	}
</script>

<svelte:head>
	<title>Configuración | Conectando Corazones</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Banner header -->
	<div class="relative overflow-hidden border-b border-gray-100 bg-white">
		<div class="absolute inset-0 bg-gradient-to-r from-[#007FFF]/5 via-transparent to-[#42A1FF]/5"></div>
		<div class="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
			{#if montado}
				<div in:fly={{ y: -10, duration: 350, easing: cubicOut }}>
					<div class="flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#007FFF] to-[#42A1FF] shadow-sm">
							<Settings class="h-5 w-5 text-white" />
						</div>
						<div>
							<h1 class="text-xl font-bold text-gray-900 sm:text-2xl">Configuración</h1>
							<p class="text-sm text-gray-500">Gestioná tu seguridad, notificaciones y cuenta</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
		{#if montado}
			<div class="flex flex-col gap-6 lg:flex-row lg:gap-8" in:fly={{ y: 20, duration: 400, easing: cubicOut }}>

				<!-- Sidebar de navegación -->
				<aside class="lg:w-64 lg:shrink-0">
					<!-- Card de perfil / link rápido -->
					<div class="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
						<a
							href="/perfil/{usuario?.username}"
							class="group flex items-center gap-3 p-4 transition-all duration-200 hover:bg-blue-50/50"
						>
							<div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#007FFF]/20">
								<img
									src={usuario?.url_foto ?? '/logo-1.png'}
									alt="Avatar"
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							</div>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-semibold text-gray-900">{obtenerNombreDisplay()}</p>
								<p class="text-xs text-[#007FFF]">Ver mi perfil público →</p>
							</div>
							<ChevronRight class="h-4 w-4 shrink-0 text-gray-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#007FFF]" />
						</a>
					</div>

					<!-- Tabs de navegación -->
					<nav class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
						{#each tabs as tab, i (tab.id)}
							<button
								onclick={() => (tabActiva = tab.id)}
								class="flex w-full items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all duration-200 {i < tabs.length - 1 ? 'border-b border-gray-50' : ''} {tabActiva === tab.id
									? 'bg-gradient-to-r from-[#007FFF]/8 to-blue-50/60 text-[#007FFF]'
									: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
							>
								<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 {tabActiva === tab.id ? 'bg-[#007FFF] shadow-sm' : 'bg-gray-100'}">
									<tab.icon class="h-4 w-4 {tabActiva === tab.id ? 'text-white' : 'text-gray-500'}" />
								</div>
								{tab.label}
								{#if tabActiva === tab.id}
									<div class="ml-auto h-1.5 w-1.5 rounded-full bg-[#007FFF]"></div>
								{/if}
							</button>
						{/each}
					</nav>
				</aside>

				<!-- Contenido principal -->
				<div class="min-w-0 flex-1">

					<!-- Tab: Seguridad -->
					{#if tabActiva === 'seguridad'}
						<div in:fly={{ x: 16, duration: 300, easing: cubicOut }}>
							<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="border-b border-gray-50 px-6 py-5">
									<h2 class="flex items-center gap-2 text-base font-bold text-gray-900">
										<ShieldCheck class="h-5 w-5 text-[#007FFF]" />
										Cambiar contraseña
									</h2>
									<p class="mt-0.5 text-sm text-gray-500">Elegí una contraseña segura de al menos 8 caracteres.</p>
								</div>
								<div class="p-6">
									<div class="flex flex-col gap-5">
										<!-- Contraseña actual -->
										<div>
											<label for="passActual" class="mb-1.5 block text-sm font-semibold text-gray-700">
												Contraseña actual
											</label>
											<div class="relative">
												<Input
													id="passActual"
													type={mostrarPassActual ? 'text' : 'password'}
													bind:value={passActual}
													customClass="block w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 shadow-sm transition focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]/20 focus:outline-none"
												/>
												<button
													type="button"
													onclick={() => (mostrarPassActual = !mostrarPassActual)}
													class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
													aria-label="Mostrar/ocultar contraseña"
												>
													{#if mostrarPassActual}
														<EyeOff class="h-4 w-4" />
													{:else}
														<Eye class="h-4 w-4" />
													{/if}
												</button>
											</div>
										</div>
										<!-- Nueva contraseña -->
										<div>
											<label for="passNueva" class="mb-1.5 block text-sm font-semibold text-gray-700">
												Nueva contraseña
											</label>
											<div class="relative">
												<Input
													id="passNueva"
													type={mostrarPassNueva ? 'text' : 'password'}
													bind:value={passNueva}
													customClass="block w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 shadow-sm transition focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]/20 focus:outline-none"
												/>
												<button
													type="button"
													onclick={() => (mostrarPassNueva = !mostrarPassNueva)}
													class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
													aria-label="Mostrar/ocultar contraseña"
												>
													{#if mostrarPassNueva}
														<EyeOff class="h-4 w-4" />
													{:else}
														<Eye class="h-4 w-4" />
													{/if}
												</button>
											</div>
										</div>
										<!-- Confirmar contraseña -->
										<div>
											<label for="passConfirm" class="mb-1.5 block text-sm font-semibold text-gray-700">
												Confirmar contraseña
											</label>
											<div class="relative">
												<Input
													id="passConfirm"
													type={mostrarPassConfirm ? 'text' : 'password'}
													bind:value={passConfirm}
													customClass="block w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 shadow-sm transition focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF]/20 focus:outline-none"
												/>
												<button
													type="button"
													onclick={() => (mostrarPassConfirm = !mostrarPassConfirm)}
													class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
													aria-label="Mostrar/ocultar contraseña"
												>
													{#if mostrarPassConfirm}
														<EyeOff class="h-4 w-4" />
													{:else}
														<Eye class="h-4 w-4" />
													{/if}
												</button>
											</div>
											{#if passNueva && passConfirm && passNueva !== passConfirm}
												<p class="mt-1.5 text-xs font-medium text-[#DE1C38]">Las contraseñas no coinciden</p>
											{/if}
										</div>
									</div>
									<div class="mt-6 flex justify-end">
										<Button
											label="Cambiar contraseña"
											loadingLabel="Cambiando..."
											variant="primary"
											loading={isLoadingPassword}
											onclick={cambiarPassword}
										/>
									</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- Tab: Notificaciones -->
					{#if tabActiva === 'notificaciones'}
						<div in:fly={{ x: 16, duration: 300, easing: cubicOut }}>
							<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="border-b border-gray-50 px-6 py-5">
									<h2 class="flex items-center gap-2 text-base font-bold text-gray-900">
										<Bell class="h-5 w-5 text-[#007FFF]" />
										Notificaciones
									</h2>
									<p class="mt-0.5 text-sm text-gray-500">Elegí cómo querés recibir novedades sobre proyectos y actividad.</p>
								</div>
								<div class="divide-y divide-gray-50 p-6">
									<label class="flex cursor-pointer items-center justify-between gap-4 pb-4 select-none">
										<div>
											<p class="text-sm font-semibold text-gray-800">Notificaciones Push</p>
											<p class="mt-0.5 text-xs text-gray-500">Alertas en tiempo real sobre postulaciones y mensajes.</p>
										</div>
										<input type="checkbox" bind:checked={notificacionesPush} class="sr-only" />
										<div class="relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 {notificacionesPush ? 'bg-[#007FFF]' : 'bg-gray-200'}">
											<div class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 {notificacionesPush ? 'translate-x-5' : 'translate-x-0'}"></div>
										</div>
									</label>
									<label class="flex cursor-pointer items-center justify-between gap-4 pt-4 select-none">
										<div>
											<p class="text-sm font-semibold text-gray-800">Notificaciones por Email</p>
											<p class="mt-0.5 text-xs text-gray-500">Resúmenes semanales y novedades importantes por correo.</p>
										</div>
										<input type="checkbox" bind:checked={notificacionesMail} class="sr-only" />
										<div class="relative h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 {notificacionesMail ? 'bg-[#007FFF]' : 'bg-gray-200'}">
											<div class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 {notificacionesMail ? 'translate-x-5' : 'translate-x-0'}"></div>
										</div>
									</label>
								</div>
							</div>
						</div>
					{/if}

					<!-- Tab: Mi cuenta -->
					{#if tabActiva === 'cuenta'}
						<div in:fly={{ x: 16, duration: 300, easing: cubicOut }}>
							<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
								<div class="border-b border-gray-50 px-6 py-5">
									<h2 class="flex items-center gap-2 text-base font-bold text-gray-900">
										<UserCircle2 class="h-5 w-5 text-[#007FFF]" />
										Mi cuenta
									</h2>
									<p class="mt-0.5 text-sm text-gray-500">
										Para editar tu foto, datos personales o preferencias, visitá tu perfil público.
									</p>
								</div>
								<div class="p-6">
									<!-- Enlace al perfil -->
									<a
										href="/perfil/{usuario?.username}"
										class="group mb-6 flex items-center gap-4 rounded-2xl border border-[#007FFF]/20 bg-gradient-to-r from-blue-50 to-blue-50/40 p-4 transition-all duration-200 hover:border-[#007FFF]/40 hover:shadow-sm"
									>
										<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#007FFF] to-[#42A1FF] shadow-sm">
											<UserCircle2 class="h-6 w-6 text-white" />
										</div>
										<div class="flex-1">
											<p class="text-sm font-semibold text-gray-900">Editar perfil público</p>
											<p class="text-xs text-gray-500">Foto, descripción, contactos y preferencias</p>
										</div>
										<ChevronRight class="h-4 w-4 text-[#007FFF] transition-transform duration-200 group-hover:translate-x-1" />
									</a>

									<!-- Zona de peligro -->
									<div class="overflow-hidden rounded-2xl border border-[#DE1C38]/20 bg-gradient-to-br from-red-50/60 to-red-50/20">
										<div class="border-b border-[#DE1C38]/10 px-5 py-4">
											<div class="flex items-center gap-2">
												<AlertTriangle class="h-4 w-4 text-[#DE1C38]" />
												<span class="text-sm font-bold text-[#DE1C38]">Zona de peligro</span>
											</div>
										</div>
										<div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
											<div>
												<p class="text-sm font-semibold text-gray-800">Eliminar cuenta</p>
												<p class="mt-0.5 text-xs text-gray-500">Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.</p>
											</div>
											<Button
												label="Eliminar cuenta"
												variant="danger"
												size="sm"
												onclick={() => (showDeleteModal = true)}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}

				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Modal eliminar cuenta -->
<Modal
	abierto={showDeleteModal}
	titulo="Eliminar cuenta"
	anchoMaximo="max-w-sm"
	cerrarAlClickearFondo={!isLoadingDelete}
	oncerrar={() => { if (!isLoadingDelete) showDeleteModal = false; }}
>
	<div class="flex flex-col items-center py-2 text-center">
		<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
			<Trash2 class="h-8 w-8 text-[#DE1C38]" />
		</div>
		<p class="text-base font-bold text-gray-900">¿Eliminar tu cuenta?</p>
		<p class="mt-2 text-sm text-gray-500">
			Esta acción no se puede deshacer. Todos tus datos, historial y configuración serán eliminados permanentemente.
		</p>
	</div>
	{#snippet footer()}
			<Button
				label="Sí, eliminar"
				loadingLabel="Eliminando..."
				variant="danger"
				loading={isLoadingDelete}
				onclick={confirmarEliminarCuenta}
			/>
			<Button
				label="Cancelar"
				variant="secondary"
				disabled={isLoadingDelete}
				onclick={() => { if (!isLoadingDelete) showDeleteModal = false; }}
			/>
	{/snippet}
</Modal>
