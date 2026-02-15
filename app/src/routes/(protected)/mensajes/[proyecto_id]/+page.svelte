<script lang="ts">
	import { page } from '$app/stores';
	import BurbujaMensaje from '$lib/components/feature/chat/BurbujaMensaje.svelte';
	import InputMensaje from '$lib/components/feature/chat/InputMensaje.svelte';
	import SeparadorFecha from '$lib/components/feature/chat/SeparadorFecha.svelte';
	import EstadoProyectoBadge from '$lib/components/feature/chat/EstadoProyectoBadge.svelte';
	import { afterUpdate, onDestroy } from 'svelte';
	import { usuario } from '$lib/stores/auth';
	import { chatStore } from '$lib/stores/chatStore';
	import type { Mensaje, Chat } from '$lib/domain/types/Chat';
	import type { PageData } from './$types';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	// Obtener ID del proyecto desde la URL
	$: proyectoId = Number($page.params.proyecto_id);

	// Props
	export let data: PageData;

	$: chat = data.chat;
	$: proyecto = data.proyecto;

	$: if (chat) {
		setBreadcrumbs([
			BREADCRUMB_ROUTES.home,
			{ label: 'Mensajes', href: '/mensajes' },
			{ label: chat.titulo || 'Chat' }
		]);
	}

	// Validar acceso
	$: hasAccess =
		$usuario?.id_usuario && chat?.participantes_ids.includes($usuario.id_usuario) ? true : false;

	// Validar estado del proyecto para escritura
	$: canWrite =
		proyecto?.estado &&
		!['en_auditoria', 'cancelado', 'completado'].includes(proyecto.estado) &&
		hasAccess;

	// Agrupar mensajes por fecha
	interface MessageGroup {
		date: Date;
		messages: Mensaje[];
	}

	$: messageGroups =
		chat && chat.mensajes
			? chat.mensajes.reduce((groups: MessageGroup[], mensaje: Mensaje) => {
					const messageDate = new Date(mensaje.created_at);
					const dateOnly = new Date(
						messageDate.getFullYear(),
						messageDate.getMonth(),
						messageDate.getDate()
					);

					const existingGroup = groups.find((g) => g.date.getTime() === dateOnly.getTime());

					if (existingGroup) {
						existingGroup.messages.push(mensaje);
					} else {
						groups.push({ date: dateOnly, messages: [mensaje] });
					}
					return groups;
				}, [])
			: [];

	// Referencia al contenedor de mensajes para scroll
	let chatContainer: HTMLElement;

	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	// Scroll automático al cargar y al recibir mensajes
	afterUpdate(() => {
		scrollToBottom();
	});

	// Manejar envío de mensajes
	// Manejar envío de mensajes
	async function handleSend(event: CustomEvent<{ contenido: string }>) {
		// Backend no implementado
		console.log('Enviar mensaje:', event.detail.contenido);
	}

	// Mobile menu
	let showMobileMenu = false;
	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	// Enlace de evidencias según rol
	$: evidenciasLink =
		$usuario?.rol === 'institucion'
			? `/institucion/proyectos/${proyectoId}/aportes`
			: `/colaborador/proyectos/${proyectoId}/mis-aportes`;
</script>

{#if !chat}
	<div class="flex h-full items-center justify-center bg-gray-50">
		<div class="text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="mx-auto mb-4 h-16 w-16 text-gray-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
				/>
			</svg>
			<p class="text-lg font-medium text-gray-700">Chat no encontrado</p>
			<p class="mt-1 text-sm text-gray-500">El chat que buscás no existe o fue eliminado</p>
		</div>
	</div>
{:else if !hasAccess}
	<div class="flex h-full items-center justify-center bg-red-50">
		<div class="text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="mx-auto mb-4 h-16 w-16 text-red-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
				/>
			</svg>
			<p class="text-lg font-medium text-red-700">Acceso denegado</p>
			<p class="mt-1 text-sm text-red-600">No tenés permiso para ver este chat</p>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col">
		<!-- Header -->
		<header
			class="relative flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:px-6 md:py-4"
		>
			<div class="flex items-center justify-between gap-4">
				<!-- Botón de regreso (sólo móvil) -->
				<a
					href="/mensajes"
					class="flex items-center text-gray-600 transition-colors hover:text-blue-600 md:hidden"
					aria-label="Volver a la lista de chats"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
					</svg>
				</a>

				<!-- Título y estado -->
				<div class="min-w-0 flex-1">
					<h1 class="truncate text-lg font-bold text-gray-900 md:text-xl">{chat.titulo}</h1>
					<div class="mt-1 flex items-center gap-2">
						{#if proyecto?.estado}
							<EstadoProyectoBadge estado={proyecto.estado} />
						{/if}
						<span class="text-xs text-gray-500">
							{chat.mensajes.length}
							{chat.mensajes.length === 1 ? 'mensaje' : 'mensajes'}
						</span>
					</div>
				</div>

				<!-- Botones de acción -->
				<div class="flex flex-shrink-0 gap-2">
					<a
						href="/proyectos/{proyectoId}"
						class="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md md:flex"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-4 w-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
							/>
						</svg>
						Ver proyecto
					</a>
					<a
						href={evidenciasLink}
						class="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md md:flex"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-4 w-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							/>
						</svg>
						{$usuario?.rol === 'institucion' ? 'Evidencias' : 'Mis aportes'}
					</a>
					<!-- Mobile: Menu -->
					<button
						on:click={toggleMobileMenu}
						class="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md md:hidden"
						aria-label="Menú"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
							/>
						</svg>
					</button>
				</div>
			</div>

			{#if showMobileMenu}
				<div
					class="absolute top-full right-4 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg md:hidden"
				>
					<div class="py-1">
						<a
							href="/proyectos/{proyectoId}"
							class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
							on:click={() => (showMobileMenu = false)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4 text-gray-400"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
								/>
							</svg>
							Ver proyecto
						</a>
						<a
							href={evidenciasLink}
							class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
							on:click={() => (showMobileMenu = false)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-4 w-4 text-gray-400"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
								/>
							</svg>
							{$usuario?.rol === 'institucion' ? 'Evidencias' : 'Mis aportes'}
						</a>
					</div>
				</div>
			{/if}
		</header>

		<!-- Área de mensajes -->
		<div class="no-scrollbar flex-1 overflow-y-auto bg-white p-4 md:p-6" bind:this={chatContainer}>
			{#each messageGroups as group}
				<SeparadorFecha fecha={group.date} />
				{#each group.messages as mensaje}
					<BurbujaMensaje {mensaje} esPropio={mensaje.remitente_id === $usuario?.id_usuario} />
				{/each}
			{/each}
		</div>

		<InputMensaje deshabilitado={!canWrite} chatId={chat.id_chat} on:send={handleSend} />
	</div>
{/if}
