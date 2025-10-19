<!--
*- DECISIÓN DE DISEÑO: Separar la barra lateral mantiene el componente principal enfocado y facilita futuros rediseños.
-->
<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { ChevronRight, MessageSquare, Briefcase } from 'lucide-svelte';

	import {
		BG_900,
		BG_CARD,
		BORDER_SUBTLE,
		ERROR_COLOR,
		PRIMARY_500,
		RING_AZURE_10,
		RING_AZURE_25,
		TEXT_100,
		TEXT_300,
		TEXT_400
	} from './tokens';
	import type { ChatItem, NavItem, ProjectItem, QuickAction, ViewMode } from './types';
	const dispatch = createEventDispatcher<{ changeView: ViewMode; selectProject: number }>();

	export let navItems: NavItem[] = [];
	export let viewMode: ViewMode = 'dashboard';
	export let quickActions: QuickAction[] = [];
	export let chatItems: ChatItem[] = [];
	export let projectItems: ProjectItem[] = [];
	export let isMobileMenuOpen = false;
	export let sidebarWidth = 260;

	const DESKTOP_TOP_OFFSET = 'clamp(1rem, 2vw, 1.5rem)';
	const MIN_DESKTOP_WIDTH = 200;
	const MAX_DESKTOP_WIDTH = 360;
	let isResizing = false;
	let startX = 0;
	let startWidth = 0;
	let previousUserSelect: string | null = null;
	let previousCursor: string | null = null;

	function handleViewChange(nextView: ViewMode) {
		dispatch('changeView', nextView);
	}

	function handleProjectSelection(projectId: number) {
		dispatch('selectProject', projectId);
	}

	function startResize(event: MouseEvent) {
		if (window.innerWidth < 1024) return;
		isResizing = true;
		startX = event.clientX;
		startWidth = sidebarWidth;
		previousUserSelect = document.body.style.userSelect;
		previousCursor = document.body.style.cursor;
		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'col-resize';
		window.addEventListener('mousemove', handleResize);
		window.addEventListener('mouseup', stopResize);
	}

	function handleResize(event: MouseEvent) {
		if (!isResizing) return;
		const delta = event.clientX - startX;
		const nextWidth = Math.max(MIN_DESKTOP_WIDTH, Math.min(MAX_DESKTOP_WIDTH, startWidth + delta));
		if (nextWidth !== sidebarWidth) {
			sidebarWidth = nextWidth;
		}
	}

	function stopResize() {
		if (!isResizing) return;
		isResizing = false;
		window.removeEventListener('mousemove', handleResize);
		window.removeEventListener('mouseup', stopResize);
		if (previousUserSelect !== null) {
			document.body.style.userSelect = previousUserSelect;
			previousUserSelect = null;
		} else {
			document.body.style.removeProperty('user-select');
		}
		if (previousCursor !== null) {
			document.body.style.cursor = previousCursor;
			previousCursor = null;
		} else {
			document.body.style.removeProperty('cursor');
		}
	}

	onDestroy(() => {
		window.removeEventListener('mousemove', handleResize);
		window.removeEventListener('mouseup', stopResize);
		if (isResizing) {
			stopResize();
		}
	});
</script>

<nav
	class="sidebar-shell fixed left-0 top-0 z-50 flex flex-col p-6 transition-transform duration-300 ease-out lg:translate-x-0 lg:items-center lg:p-4 relative"
	class:translate-x-0={isMobileMenuOpen}
	class:-translate-x-full={!isMobileMenuOpen}
	class:cursor-col-resize={isResizing}
	style={`--sidebar-top:${DESKTOP_TOP_OFFSET}; width:${sidebarWidth}px; min-width:${sidebarWidth}px; background:${BG_CARD}; border-right:1px solid ${BORDER_SUBTLE}; box-shadow:0 4px 18px rgba(0,0,32,0.18); overflow-y:auto;`}
	aria-label="Barra de navegación institucional"
>
	<div class="w-full space-y-4">
		<h3 class="text-xs font-medium uppercase tracking-widest lg:hidden" style="color: {TEXT_400};">
			Navegación principal
		</h3>
		<div class="grid grid-cols-2 gap-2">
			{#each navItems as item (item.view)}
				<button
					class="group flex h-28 w-full flex-col items-center justify-center rounded-[18px] p-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:shadow-lg lg:h-[90px] lg:w-full lg:p-0"
					class:shadow-lg={viewMode === item.view}
					class:hover:bg-[#343954]={viewMode !== item.view}
					class:ring-2={viewMode === item.view}
					style:background={viewMode === item.view ? BG_900 : 'transparent'}
					style:box-shadow={viewMode === item.view ? `0 0 10px ${PRIMARY_500}30` : 'none'}
					style:border={viewMode === item.view
						? `1px solid ${PRIMARY_500}`
						: `1px solid ${BORDER_SUBTLE}`}
					style:color={viewMode === item.view ? PRIMARY_500 : TEXT_400}
					style:--tw-ring-color={RING_AZURE_25}
					on:click={() => handleViewChange(item.view)}
					title={item.label}
					aria-pressed={viewMode === item.view}
				>
					<svelte:component this={item.icon} class="mb-2 h-7 w-7 shrink-0 lg:mb-0 lg:h-5 lg:w-5" />
					<span class="truncate lg:hidden">{item.label}</span>
				</button>
			{/each}
		</div>
	</div>

	<div class="mt-8 w-full border-t pt-6" style="border-color: {BORDER_SUBTLE};">
		<h3
			class="mb-4 text-xs font-medium uppercase tracking-widest lg:hidden"
			style="color: {TEXT_400};"
		>
			{#if viewMode === 'projects'}
				Mis Proyectos
			{:else if viewMode === 'chat'}
				Conversaciones Recientes
			{:else}
				Acciones rápidas
			{/if}
		</h3>

		{#if viewMode === 'chat'}
			<ul class="flex flex-col gap-3" aria-label="Lista de chats recientes">
				{#each chatItems as chat (chat.name)}
					<li>
						<button
							class="group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
							style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; color: {TEXT_100}; --tw-ring-color: {RING_AZURE_10}; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
							title={`Abrir chat: ${chat.name}`}
						>
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
								style="background: {chat.statusColor}1A; border: 1px solid {chat.statusColor}40;"
							>
								<MessageSquare class="h-5 w-5" style="color: {chat.statusColor};" />
							</div>
							<div class="min-w-0 flex-1 text-left">
								<p class="truncate text-sm font-semibold" style="color: {TEXT_100};">{chat.name}</p>
								<p class="truncate text-xs" style="color: {TEXT_400};">{chat.lastMessage}</p>
							</div>
							<div class="flex flex-col items-end gap-1">
								<span class="text-[11px] font-medium" style="color: {TEXT_400};">{chat.time}</span>
								{#if chat.isUnread}
									<span
										class="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold"
										style="background:{chat.statusColor}; color:white;">•</span
									>
								{/if}
							</div>
						</button>
					</li>
				{/each}
			</ul>
		{:else if viewMode === 'projects'}
			<ul class="flex flex-col gap-3" aria-label="Lista de proyectos">
				{#each projectItems as project (project.id)}
					<li>
						<button
							class="group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
							style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; color: {TEXT_100}; --tw-ring-color: {RING_AZURE_10}; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
							title={`Abrir proyecto: ${project.name}`}
							on:click={() => {
								handleProjectSelection(project.id);
								handleViewChange('projects');
							}}
						>
							<div
								class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
								style="background:{project.statusColor}1A; border:1px solid {project.statusColor}40;"
							>
								<Briefcase class="h-5 w-5" style="color:{project.statusColor};" />
							</div>
							<div class="min-w-0 flex-1 text-left">
								<div class="flex items-center gap-2">
									<p class="truncate text-sm font-semibold" style="color:{TEXT_100};">
										{project.name}
									</p>
									<span
										class="inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold"
										style="background:{project.statusColor}1A; border:1px solid {project.statusColor}55; color:{project.statusColor};"
										>{project.status}</span
									>
								</div>
								<p class="text-xs" style="color:{TEXT_400};">
									Cierre estimado: <span style="color:{TEXT_300}; font-weight:600;"
										>{project.date}</span
									>
								</p>
							</div>
							<ChevronRight
								class="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100"
								style="color:{TEXT_400};"
							/>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="grid grid-cols-1 gap-3" aria-label="Accesos rápidos">
				{#each quickActions as action (action.label)}
					<button
						class="group relative flex items-center justify-between rounded-[16px] px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
						style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; color: {TEXT_100}; --tw-ring-color: {RING_AZURE_10}; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
						type="button"
					>
						<div class="flex items-center gap-3">
							<div
								class="flex h-8 w-8 items-center justify-center rounded-lg"
								style="background: {action.statusColor ??
									ERROR_COLOR}1A; border:1px solid {action.statusColor ?? ERROR_COLOR}40;"
							>
								<svelte:component
									this={action.icon}
									class="h-4 w-4"
									style="color:{action.statusColor ?? ERROR_COLOR};"
								/>
							</div>
							<span class="text-sm font-semibold">{action.label}</span>
						</div>
						{#if action.badge}
							<span
								class="ml-4 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ring-2"
								style="background:{action.statusColor ??
									ERROR_COLOR}; color:white; --tw-ring-color:{BG_900};">{action.badge}</span
							>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div
		class="sidebar-resizer absolute right-0 top-0 hidden h-full w-2 cursor-col-resize lg:block"
		on:mousedown={startResize}
		role="presentation"
		aria-hidden="true"
	></div>
</nav>

<style>
	.sidebar-shell {
		height: 100%;
	}

	@media (min-width: 1024px) {
		.sidebar-shell {
			top: var(--sidebar-top, 1.5rem);
			bottom: var(--sidebar-top, 1.5rem);
			border-radius: 24px;
			height: auto;
		}
	}

	@media (min-width: 1024px) {
		.sidebar-resizer {
			background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.08), transparent);
			transition: background 0.2s ease;
		}

		.sidebar-resizer:hover,
		.sidebar-resizer:active {
			background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.18), transparent);
		}
	}
</style>
