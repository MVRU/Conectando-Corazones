<script lang="ts">
	import { createBrowserClient } from '@supabase/ssr';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	import BurbujaMensaje from '$lib/components/feature/chat/BurbujaMensaje.svelte';
	import InputMensaje from '$lib/components/feature/chat/InputMensaje.svelte';
	import SeparadorFecha from '$lib/components/feature/chat/SeparadorFecha.svelte';
	import EstadoProyectoBadge from '$lib/components/feature/chat/EstadoProyectoBadge.svelte';
	import Alert from '$lib/components/ui/feedback/Alert.svelte';
	import { env } from '$lib/infrastructure/config/env';
	import { formatearCantidadMensajes } from '$lib/utils/chatTexto';
	import {
		readChatOutbox,
		removeChatOutboxEntry,
		type ChatOutboxEntry,
		upsertChatOutboxEntry
	} from '$lib/utils/chatOutbox';
	import { ArrowLeft, EllipsisVertical, FolderKanban, MessageSquareText, ShieldAlert } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
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
	const esInstitucionActual = $derived(usuarioActual?.rol === 'institucion');
	const puedeEnviar = $derived(Boolean(data.tieneAcceso && usuarioActual?.id_usuario && chat));

	let mensajes = $state<MensajeVista[]>([]);
	let chatInicializado = $state<number | null>(null);
	let errorEnvio = $state('');
	let enviandoActual = $state(false);
	let reenviandoPendientes = $state(false);
	let chatContainer = $state<HTMLElement | null>(null);
	let showMobileMenu = $state(false);
	const cantidadMensajesPersistidos = $derived(
		mensajes.filter((mensaje) => getEstadoLocal(mensaje) === 'persistido').length
	);

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
						autor: obtenerParticipantePorId(nuevo.autor_id),
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

	function obtenerParticipantePorId(idUsuario: number): Participante | undefined {
		return chat?.participantes.find(
			(participante: Participante) => participante.id_usuario === idUsuario
		);
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
			autor: obtenerParticipantePorId(usuarioActual?.id_usuario ?? 0),
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
	<div in:fade={{ duration: 400 }} class="flex h-full items-center justify-center bg-transparent px-4">
		<div class="max-w-md w-full rounded-[2.5rem] border border-white/10 bg-white/5 px-10 py-12 text-center shadow-2xl shadow-black/40 backdrop-blur-xl">
			<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-400/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
				<ShieldAlert class="h-10 w-10" />
			</div>
			<p class="text-xl font-bold text-slate-100">Chat no disponible</p>
			<p class="mt-3 text-sm text-slate-400">
				No pudimos cargar esta conversación.
			</p>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col text-slate-100 bg-transparent">
		<header class="message-enter relative z-10 flex-shrink-0 border-b border-white/5 bg-white/[0.02] px-4 py-3 backdrop-blur-md md:px-6 md:py-4" style="--message-enter-delay: 40ms;">
			<div class="mx-auto flex w-full max-w-5xl items-start justify-between gap-4">
				<a
					href={resolve('/mensajes')}
					class="mt-1 flex items-center rounded-xl p-1 text-slate-400 transition-colors hover:text-slate-100 md:hidden"
					aria-label="Volver a la lista de chats"
				>
					<ArrowLeft class="h-5 w-5" />
				</a>

				<div class="min-w-0 flex-1">
					<div class="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase ring-1 ring-inset ring-slate-800">
						<MessageSquareText class="h-3.5 w-3.5" />
						Chat del proyecto
					</div>
					<p class="sr-only">
						Conversación del proyecto
					</p>
					<h1 class="mt-2 truncate text-lg font-bold tracking-tight text-slate-50 md:text-[1.4rem]">
						{chat.titulo}
					</h1>
					<div class="mt-2 flex flex-wrap items-center gap-2">
						{#if proyecto?.estado}
							<EstadoProyectoBadge estado={proyecto.estado} />
						{/if}
						<span class="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-inset ring-slate-700">
							{formatearCantidadMensajes(cantidadMensajesPersistidos)}
						</span>
					</div>
				</div>

				<div class="flex shrink-0 gap-2">
					{#if proyectoId}
						<a
							href={resolve('/(public)/proyectos/[id]', { id: String(proyectoId) })}
							class="hidden items-center gap-2 rounded-xl bg-[#007FFF] px-4 py-2 text-sm font-medium text-white shadow-sm shadow-[#007FFF]/20 transition hover:bg-[#42A1FF] md:flex"
						>
							<FolderKanban class="h-4 w-4" />
							Ver proyecto
						</a>
					{/if}
					{#if proyectoId}
						{#if esInstitucionActual}
							<a
								href={resolve('/(protected)/institucion/proyectos/[id]/aportes', { id: String(proyectoId) })}
								class="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 md:flex"
							>
								Evidencias
							</a>
						{:else}
							<a
								href={resolve('/(protected)/colaborador/proyectos/[id]/mis-aportes', { id: String(proyectoId) })}
								class="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition hover:bg-slate-800 md:flex"
							>
								Mis aportes
							</a>
						{/if}
					{/if}
					<button
						onclick={toggleMobileMenu}
						class="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 shadow-sm transition hover:bg-slate-800 md:hidden"
						aria-label="Menú"
					>
						<EllipsisVertical class="h-5 w-5" />
					</button>
				</div>
			</div>

			{#if showMobileMenu}
				<div class="absolute top-full right-4 z-10 mt-2 w-56 rounded-2xl border border-slate-700 bg-slate-950 p-1 shadow-2xl md:hidden">
					<div class="py-1">
						{#if proyectoId}
							<a
								href={resolve('/(public)/proyectos/[id]', { id: String(proyectoId) })}
								class="block rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-900"
								onclick={() => (showMobileMenu = false)}
							>
								Ver proyecto
							</a>
						{/if}
						{#if proyectoId}
							{#if esInstitucionActual}
								<a
									href={resolve('/(protected)/institucion/proyectos/[id]/aportes', { id: String(proyectoId) })}
									class="block rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-900"
									onclick={() => (showMobileMenu = false)}
								>
									Evidencias
								</a>
							{:else}
								<a
									href={resolve('/(protected)/colaborador/proyectos/[id]/mis-aportes', { id: String(proyectoId) })}
									class="block rounded-xl px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-slate-900"
									onclick={() => (showMobileMenu = false)}
								>
									Mis aportes
								</a>
							{/if}
						{/if}
					</div>
				</div>
			{/if}
		</header>

		{#if errorEnvio}
			<div class="message-enter relative z-10 border-b border-amber-500/10 bg-amber-500/5 px-4 py-3 backdrop-blur-md md:px-6" style="--message-enter-delay: 90ms;">
				<Alert
					variant="warning"
					title="Hubo un problema al enviar"
					message={errorEnvio}
				/>
			</div>
		{/if}

		{#if hayPendientes}
			<div class="message-enter relative z-10 border-b border-[#007FFF]/10 bg-[#007FFF]/5 px-4 py-3 backdrop-blur-md md:px-6" style="--message-enter-delay: 90ms;">
				<Alert
					variant="info"
					title="Hay mensajes pendientes"
					message="Se van a reintentar automáticamente cuando vuelva la conexión o al enviar otro mensaje."
				/>
			</div>
		{/if}

		<div
			class="message-enter relative z-0 no-scrollbar flex-1 overflow-y-auto bg-transparent px-3 py-4 sm:px-4 md:px-6 md:py-5"
			style="--message-enter-delay: 120ms;"
			bind:this={chatContainer}
		>
			{#if mensajes.length === 0}
				<div in:fade={{ duration: 400 }} class="flex h-full items-center justify-center">
					<div class="max-w-md w-full rounded-[2.5rem] border border-white/5 bg-white/[0.02] px-10 py-12 text-center shadow-2xl shadow-black/40 backdrop-blur-lg transition-all hover:border-white/10">
						<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#007FFF]/5 text-[#42A1FF] ring-1 ring-inset ring-[#007FFF]/20 shadow-[0_0_30px_rgba(0,127,255,0.10)]">
							<MessageSquareText class="h-10 w-10" strokeWidth={1.5} />
						</div>
						<p class="text-xl font-bold tracking-tight text-slate-100">Todavía no hay mensajes</p>
						<p class="mt-3 text-sm leading-relaxed text-slate-400">
							Este historial queda persistido en el proyecto y no se puede eliminar.
						</p>
					</div>
				</div>
			{:else}
				<div class="mx-auto flex w-full max-w-4xl flex-col">
					{#each messageGroups as group (group.date.getTime())}
						<SeparadorFecha fecha={group.date} />
						{#each group.messages as mensaje (getMensajeKey(mensaje))}
							<div in:fly={{ y: 20, duration: 400, delay: 50 }}>
								<BurbujaMensaje
									{mensaje}
									esPropio={mensaje.remitente_id === usuarioActual?.id_usuario}
									estadoLocal={getEstadoLocal(mensaje)}
								/>
							</div>
						{/each}
					{/each}
				</div>
			{/if}
		</div>

		<div class="message-enter" style="--message-enter-delay: 160ms;">
			<InputMensaje
			deshabilitado={!puedeEnviar}
			enviando={enviandoActual}
			chatId={chat.id_chat}
			onSend={handleSend}
			/>
		</div>
	</div>
{/if}

<style>
	.message-enter {
		animation: message-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: var(--message-enter-delay, 0ms);
		will-change: opacity, transform;
	}

	@keyframes message-enter {
		from {
			opacity: 0;
			transform: translate3d(0, 12px, 0);
		}

		to {
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.message-enter {
			animation: none;
			transform: none;
			will-change: auto;
		}
	}
</style>
