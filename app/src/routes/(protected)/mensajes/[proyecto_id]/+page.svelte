<script lang="ts">
	import { createBrowserClient } from '@supabase/ssr';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import BurbujaMensaje from '$lib/components/feature/chat/BurbujaMensaje.svelte';
	import InputMensaje from '$lib/components/feature/chat/InputMensaje.svelte';
	import SeparadorFecha from '$lib/components/feature/chat/SeparadorFecha.svelte';
	import EstadoProyectoBadge from '$lib/components/feature/chat/EstadoProyectoBadge.svelte';
	import Alert from '$lib/components/ui/feedback/Alert.svelte';
	import { env } from '$lib/infrastructure/config/env';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';
	import {
		readChatOutbox,
		removeChatOutboxEntry,
		type ChatOutboxEntry,
		upsertChatOutboxEntry
	} from '$lib/utils/chatOutbox';
	import type { Mensaje } from '$lib/domain/types/Chat';
	import type { PageData } from './$types';

	type EstadoLocalMensaje = 'persistido' | 'enviando' | 'pendiente';
	type Participante = NonNullable<PageData['chat']>['participantes'][number];

	type MensajeVista = Mensaje & {
		estadoLocal?: EstadoLocalMensaje;
	};

	interface MensajeRealtimePayload {
		id_mensaje_chat: number;
		proyecto_id: number;
		autor_id: number;
		client_id: string;
		contenido: string;
		created_at: string;
	}

	interface MessageGroup {
		date: Date;
		messages: MensajeVista[];
	}

	let { data } = $props<{ data: PageData }>();

	const chat = $derived(data.chat);
	const proyecto = $derived(data.proyecto);
	const usuarioActual = $derived(data.usuario ?? null);
	const proyectoId = $derived(proyecto?.id_proyecto ?? 0);
	const puedeEnviar = $derived(Boolean(data.tieneAcceso && usuarioActual?.id_usuario && chat));
	const evidenciasLink = $derived(
		usuarioActual?.rol === 'institucion'
			? `/institucion/proyectos/${proyectoId}/aportes`
			: `/colaborador/proyectos/${proyectoId}/mis-aportes`
	);
	const participantesPorId = $derived.by(() => {
		const participantes = new Map<number, Participante>();
		for (const participante of chat?.participantes ?? []) {
			participantes.set(participante.id_usuario, participante);
		}
		return participantes;
	});

	let mensajes = $state<MensajeVista[]>([]);
	let chatInicializado = $state<number | null>(null);
	let errorEnvio = $state('');
	let enviandoActual = $state(false);
	let reenviandoPendientes = $state(false);
	let chatContainer = $state<HTMLElement | null>(null);
	let showMobileMenu = $state(false);

	$effect(() => {
		if (!chat) {
			return;
		}

		setBreadcrumbs([
			{ label: 'Mensajes', href: '/mensajes' },
			{ label: chat.titulo || 'Chat' }
		]);
	});

	$effect(() => {
		if (!chat || chatInicializado === chat.id_chat) {
			return;
		}

		chatInicializado = chat.id_chat;
		mensajes = [...chat.mensajes].map((mensaje) => ({ ...mensaje, estadoLocal: 'persistido' }));

		const usuarioId = usuarioActual?.id_usuario;
		if (browser && usuarioId) {
			for (const pendiente of readChatOutbox(proyectoId, usuarioId)) {
				upsertMensajeEnVista(crearMensajePendiente(pendiente, 'pendiente'));
			}
			void retryPendientes();
		}

		void scrollToBottom();
	});

	$effect(() => {
		if (!browser || !chat || !usuarioActual?.id_usuario || !proyectoId) {
			return;
		}

		const handleOnline = () => {
			void retryPendientes();
		};

		window.addEventListener('online', handleOnline);

		const realtimeClient = createBrowserClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '');
		const channel = realtimeClient
			.channel(`mensajes-proyecto-${proyectoId}`)
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'mensajes_chat',
					filter: `proyecto_id=eq.${proyectoId}`
				},
				(payload) => {
					const nuevo = payload.new as MensajeRealtimePayload;
					upsertMensajeEnVista({
						id_mensaje: nuevo.id_mensaje_chat,
						chat_id: nuevo.proyecto_id,
						proyecto_id: nuevo.proyecto_id,
						remitente_id: nuevo.autor_id,
						contenido: nuevo.contenido,
						client_id: nuevo.client_id,
						created_at: nuevo.created_at,
						autor: participantesPorId.get(nuevo.autor_id),
						estadoLocal: 'persistido'
					});

					removeChatOutboxEntry(proyectoId, usuarioActual.id_usuario, nuevo.client_id);
				}
			)
			.subscribe();

		return () => {
			window.removeEventListener('online', handleOnline);
			void realtimeClient.removeChannel(channel);
		};
	});

	const hayPendientes = $derived(mensajes.some((mensaje) => mensaje.estadoLocal === 'pendiente'));
	const messageGroups = $derived.by(() =>
		mensajes.reduce((groups: MessageGroup[], mensaje) => {
			const fechaMensaje = new Date(mensaje.created_at);
			const fecha = new Date(
				fechaMensaje.getFullYear(),
				fechaMensaje.getMonth(),
				fechaMensaje.getDate()
			);
			const ultimoGrupo = groups[groups.length - 1];

			if (ultimoGrupo && ultimoGrupo.date.getTime() === fecha.getTime()) {
				ultimoGrupo.messages.push(mensaje);
				return groups;
			}

			groups.push({ date: fecha, messages: [mensaje] });
			return groups;
		}, [])
	);

	function getMensajeKey(mensaje: MensajeVista): string {
		return `${mensaje.id_mensaje}:${mensaje.client_id}`;
	}

	function getEstadoLocal(mensaje: MensajeVista): EstadoLocalMensaje {
		return mensaje.estadoLocal ?? 'persistido';
	}

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}

	function crearClientId(): string {
		if (browser && typeof window.crypto?.randomUUID === 'function') {
			return window.crypto.randomUUID();
		}

		return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	}

	function crearMensajePendiente(
		entry: ChatOutboxEntry,
		estadoLocal: Exclude<EstadoLocalMensaje, 'persistido'>
	): MensajeVista {
		return {
			id_mensaje: -Math.abs(new Date(entry.createdAt).getTime()),
			chat_id: proyectoId,
			proyecto_id: proyectoId,
			remitente_id: usuarioActual?.id_usuario ?? 0,
			contenido: entry.contenido,
			client_id: entry.clientId,
			created_at: entry.createdAt,
			autor: chat?.participantes.find(
				(participante: Participante) => participante.id_usuario === usuarioActual?.id_usuario
			),
			estadoLocal
		};
	}

	function ordenarMensajes(lista: MensajeVista[]): MensajeVista[] {
		return [...lista].sort((a, b) => {
			const fecha = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
			if (fecha !== 0) {
				return fecha;
			}

			return a.id_mensaje - b.id_mensaje;
		});
	}

	function upsertMensajeEnVista(mensajeNuevo: MensajeVista) {
		const index = mensajes.findIndex(
			(mensajeActual) =>
				mensajeActual.client_id === mensajeNuevo.client_id ||
				mensajeActual.id_mensaje === mensajeNuevo.id_mensaje
		);

		if (index === -1) {
			mensajes = ordenarMensajes([...mensajes, mensajeNuevo]);
		} else {
			const actual = mensajes[index];
			const actualizado = {
				...actual,
				...mensajeNuevo,
				estadoLocal:
					mensajeNuevo.estadoLocal === 'persistido'
						? 'persistido'
						: mensajeNuevo.estadoLocal ?? actual.estadoLocal ?? 'persistido'
			} satisfies MensajeVista;

			mensajes = ordenarMensajes(
				mensajes.map((mensaje, mensajeIndex) => (mensajeIndex === index ? actualizado : mensaje))
			);
		}

		void scrollToBottom();
	}

	function actualizarEstadoLocal(clientId: string, estadoLocal: EstadoLocalMensaje) {
		mensajes = mensajes.map((mensaje) =>
			mensaje.client_id === clientId ? { ...mensaje, estadoLocal } : mensaje
		);
	}

	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	async function persistirMensaje(entry: ChatOutboxEntry) {
		const response = await fetch(`/api/proyectos/${proyectoId}/mensajes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contenido: entry.contenido,
				clientId: entry.clientId
			})
		});

		const payload = (await response.json().catch(() => ({ error: 'Error inesperado' }))) as
			| { mensaje?: Mensaje; error?: string }
			| undefined;

		if (!response.ok || !payload?.mensaje) {
			throw new Error(payload?.error || 'No se pudo registrar el mensaje');
		}

		removeChatOutboxEntry(proyectoId, usuarioActual!.id_usuario!, entry.clientId);
		upsertMensajeEnVista({
			...payload.mensaje,
			estadoLocal: 'persistido'
		});
	}

	async function retryPendientes() {
		if (!browser || !usuarioActual?.id_usuario || reenviandoPendientes || !navigator.onLine) {
			return;
		}

		const pendientes = readChatOutbox(proyectoId, usuarioActual.id_usuario);
		if (pendientes.length === 0) {
			return;
		}

		reenviandoPendientes = true;
		try {
			for (const pendiente of pendientes) {
				try {
					actualizarEstadoLocal(pendiente.clientId, 'enviando');
					await persistirMensaje(pendiente);
				} catch (error) {
					actualizarEstadoLocal(pendiente.clientId, 'pendiente');
					errorEnvio =
						error instanceof Error ? error.message : 'Quedó un mensaje pendiente de reintento';
				}
			}
		} finally {
			reenviandoPendientes = false;
		}
	}

	async function handleSend(event: { contenido: string }) {
		if (!usuarioActual?.id_usuario || !chat || !puedeEnviar) {
			return;
		}

		errorEnvio = '';

		const entry: ChatOutboxEntry = {
			clientId: crearClientId(),
			contenido: event.contenido.trim(),
			createdAt: new Date().toISOString()
		};

		upsertChatOutboxEntry(proyectoId, usuarioActual.id_usuario, entry);
		upsertMensajeEnVista(crearMensajePendiente(entry, 'enviando'));

		enviandoActual = true;
		try {
			await persistirMensaje(entry);
			void retryPendientes();
		} catch (error) {
			actualizarEstadoLocal(entry.clientId, 'pendiente');
			errorEnvio =
				error instanceof Error
					? error.message
					: 'No se pudo enviar el mensaje. Quedó pendiente de reintento';
		} finally {
			enviandoActual = false;
		}
	}
</script>

{#if !chat}
	<div class="flex h-full items-center justify-center bg-gray-50">
		<div class="text-center">
			<p class="text-lg font-medium text-gray-700">Chat no disponible</p>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col">
		<header class="relative flex-shrink-0 border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:px-6 md:py-4">
			<div class="flex items-center justify-between gap-4">
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

				<div class="min-w-0 flex-1">
					<h1 class="truncate text-lg font-bold text-gray-900 md:text-xl">{chat.titulo}</h1>
					<div class="mt-1 flex items-center gap-2">
						{#if proyecto?.estado}
							<EstadoProyectoBadge estado={proyecto.estado} />
						{/if}
						<span class="text-xs text-gray-500">
							{mensajes.filter((mensaje) => getEstadoLocal(mensaje) === 'persistido').length}
							{mensajes.filter((mensaje) => getEstadoLocal(mensaje) === 'persistido').length === 1
								? ' mensaje'
								: ' mensajes'}
						</span>
					</div>
				</div>

				<div class="flex shrink-0 gap-2">
					<a
						href="/proyectos/{proyectoId}"
						class="hidden items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md md:flex"
					>
						Ver proyecto
					</a>
					<a
						href={evidenciasLink}
						class="hidden items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md md:flex"
					>
						{usuarioActual?.rol === 'institucion' ? 'Evidencias' : 'Mis aportes'}
					</a>
					<button
						onclick={toggleMobileMenu}
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
				<div class="absolute top-full right-4 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg md:hidden">
					<div class="py-1">
						<a
							href="/proyectos/{proyectoId}"
							class="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
							onclick={() => (showMobileMenu = false)}
						>
							Ver proyecto
						</a>
						<a
							href={evidenciasLink}
							class="block px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
							onclick={() => (showMobileMenu = false)}
						>
							{usuarioActual?.rol === 'institucion' ? 'Evidencias' : 'Mis aportes'}
						</a>
					</div>
				</div>
			{/if}
		</header>

		{#if errorEnvio}
			<div class="border-b border-amber-100 bg-white px-4 py-3 md:px-6">
				<Alert
					variant="warning"
					title="Hubo un problema al enviar"
					message={errorEnvio}
				/>
			</div>
		{/if}

		{#if hayPendientes}
			<div class="border-b border-blue-100 bg-white px-4 py-3 md:px-6">
				<Alert
					variant="info"
					title="Hay mensajes pendientes"
					message="Se van a reintentar automáticamente cuando vuelva la conexión o al enviar otro mensaje."
				/>
			</div>
		{/if}

		<div class="no-scrollbar flex-1 overflow-y-auto bg-white p-4 md:p-6" bind:this={chatContainer}>
			{#if mensajes.length === 0}
				<div class="flex h-full items-center justify-center">
					<div class="max-w-sm rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center">
						<p class="text-base font-semibold text-gray-800">Todavía no hay mensajes</p>
						<p class="mt-2 text-sm text-gray-500">
							Este historial queda persistido en el proyecto y no se puede eliminar.
						</p>
					</div>
				</div>
			{:else}
				{#each messageGroups as group (group.date.getTime())}
					<SeparadorFecha fecha={group.date} />
					{#each group.messages as mensaje (getMensajeKey(mensaje))}
						<BurbujaMensaje
							{mensaje}
							esPropio={mensaje.remitente_id === usuarioActual?.id_usuario}
							estadoLocal={getEstadoLocal(mensaje)}
						/>
					{/each}
				{/each}
			{/if}
		</div>

		<InputMensaje
			deshabilitado={!puedeEnviar}
			enviando={enviandoActual}
			chatId={chat.id_chat}
			onSend={handleSend}
		/>
	</div>
{/if}
