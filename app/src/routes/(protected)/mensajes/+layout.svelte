<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import type { Chat } from '$lib/domain/types/Chat';
	import { formatearCantidadMensajes } from '$lib/utils/chatTexto';
	import { usuario } from '$lib/stores/auth';
	import { chatStore } from '$lib/stores/chatStore';
	import EstadoProyectoBadge from '$lib/components/feature/chat/EstadoProyectoBadge.svelte';
	import {
		Archive,
		Inbox,
		MessageSquareText,
		PanelLeftClose,
		PanelLeftOpen
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let chatsUsuario = $derived(data.chats || []);
	let activeChats = $derived(
		chatsUsuario.filter((c: Chat) => {
			const estado = c.estado_proyecto || 'en_curso';
			return !['completado', 'cancelado'].includes(estado);
		})
	);
	let archivedChats = $derived(
		chatsUsuario.filter((c: Chat) => {
			const estado = c.estado_proyecto || 'en_curso';
			return ['completado', 'cancelado'].includes(estado);
		})
	);
	let isInChat = $derived(!!$page.params.proyecto_id);

	function getProyecto(proyectoId: number): any {
		const chat = chatsUsuario.find((c: Chat) => c.proyecto_id === proyectoId);
		return chat ? { id_proyecto: chat.proyecto_id, estado: chat.estado_proyecto } : undefined;
	}

	function getAutorPreview(chat: Chat): string {
		const ultimoMensaje = chat.mensajes[chat.mensajes.length - 1];
		if (!ultimoMensaje) {
			return '';
		}

		if (ultimoMensaje.remitente_id === $usuario?.id_usuario) {
			return 'Vos';
		}

		return ultimoMensaje.autor?.nombreVisible || ultimoMensaje.autor?.username || 'Usuario';
	}
</script>

<div class="relative flex h-full w-full overflow-hidden bg-[#0F1029] text-slate-100">
	<!-- Decoración de fondo idéntica al dashboard -->
	<div
		class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
		style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E');"
	></div>
	<div class="fixed top-0 left-1/4 -z-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#007FFF]/10 blur-[130px]"></div>
	<div class="fixed bottom-0 right-1/4 -z-0 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]"></div>

	<aside
		class="relative z-10 flex-shrink-0 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 {isInChat
			? 'hidden md:flex md:flex-col'
			: 'flex flex-col'} {$chatStore.sidebarCollapsed ? 'md:w-0 md:opacity-0' : 'w-full md:w-[22rem]'}"
	>
		<div class="message-enter flex-shrink-0 border-b border-white/5 bg-white/[0.03] p-5" style="--message-enter-delay: 40ms;">
			<div class="flex items-center justify-between gap-3">
				<div class="flex items-center gap-3">
					<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#007FFF]/15 text-[#42A1FF] ring-1 ring-inset ring-[#007FFF]/20">
						<MessageSquareText class="h-5 w-5" />
					</div>
					<div>
						<h2 class="font-display tracking-tight text-xl font-bold text-slate-50 drop-shadow-sm">Mensajes</h2>
						<p class="text-xs text-slate-400">
							{activeChats.length + archivedChats.length} conversaciones
						</p>
					</div>
				</div>
				<button
					onclick={() => chatStore.toggleSidebar()}
					class="hidden rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 md:block"
					aria-label={$chatStore.sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
					title={$chatStore.sidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
				>
					{#if $chatStore.sidebarCollapsed}
						<PanelLeftOpen class="h-5 w-5" />
					{:else}
						<PanelLeftClose class="h-5 w-5" />
					{/if}
				</button>
			</div>
		</div>

		<div class="message-enter flex gap-2 border-b border-white/5 bg-white/[0.01] px-3 py-3" style="--message-enter-delay: 90ms;">
			<button
				onclick={() => chatStore.toggleArchived()}
				class="relative flex flex-1 items-center justify-center rounded-full px-3 py-2.5 text-sm font-medium transition-all sm:px-4 {!$chatStore.showArchived
					? 'bg-white/10 text-slate-50 shadow-sm ring-1 ring-inset ring-white/10 backdrop-blur-sm'
					: 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
			>
				<span class="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap">
					<MessageSquareText class="h-4 w-4" />
					<span>Activos</span>
					{#if activeChats.length > 0}
						<span
							class="inline-flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full {!$chatStore.showArchived
								? 'bg-[#007FFF]/20 text-[#42A1FF]'
								: 'bg-white/5 text-slate-400'} px-1.5 text-xs leading-none font-bold"
						>
							{activeChats.length}
						</span>
					{/if}
				</span>
			</button>
			<button
				onclick={() => chatStore.toggleArchived()}
				class="relative flex flex-1 items-center justify-center rounded-full px-3 py-2.5 text-sm font-medium transition-all sm:px-4 {$chatStore.showArchived
					? 'bg-white/10 text-slate-50 shadow-sm ring-1 ring-inset ring-white/10 backdrop-blur-sm'
					: 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}"
			>
				<span class="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap">
					<Archive class="h-4 w-4" />
					<span>Archivados</span>
					{#if archivedChats.length > 0}
						<span
							class="inline-flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full {$chatStore.showArchived
								? 'bg-[#007FFF]/20 text-[#42A1FF]'
								: 'bg-white/5 text-slate-400'} px-1.5 text-xs leading-none font-bold"
						>
							{archivedChats.length}
						</span>
					{/if}
				</span>
			</button>
		</div>

		<div class="message-enter no-scrollbar flex-1 overflow-y-auto p-3" style="--message-enter-delay: 140ms;">
			{#if ($chatStore.showArchived ? archivedChats : activeChats).length === 0}
				<div class="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-8 text-center mt-4">
					<div
						class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-400"
					>
						{#if $chatStore.showArchived}
							<Archive class="h-7 w-7" />
						{:else}
							<Inbox class="h-7 w-7" />
						{/if}
					</div>
					<p class="text-sm font-medium text-slate-200">
						{$chatStore.showArchived ? 'No tenés chats archivados' : 'No tenés chats activos'}
					</p>
					<p class="mt-1 text-xs leading-5 text-slate-400">
						{$chatStore.showArchived
							? 'Los chats de proyectos completados o cancelados aparecerán acá.'
							: 'Tus conversaciones aparecerán acá.'}
					</p>
				</div>
			{:else}
				<ul class="space-y-3">
					{#each $chatStore.showArchived ? archivedChats : activeChats as chat (chat.proyecto_id)}
						{@const proyecto = getProyecto(chat.proyecto_id)}
						<li animate:flip={{ duration: 300 }} in:fly={{ y: 20, duration: 300 }} out:fade={{ duration: 200 }}>
							<a
								href={resolve('/(protected)/mensajes/[proyecto_id]', {
									proyecto_id: String(chat.proyecto_id)
								})}
								class="group block rounded-2xl border px-4 py-3.5 transition-all duration-300 hover:shadow-lg {$page.params
									.proyecto_id === chat.proyecto_id.toString()
									? 'border-[#007FFF]/30 bg-[#007FFF]/5 shadow-md shadow-[#007FFF]/5 backdrop-blur-md'
									: 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] backdrop-blur-sm opacity-80 hover:opacity-100'}"
							>
								<div class="mb-2 flex items-start justify-between gap-2">
									<h3 class="truncate font-semibold text-slate-100">{chat.titulo}</h3>
									<span class="text-xs whitespace-nowrap text-slate-500">
										{new Date(chat.updated_at).toLocaleDateString('es-AR', {
											day: 'numeric',
											month: 'short'
										})}
									</span>
								</div>
								<p class="mb-2.5 truncate text-sm text-slate-400">
									{#if chat.mensajes.length > 0}
										{@const autorPreview = getAutorPreview(chat)}
										<span class="font-medium text-slate-300">{autorPreview}:</span>
										{' '}
										{chat.mensajes[chat.mensajes.length - 1].contenido}
									{:else}
										<span class="italic text-slate-500">Sin mensajes</span>
									{/if}
								</p>
								<div class="flex items-center justify-between gap-2">
									{#if proyecto?.estado}
										<EstadoProyectoBadge estado={proyecto.estado} />
									{/if}
									{#if chat.cantidad_mensajes > 0}
										<span class="text-xs text-slate-500">
											{formatearCantidadMensajes(chat.cantidad_mensajes)}
										</span>
									{/if}
								</div>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</aside>

	<main
		class="relative z-10 flex min-w-0 flex-1 flex-col bg-transparent {isInChat ? 'flex' : 'hidden md:flex'}"
	>
		{#if $chatStore.sidebarCollapsed}
			<div class="absolute top-0 left-0 z-20 hidden p-4 md:block">
				<button
					onclick={() => chatStore.toggleSidebar()}
					class="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 shadow-md backdrop-blur-lg transition-all hover:bg-white/10 hover:text-slate-100"
					aria-label="Mostrar sidebar"
					title="Mostrar sidebar"
				>
					<PanelLeftOpen class="h-5 w-5" />
				</button>
			</div>
		{/if}

		{#if !isInChat}
			<div in:fade={{ duration: 400 }} class="flex h-full items-center justify-center px-6">
				<div class="message-enter max-w-md w-full rounded-3xl border border-white/5 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-lg transition-all hover:bg-white/10" style="--message-enter-delay: 120ms;">
					<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#007FFF]/10 text-[#42A1FF] ring-1 ring-inset ring-[#007FFF]/20 shadow-[0_0_30px_rgba(0,127,255,0.15)]">
						<MessageSquareText class="h-10 w-10" strokeWidth={1.5} />
					</div>
					<h3 class="text-xl font-bold tracking-tight text-slate-100">Seleccioná un chat</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-400">
						Elegí un proyecto de la izquierda para ver sus mensajes y continuar la conversación.
					</p>
				</div>
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</main>
</div>

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
