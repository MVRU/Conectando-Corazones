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

	const dispatch = createEventDispatcher<{
		changeView: ViewMode;
		selectProject: number;
		selectChat: number;
	}>();

	export let navItems: NavItem[] = [];
	export let viewMode: ViewMode = 'dashboard';
	export let quickActions: QuickAction[] = [];
	export let chatItems: ChatItem[] = [];
	export let projectItems: ProjectItem[] = [];
	export let selectedChatId: number | null = null;
	export let isMobileMenuOpen = false;
	export let sidebarWidth = 260;

	const DESKTOP_TOP_OFFSET = 'clamp(1rem, 2vw, 1.5rem)';
	const MIN_DESKTOP_WIDTH = 200;
	const MAX_DESKTOP_WIDTH = 360;
	const DEFAULT_NAV_COLUMNS = 4;
	const COMPACT_NAV_COLUMNS = 2;
	const NAV_COMPACT_BREAKPOINT = 220;
	const SECONDARY_SECTION_LABELS: Record<ViewMode, string> = {
		dashboard: 'Acciones rápidas',
		projects: 'Proyectos activos',
		chat: 'Conversaciones',
		profile: 'Acciones rápidas',
		settings: 'Acciones rápidas'
	};
	let isResizing = false;
	let startX = 0;
	let startWidth = 0;
	let previousUserSelect: string | null = null;
	let previousCursor: string | null = null;
	let navGridColumns = DEFAULT_NAV_COLUMNS;
	let secondarySectionLabel = SECONDARY_SECTION_LABELS.dashboard;
	let isChatView = false;
	let isProjectsView = false;

	$: navGridColumns =
		sidebarWidth <= NAV_COMPACT_BREAKPOINT ? COMPACT_NAV_COLUMNS : DEFAULT_NAV_COLUMNS;
	$: secondarySectionLabel =
		SECONDARY_SECTION_LABELS[viewMode] ?? SECONDARY_SECTION_LABELS.dashboard;
	$: isChatView = viewMode === 'chat';
	$: isProjectsView = viewMode === 'projects';
	function handleViewChange(nextView: ViewMode) {
		dispatch('changeView', nextView);
	}

	function handleProjectSelection(projectId: number) {
		dispatch('selectProject', projectId);
	}

	function handleChatSelection(chatId: number) {
		dispatch('selectChat', chatId);
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
	class="sidebar-shell fixed inset-y-0 left-0 z-[60] flex h-[100dvh] w-full flex-col overflow-y-auto transition-transform duration-300 ease-out lg:sticky lg:left-auto lg:top-[var(--sidebar-top)] lg:h-auto lg:flex-shrink-0 lg:translate-x-0 lg:items-center lg:self-start"
	class:translate-x-0={isMobileMenuOpen}
	class:-translate-x-full={!isMobileMenuOpen}
	class:cursor-col-resize={isResizing}
	style={`--sidebar-top:${DESKTOP_TOP_OFFSET}; --sidebar-width:${sidebarWidth}px; width:min(var(--sidebar-width),92vw); min-width:min(var(--sidebar-width),92vw); background:${BG_CARD}; border-right:1px solid ${BORDER_SUBTLE}; box-shadow:0 4px 18px rgba(0,0,32,0.18);`}
	aria-label="Barra de navegación institucional"
>
	<!-- * Ajustamos el padding con safe-area para que la superposición móvil respete notches y no sea tapada por el header. -->
	<div
		class="flex h-full w-full flex-col gap-6 px-6 pb-6 pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] lg:px-4 lg:pt-4"
		data-testid="navigation-sidebar-content"
	>
		<div class="w-full space-y-3">
			<h3
				class="text-xs font-medium uppercase tracking-widest lg:hidden"
				style="color: {TEXT_400};"
			>
				Navegación principal
			</h3>
			<!-- * Ajustamos el grid para que degrade columnas manteniendo accesos visibles incluso en anchos estrechos. -->
			<div
				class="nav-grid rounded-3xl p-2"
				role="group"
				aria-label="Navegación principal compacta"
				style={`--nav-columns:${navGridColumns};`}
			>
				{#each navItems as item (item.view)}
					<button
						class="group flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
						class:ring-2={viewMode === item.view}
						style:background={viewMode === item.view ? BG_900 : BG_CARD}
						style:border={viewMode === item.view
							? `1px solid ${PRIMARY_500}`
							: `1px solid ${BORDER_SUBTLE}`}
						style:box-shadow={viewMode === item.view ? `0 6px 18px ${PRIMARY_500}35` : 'none'}
						style:color={viewMode === item.view ? PRIMARY_500 : TEXT_400}
						style:--tw-ring-color={RING_AZURE_25}
						style:--tw-ring-offset-color={viewMode === item.view ? BG_900 : BG_CARD}
						style:transform={viewMode === item.view ? 'scale(1.05)' : 'scale(1)'}
						on:click={() => handleViewChange(item.view)}
						title={item.label}
						aria-label={item.label}
						aria-pressed={viewMode === item.view}
						type="button"
					>
						<svelte:component this={item.icon} class="h-5 w-5" />
						<span class="sr-only">{item.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="w-full border-t pt-5" style="border-color: {BORDER_SUBTLE};">
			<h3
				class="mb-4 text-xs font-medium uppercase tracking-widest lg:hidden"
				style="color: {TEXT_400};"
			>
				{secondarySectionLabel}
			</h3>

			{#if isChatView}
				<ul class="flex flex-col gap-3" aria-label="Listado de conversaciones">
					{#each chatItems as chat (chat.id)}
						<li>
							<button
								class="group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
								class:ring-2={selectedChatId === chat.id}
								style="background: {BG_900}; color: {TEXT_100}; --tw-ring-color: {RING_AZURE_10}; box-shadow: 0 2px 8px rgba(0,0,0,0.25);"
								style:border={selectedChatId === chat.id
									? `1px solid ${chat.statusColor}`
									: `1px solid ${BORDER_SUBTLE}`}
								style:transform={selectedChatId === chat.id ? 'scale(1.01)' : 'scale(1)'}
								title={`Abrir chat: ${chat.name}`}
								aria-pressed={selectedChatId === chat.id}
								on:click={() => {
									handleChatSelection(chat.id);
									handleViewChange('chat');
								}}
								type="button"
							>
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
									style="background: {chat.statusColor}1A; border: 1px solid {chat.statusColor}40;"
								>
									<MessageSquare class="h-5 w-5" style="color: {chat.statusColor};" />
								</div>
								<div class="min-w-0 flex-1 text-left">
									<p class="truncate text-sm font-semibold" style="color: {TEXT_100};">
										{chat.name}
									</p>
									<p class="truncate text-xs" style="color: {TEXT_400};">{chat.lastMessage}</p>
								</div>
								<div class="flex flex-col items-end gap-1">
									<span class="text-[11px] font-medium" style="color: {TEXT_400};">{chat.time}</span
									>
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
			{:else if isProjectsView}
				<ul class="flex flex-col gap-3" aria-label="Listado de proyectos activos">
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
				<section class="space-y-3" aria-label={secondarySectionLabel}>
					<p
						id="quick-actions-heading-desktop"
						class="hidden text-xs font-medium uppercase tracking-widest lg:block"
						style="color: {TEXT_400};"
					>
						{secondarySectionLabel}
					</p>
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
				</section>
			{/if}
		</div>

		<div
			class="sidebar-resizer absolute right-0 top-0 hidden h-full w-2 cursor-col-resize lg:block"
			on:mousedown={startResize}
			role="presentation"
			aria-hidden="true"
		></div>
	</div>
</nav>

<style>
	.sidebar-shell {
		height: 100dvh;
	}

	.nav-grid {
		display: grid;
		grid-template-columns: repeat(var(--nav-columns, 4), minmax(3.25rem, 1fr));
		justify-items: center;
		gap: clamp(0.5rem, 0.9vw, 0.75rem);
	}

	@media (min-width: 1024px) {
		.nav-grid {
			gap: 1rem;
		}
	}

	@media (min-width: 1024px) {
		.sidebar-shell {
			top: var(--sidebar-top, 1.5rem);
			height: calc(100dvh - (var(--sidebar-top, 1.5rem) * 2));
			max-height: calc(100dvh - (var(--sidebar-top, 1.5rem) * 2));
			border-radius: 24px;
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
