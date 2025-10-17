<script lang="ts">
	import {
		Bell,
		Briefcase,
		Users,
		Gauge,
		TrendingUp,
		ChevronDown,
		Plus,
		LayoutGrid,
		Heart,
		DownloadCloud,
		Filter,
		MessageSquare,
		ChevronLeft,
		ChevronRight,
		User,
		Settings,
		Home,
		LogOut,
		ShieldCheck,
		Star,
		Lightbulb
	} from 'lucide-svelte';
	// Base / fondos
	const BG_900 = '#0F112D';
	const BG_850_GRADIENT_END = '#1A1C3B';
	const BG_CARD = '#19203F';
	// Primarios (acción/acento)
	const PRIMARY_300 = '#5ED4FB';
	const PRIMARY_500 = '#0B98FA';
	// Tipografía en dark
	const TEXT_100 = '#EAF2FF';
	const TEXT_300 = '#C3D1E8';
	const TEXT_400 = '#A9B4CF';
	// Realces y bordes suaves
	const BORDER_SUBTLE = '#2D3560';
	const RING_AZURE_10 = 'rgba(104, 195, 255, 0.10)';
	const RING_AZURE_25 = 'rgba(104, 195, 255, 0.25)';
	// Gradientes predefinidos
	const GRADIENT_CTA = `linear-gradient(180deg, ${PRIMARY_300} 0%, ${PRIMARY_500} 100%)`;
	const GRADIENT_BG = `radial-gradient(800px 520px at 72% 36%, rgba(66,143,255,0.08), transparent 60%), linear-gradient(180deg, ${BG_900} 0%, ${BG_850_GRADIENT_END} 100%)`;
	// Colores funcionales
	const WARNING_COLOR = '#FFC107';
	const ERROR_COLOR = '#FF5C77';
	const INFO_COLOR = '#00E5FF';
	// -------------------- LÓGICA DE ESTADO --------------------
	type ViewMode = 'dashboard' | 'projects' | 'chat' | 'profile' | 'settings';
	let viewMode: ViewMode = 'dashboard';
	let isMobileMenuOpen: boolean = false;
	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
	// Datos de ejemplo para las métricas del dashboard
	const metrics = [
		{ label: 'Proyectos totales', value: '1', icon: Briefcase, color: PRIMARY_500 },
		{ label: 'Colaboradores totales', value: '0', icon: Users, color: WARNING_COLOR },
		{ label: 'Próx. Finalización', value: '20 días', icon: Gauge, color: ERROR_COLOR }
	];
	const navItems: { label: string; icon: any; view: ViewMode }[] = [
		{ label: 'Dashboard', icon: Home, view: 'dashboard' },
		{ label: 'Proyectos', icon: Briefcase, view: 'projects' },
		{ label: 'Mensajes', icon: MessageSquare, view: 'chat' },
		{ label: 'Perfil', icon: User, view: 'profile' },
		{ label: 'Configuración', icon: Settings, view: 'settings' }
	];
	// Acciones Rápidas (Lista genérica - ahora solo se usa en 'dashboard')
	const quickActions = [
		'Ver solicitudes',
		'Cargar evidencia',
		'Mis proyectos',
		'Mis chats',
		'Ver progresos',
		'Solicitar cierre'
	];
	const chatItems = [
		{
			name: 'Luz para Aprender',
			lastMessage: 'Pendiente de aprobación.',
			time: 'Hace 5m',
			statusColor: ERROR_COLOR,
			isUnread: true
		}
		// {
		// 	name: 'Patio de colores',
		// 	lastMessage: '¡Borrador creado!',
		// 	time: 'Hace 1h',
		// 	statusColor: PRIMARY_500,
		// 	isUnread: false
		// }
	];
	const projectItems = [
		{
			id: 1,
			name: 'Luz para Aprender',
			status: 'En Curso',
			date: '30/Oct/2025',
			statusColor: ERROR_COLOR
		},
		{
			id: 2,
			name: 'Patio de colores',
			status: 'Borrador',
			date: '25/Nov',
			statusColor: PRIMARY_500
		}
	];
	const luzParaAprenderProgress = [
		{ label: 'Donación monetaria', percent: 15, color: WARNING_COLOR },
		{ label: 'Lámparas LED', percent: 40, color: PRIMARY_500 },
		{ label: 'Electricistas', percent: 80, color: ERROR_COLOR }
	];
	const ayudaTypes = [
		{ label: 'Voluntariado', percent: 32, color: INFO_COLOR },
		{ label: 'Monetaria', percent: 33, color: WARNING_COLOR },
		{ label: 'En especie', percent: 35, color: ERROR_COLOR }
	];
	function getDonutGradient() {
		let gradientString = 'conic-gradient(';
		let currentPercent = 0;
		ayudaTypes.forEach((item, index) => {
			const start = currentPercent;
			currentPercent += item.percent;
			const end = currentPercent;
			if (index < ayudaTypes.length - 1) {
				gradientString += `${item.color} ${start}% ${end}%, `;
			} else {
				gradientString += `${item.color} ${start}% 100%`;
			}
		});
		return gradientString + ')';
	}
	const donutGradient = getDonutGradient();
	let selectedProject = projectItems[0];

	// ---- Quick actions dinámicas según la vista seleccionada ----
	type QuickAction = {
		label: string;
		icon: any;
		badge: string | null;
		statusColor?: string;
	};

	$: dynamicQuickActions = (mode: ViewMode): QuickAction[] => {
		switch (mode) {
			case 'projects':
				// Mapea proyectos a acciones
				return projectItems.map((p) => ({
					label: p.name,
					icon: Briefcase,
					badge: p.status === 'En Curso' ? '!' : null,
					statusColor: p.statusColor
				}));

			case 'chat':
				// Mapea chats a acciones
				return chatItems.map((c) => ({
					label: c.name,
					icon: MessageSquare,
					badge: c.isUnread ? '!' : null,
					statusColor: c.statusColor
				}));

			case 'dashboard':
			case 'profile':
			case 'settings':
			default:
				// Acciones genéricas del dashboard
				return quickActions.map((action) => ({
					label: action,
					icon: LayoutGrid,
					badge: action === 'Ver solicitudes' ? '3' : null,
					statusColor: ERROR_COLOR
				}));
		}
	};

	import { onMount } from 'svelte';

	// --- Config de anchos del sidebar (solo desktop) ---
	const SIDEBAR_W_COLLAPSED = 80;
	const SIDEBAR_W_EXPANDED = 280;

	let isSidebarExpanded = false;
	let isDesktop = false;

	function updateIsDesktop() {
		isDesktop = window.matchMedia('(min-width: 1024px)').matches;
	}

	function applySidebarWidthVar() {
		// En desktop aplicamos 80px/280px; en mobile, el lateral tipo drawer no empuja el main
		const w = isDesktop ? (isSidebarExpanded ? SIDEBAR_W_EXPANDED : SIDEBAR_W_COLLAPSED) : 0;
		document.documentElement.style.setProperty('--sidebar-w', `${w}px`);
	}

	function handleEnter() {
		if (!isDesktop) return;
		isSidebarExpanded = true;
	}

	function handleLeave() {
		if (!isDesktop) return;
		isSidebarExpanded = false;
	}

	onMount(() => {
		updateIsDesktop();
		applySidebarWidthVar();

		const mq = window.matchMedia('(min-width: 1024px)');
		const onChange = () => {
			updateIsDesktop();
			applySidebarWidthVar();
		};
		mq.addEventListener?.('change', onChange);
		window.addEventListener('resize', onChange);

		return () => {
			mq.removeEventListener?.('change', onChange);
			window.removeEventListener('resize', onChange);
		};
	});

	// Reaplicar cuando cambie el estado o el modo móvil/desktop
	$: applySidebarWidthVar();
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="text-inter relative min-h-screen w-full font-sans antialiased"
	style="
        background: {GRADIENT_BG};
        color: {TEXT_100};
    "
>
	<!-- -------------------- BARRA DE NAVEGACIÓN PRINCIPAL (MINIMALISTA) -------------------- -->
	<nav
		class="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col p-6 transition-transform duration-300 ease-out lg:w-[200px] lg:items-center lg:p-4 {isMobileMenuOpen
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0"
		style="
            background: {BG_CARD};
            border-right: 1px solid {BORDER_SUBTLE};
            box-shadow: 0 4px 18px rgba(0,0,32,0.18);
            overflow-y: auto;
        "
	>
		<!-- 1. Links de Navegación -->
		<div class="w-full space-y-4">
			<h3
				class="text-xs font-medium uppercase tracking-widest lg:hidden"
				style="color: {TEXT_400};"
			>
				Navegación principal
			</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each navItems as item}
					<button
						class="group flex h-28 w-full flex-col items-center justify-center rounded-[18px] p-3 text-sm font-semibold transition-all duration-200
                                hover:scale-[1.03] hover:shadow-lg
                                lg:h-[90px] lg:w-full lg:p-0"
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
						on:click={() => (viewMode = item.view)}
						title={item.label}
					>
						<svelte:component
							this={item.icon}
							class="mb-2 h-7 w-7 shrink-0 
                                    lg:mb-0 lg:h-5 lg:w-5"
						/>
						<span class="truncate lg:hidden">{item.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- 2. Sección de Acciones Rápidas (AHORA con layout por vista) -->
		<div class="mt-8 border-t pt-6" style="border-color: {BORDER_SUBTLE};">
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

			<!-- CHAT: listado de conversaciones -->
			{#if viewMode === 'chat'}
				<ul class="flex flex-col gap-3">
					{#each chatItems as c}
						<li>
							<button
								class="group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
								style="
              background: {BG_900};
              border: 1px solid {BORDER_SUBTLE};
              color: {TEXT_100};
              --tw-ring-color: {RING_AZURE_10};
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            "
								title={`Abrir chat: ${c.name}`}
							>
								<!-- Avatar/Icono -->
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
									style="background: {c.statusColor}1A; border: 1px solid {c.statusColor}40;"
								>
									<MessageSquare class="h-5 w-5" style="color: {c.statusColor};" />
								</div>

								<!-- Texto -->
								<div class="min-w-0 flex-1 text-left">
									<p class="truncate text-sm font-semibold" style="color:{TEXT_100};">
										{c.name}
									</p>
									<p class="truncate text-xs" style="color:{TEXT_400};">
										{c.lastMessage}
									</p>
								</div>

								<!-- Hora y no leído -->
								<div class="flex flex-col items-end gap-1">
									<span class="text-[11px] font-medium" style="color:{TEXT_400};">{c.time}</span>
									{#if c.isUnread}
										<span
											class="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold"
											style="background:{ERROR_COLOR}; color:white;">•</span
										>
									{/if}
								</div>
							</button>
						</li>
					{/each}
				</ul>

				<!-- PROJECTS: tarjetas compactas de proyecto -->
			{:else if viewMode === 'projects'}
				<ul class="flex flex-col gap-3">
					{#each projectItems as p}
						<li>
							<button
								class="group flex w-full items-center gap-3 rounded-[16px] px-3 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
								style="
              background: {BG_900};
              border: 1px solid {BORDER_SUBTLE};
              color: {TEXT_100};
              --tw-ring-color: {RING_AZURE_10};
              box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            "
								title={`Abrir proyecto: ${p.name}`}
								on:click={() => {
									selectedProject = p;
									viewMode = 'projects';
								}}
							>
								<!-- Icono/Badge -->
								<div
									class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
									style="background:{p.statusColor}1A; border:1px solid {p.statusColor}40;"
								>
									<Briefcase class="h-5 w-5" style="color:{p.statusColor};" />
								</div>

								<!-- Contenido -->
								<div class="min-w-0 flex-1 text-left">
									<div class="flex items-center gap-2">
										<p class="truncate text-sm font-semibold" style="color:{TEXT_100};">
											{p.name}
										</p>
										<!-- Estado pill -->
										<span
											class="inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold"
											style="background:{p.statusColor}1A; border:1px solid {p.statusColor}55; color:{p.statusColor};"
										>
											{p.status}
										</span>
									</div>
									<p class="text-xs" style="color:{TEXT_400};">
										Cierre estimado: <span style="color:{TEXT_300}; font-weight:600;">{p.date}</span
										>
									</p>
								</div>

								<!-- Chevron -->
								<ChevronRight
									class="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100"
									style="color:{TEXT_400};"
								/>
							</button>
						</li>
					{/each}
				</ul>

				<!-- DEFAULT: acciones rápidas clásicas -->
			{:else}
				<div class="grid grid-cols-1 gap-3">
					{#each dynamicQuickActions(viewMode) as action}
						<button
							class="group relative flex items-center justify-between rounded-[16px] px-4 py-3 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
							style="
            border: 1px solid {BORDER_SUBTLE};
            background: {BG_900};
            color: {TEXT_100};
            --tw-ring-color: {RING_AZURE_10};
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          "
						>
							<div class="flex items-center gap-3">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg"
									style="background: {action.statusColor ||
										ERROR_COLOR}1A; border:1px solid {action.statusColor || ERROR_COLOR}40;"
								>
									<svelte:component
										this={action.icon}
										class="h-4 w-4"
										style="color:{action.statusColor || ERROR_COLOR};"
									/>
								</div>
								<span class="text-sm font-semibold">{action.label}</span>
							</div>

							{#if action.badge}
								<span
									class="ml-4 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ring-2"
									style="background:{action.statusColor ||
										ERROR_COLOR}; color:white; --tw-ring-color:{BG_900};"
								>
									{action.badge}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</nav>

	<!-- Overlay de menú móvil -->
	{#if isMobileMenuOpen}
		<div class="fixed inset-0 z-40 bg-black/60 lg:hidden" on:click={toggleMobileMenu}></div>
	{/if}

	<!-- -------------------- CONTENIDO PRINCIPAL -------------------- -->
	<main
		class="ml-0 p-4 transition-all duration-300 ease-out lg:ml-[200px] lg:p-8"
		style="min-height: 100vh;"
	>
		<button
			on:click={toggleMobileMenu}
			class="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-[18px] p-3 shadow-xl transition-all duration-300 hover:scale-[1.05] focus:outline-none focus:ring-4 active:scale-[0.98] lg:hidden"
			style="
                background: {PRIMARY_500};
                box-shadow: 0 5px 20px {PRIMARY_500}80;
                color: white;
                --tw-ring-color: {RING_AZURE_25};
            "
			title="Menú Principal"
		>
			<LayoutGrid class="h-6 w-6" />
		</button>

		<section class="mx-auto max-w-[1280px] pt-12 lg:pt-8">
			<!-- ENCABEZADO -->
			<header class="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end md:mb-16">
				<div class="mb-0">
					<div class="mb-4 flex items-center gap-2">
						<span
							class="h-2 w-2 rounded-full"
							style="background: {PRIMARY_300}; box-shadow: 0 0 5px {PRIMARY_300};"
						></span>
						<p class="text-xs font-medium uppercase tracking-widest" style="color: {TEXT_400};">
							Cada acción cuenta
						</p>
					</div>
					<h1
						class="text-5xl font-extrabold leading-[1.05] tracking-tighter sm:text-6xl lg:text-[64px]"
						style="color: {TEXT_100};"
					>
						<span
							style="background-image: linear-gradient(180deg, {PRIMARY_300}, {PRIMARY_500}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"
						>
							Mi panel
						</span>
					</h1>
					<p
						class="mt-4 max-w-[70ch] text-lg font-medium leading-relaxed"
						style="color: {TEXT_300};"
					>
						Escuela Esperanza · Octubre 2025 · Rosario, Santa Fe, Argentina
					</p>
				</div>

				{#if viewMode === 'dashboard'}
					<div class="flex flex-wrap items-center gap-4">
						<button
							class="flex items-center gap-2 rounded-full px-8 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-4 active:scale-[0.98]"
							style="
                                background: {GRADIENT_CTA};
                                box-shadow: 0 6px 18px rgba(0,160,255,0.25), inset 0 1px 3px rgba(255, 255, 255, 0.1);
                                --tw-ring-color: {RING_AZURE_10};
                            "
						>
							<Plus class="h-5 w-5" />
							Crear Proyecto
						</button>
						<button
							class="relative flex h-12 w-12 items-center justify-center rounded-[18px] transition-all duration-200 hover:scale-[1.05] focus:outline-none focus:ring-2 active:scale-[0.98]"
							style="
                                background: {BG_CARD};
                                border: 1px solid {BORDER_SUBTLE};
                                box-shadow: 0 4px 18px rgba(0,0,32,0.18);
                                color: {PRIMARY_500};
                                --tw-ring-color: {RING_AZURE_25};
                            "
						>
							<Bell class="h-6 w-6" />
							<span
								class="absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ring-2"
								style="background: {ERROR_COLOR}; --tw-ring-color: {BG_900}; color: white; line-height: 1;"
							>
								3
							</span>
						</button>
					</div>
				{/if}
			</header>

			<!-- CONTENIDO DINÁMICO -->
			<div class="grid grid-cols-1 gap-12 xl:grid-cols-1">
				<div class="space-y-12">
					{#if viewMode === 'dashboard'}
						<div class="sticky top-0 z-30 mb-10 transition-all duration-300">
							<div class="flex justify-center px-4 lg:px-0">
								<div
									class="inline-flex w-fit flex-wrap items-center gap-2 rounded-2xl px-3 py-2"
									style="background: {BG_CARD};
									border: 1px solid {BORDER_SUBTLE};
									box-shadow: 0 2px 10px rgba(0,0,32,0.12);"
								>
									<Filter class="h-5 w-5 shrink-0" style="color: {TEXT_400};" />

									{#each ['Período', 'Categoría', 'Estado', 'Tipo de ayuda', 'Ubicación'] as label}
										<div class="relative rounded-full">
											<select
												class="rounded-full px-4 py-2 text-sm font-medium transition-[border-color,box-shadow,color] duration-150 focus:outline-none focus:ring-2"
												style="
              border: none;
              background: transparent;
              color: {TEXT_300};
              --tw-ring-color: {RING_AZURE_10};
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
              padding-right: 2rem;
            "
												on:focus={(e) =>
													(e.currentTarget.parentElement!.style.borderColor = PRIMARY_500)}
												on:blur={(e) =>
													(e.currentTarget.parentElement!.style.borderColor = BORDER_SUBTLE)}
												on:mouseenter={(e) =>
													(e.currentTarget.parentElement!.style.borderColor = BORDER_SUBTLE)}
												on:mouseleave={(e) =>
													(e.currentTarget.parentElement!.style.borderColor = BORDER_SUBTLE)}
											>
												<option disabled selected>{label}</option>
												<option style="background: {BG_CARD}; color: {TEXT_100};">Opción A</option>
												<option style="background: {BG_CARD}; color: {TEXT_100};">Opción B</option>
											</select>

											<!-- Chevron sutil -->
											<span
												class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
												style="color: {TEXT_400};"
											>
												<ChevronDown class="h-4 w-4" />
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-8 md:grid-cols-4 md:items-stretch">
							{#each metrics as metric}
								<div
									class="rounded-[28px] p-7 shadow-xl transition-all duration-200 hover:scale-[1.02] hover:ring-2 active:scale-[1.0]"
									style="
                                        background: {BG_CARD};
                                        border: 1px solid {BORDER_SUBTLE};
                                        box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                        --tw-ring-color: {metric.color};
                                        background-image: linear-gradient(135deg, {BG_CARD}, #20243E);
                                    "
								>
									<div class="flex items-start justify-between">
										<div
											class="flex h-14 w-14 items-center justify-center rounded-xl p-2"
											style="
                                                background: {metric.color}20;
                                                border: 1px solid {metric.color}55;
                                                box-shadow: 0 0 10px {metric.color}20;
                                            "
										>
											<svelte:component
												this={metric.icon}
												class="h-7 w-7"
												style="color: {metric.color};"
											/>
										</div>
										<p class="text-4xl font-extrabold tracking-tighter" style="color: {TEXT_100};">
											{metric.value}
										</p>
									</div>
									<p
										class="mt-6 text-sm font-semibold uppercase tracking-widest"
										style="color: {TEXT_400};"
									>
										{metric.label}
									</p>
								</div>
							{/each}
							<div class="flex flex-col justify-center rounded-[28px] p-7 md:col-span-1">
								<h3 class="mb-2 text-2xl font-bold" style="color: {TEXT_100};">
									Avance Global: <span style="color: {PRIMARY_500};">24%</span>
								</h3>
								<div class="space-y-3">
									<p class="font-semibold" style="color: {ERROR_COLOR};">
										• <span style="color: {TEXT_100}; font-weight: 600;"
											>Luz para aprender <span style="font-weight: 400; color: {TEXT_300};"
												>requiere atención</span
											></span
										>
									</p>
								</div>
							</div>
						</div>
						<div class="grid grid-cols-1">
							<div class="md:col-span-2">
								<div
									class="flex cursor-pointer items-center justify-between gap-5 rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01] hover:ring-2 active:scale-[0.99]"
									style="
                                        border: 1px solid {ERROR_COLOR};
                                        background: #201323;
                                        color: {TEXT_100};
                                        box-shadow: 0 4px 18px rgba(255, 92, 108, 0.25);
                                        --tw-ring-color: {ERROR_COLOR};
                                    "
								>
									<div class="flex items-center gap-4">
										<span
											class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-black"
											style="background: {ERROR_COLOR}; color: white; box-shadow: 0 0 8px rgba(255, 92, 108, 0.5);"
										>
											!
										</span>
										<span
											class="flex-1 text-base font-medium sm:text-lg"
											style="color: {TEXT_300};"
										>
											¡Atención! Tenés <span class="font-extrabold" style="color: {TEXT_100};"
												>3 solicitudes de colaboración</span
											>
											pendientes de aprobación.
										</span>
									</div>
									<ChevronRight class="h-6 w-6 shrink-0" style="color: {TEXT_100};" />
								</div>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
							<div
								class="rounded-[28px] p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<h3 class="mb-6 text-2xl font-bold" style="color: {TEXT_100};">
									Seguimiento de objetivos
								</h3>
								<div
									class="rounded-[18px] p-6 transition-all duration-200 hover:scale-[1.01] hover:bg-[#20284F]"
									style="border: 1px solid {PRIMARY_500}; background: {BG_900}; box-shadow: 0 4px 18px rgba(0,0,32,0.40);"
								>
									<h4 class="mb-1 text-xl font-bold" style="color: {TEXT_100};">
										Luz para Aprender
									</h4>
									<p class="text-sm font-semibold" style="color: {ERROR_COLOR};">En Curso</p>
									<div class="mt-4 space-y-3">
										{#each luzParaAprenderProgress as goal}
											<div class="flex flex-col gap-1">
												<div class="flex justify-between text-sm font-medium">
													<span style="color: {TEXT_300};">{goal.label}</span>
													<span style="color: {goal.color};">{goal.percent}%</span>
												</div>
												<div
													class="h-2 overflow-hidden rounded-full"
													style="background: {BORDER_SUBTLE};"
												>
													<div
														class="h-full rounded-full transition-all duration-500"
														style="width: {goal.percent}%; background: {goal.color};"
													></div>
												</div>
											</div>
										{/each}
									</div>
									<div
										class="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4"
										style="border-color: {BORDER_SUBTLE};"
									>
										<button
											class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[#20284F] hover:shadow-md focus:ring-2 active:scale-[0.98]"
											style="background: {BG_CARD}; color: {PRIMARY_500}; border: 1px solid {PRIMARY_500}; --tw-ring-color: {RING_AZURE_10};"
										>
											Subir evidencia
										</button>
										<button
											class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[#20284F] hover:shadow-md focus:ring-2 active:scale-[0.98]"
											style="background: {BG_CARD}; color: {PRIMARY_500}; border: 1px solid {PRIMARY_500}; --tw-ring-color: {RING_AZURE_10};"
										>
											Actualizar progreso
										</button>
									</div>
								</div>
								<div
									class="mt-8 cursor-pointer rounded-[18px] border-2 border-dashed p-7 text-center transition-all duration-200 hover:scale-[1.01] hover:bg-[#20284F] active:scale-[0.99]"
									style="
                                        border-color: {PRIMARY_300};
                                        background: {BG_900};
                                        box-shadow: 0 4px 12px {PRIMARY_500}20;
                                    "
								>
									<Plus class="mx-auto mb-3 h-8 w-8" style="color: {PRIMARY_500};" />
									<p class="text-xl font-bold" style="color: {TEXT_100};">¿Crear otro proyecto?</p>
									<p class="mt-1 text-sm" style="color: {TEXT_400};">
										Todo gran impacto empieza en blanco. ¡Empecemos a escribirlo juntos!
									</p>
								</div>
								<a
									href="#"
									class="mt-8 flex items-center justify-end gap-1 text-sm font-semibold transition-colors duration-200 hover:text-white"
									style="color: {PRIMARY_500};"
								>
									Ver todos los proyectos <ChevronRight class="h-4 w-4" />
								</a>
							</div>
							<div
								class="rounded-[28px] p-7 text-center shadow-xl transition-shadow duration-300 hover:shadow-2xl"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<h3 class="mb-10 text-2xl font-bold" style="color: {TEXT_100};">Tipos de ayuda</h3>
								<div
									class="relative mx-auto grid h-52 w-52 place-items-center rounded-full"
									style="
                                        background: {donutGradient};
                                        border-radius: 50%;
                                        padding: 20px;
                                        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                                    "
								>
									<div
										class="flex h-full w-full flex-col items-center justify-center rounded-full text-center shadow-inner"
										style="
                                            background: {BG_CARD};
                                            border: 4px solid {BG_900}; 
                                        "
									>
										<p class="text-4xl font-extrabold" style="color: {TEXT_100};">0</p>
										<p class="mt-1 text-sm font-medium" style="color: {TEXT_400};">
											Personas beneficiadas aún
										</p>
									</div>
								</div>
								<div class="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
									{#each ayudaTypes as item}
										<span class="flex items-center gap-2 font-medium" style="color: {TEXT_400};">
											<span
												class="h-3 w-3 rounded-full shadow-md"
												style="background: {item.color}; box-shadow: 0 0 8px {item.color}40;"
											></span>
											{item.label}
											<span class="font-bold" style="color: {TEXT_100};">{item.percent}%</span>
										</span>
									{/each}
								</div>
							</div>
							<div
								class="rounded-[28px] p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl lg:col-span-2"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<h3 class="mb-6 text-2xl font-bold" style="color: {TEXT_100};">
									Actividad de colaboradores
								</h3>
								<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
									<div
										class="rounded-[18px] p-5 text-center"
										style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
									>
										<h4 class="mb-3 text-lg font-bold" style="color: {PRIMARY_500};">
											Top Colaboradores
										</h4>
										<div class="flex items-center justify-center py-6">
											<Users class="h-10 w-10" style="color: {TEXT_400};" />
										</div>
										<p class="text-sm" style="color: {TEXT_400};">
											Aún no hay datos suficientes. ¡Animá a la comunidad a unirse!
										</p>
									</div>
									<div
										class="rounded-[18px] p-5 text-center"
										style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
									>
										<h4 class="mb-3 text-lg font-bold" style="color: {PRIMARY_300};">
											Actividades más recientes
										</h4>
										<div class="flex items-center justify-center py-6">
											<TrendingUp class="h-10 w-10 rotate-90" style="color: {TEXT_400};" />
										</div>
										<p class="text-sm" style="color: {TEXT_400};">
											La actividad comenzará a registrarse tan pronto como inicies un nuevo
											proyecto.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
							<div
								class="rounded-[28px] p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<div class="mb-4 flex items-center justify-between">
									<h3 class="text-2xl font-bold" style="color: {TEXT_100};">Últimas reseñas</h3>
									<span class="text-lg font-extrabold" style="color: {PRIMARY_500};">
										Promedio 4.8
									</span>
								</div>
								<div
									class="rounded-[18px] p-6 text-center"
									style="border: 1px solid {BORDER_SUBTLE}; background: {BG_900}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
								>
									<div class="mb-4 flex justify-center gap-1">
										{#each Array(5) as _, i}
											<Star
												class="h-6 w-6"
												style="color: {WARNING_COLOR}; fill: {WARNING_COLOR};"
											/>
										{/each}
									</div>
									<p class="text-base font-medium italic" style="color: {TEXT_300};">
										"Los colaboradores aún no han dejado comentarios, pero el silencio también habla
										de comienzos"
									</p>
									<p class="mt-3 text-sm font-semibold" style="color: {TEXT_400};">
										— Equipo de Conectando Corazones
									</p>
								</div>
								<a
									href="#"
									class="mt-6 flex w-full items-center justify-end gap-1 text-sm font-semibold transition-colors duration-200 hover:text-white"
									style="color: {PRIMARY_500};"
								>
									Ver todas las reseñas <ChevronRight class="h-4 w-4" />
								</a>
							</div>
							<div
								class="rounded-[28px] p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<h3 class="mb-4 text-2xl font-bold" style="color: {TEXT_100};">
									Aspectos a mejorar
								</h3>
								<div
									class="rounded-[18px] border-2 border-dashed p-6 text-center"
									style="border-color: {WARNING_COLOR}; background: {BG_900}; box-shadow: 0 4px 12px {WARNING_COLOR}20;"
								>
									<Lightbulb class="mx-auto mb-3 h-8 w-8" style="color: {WARNING_COLOR};" />
									<p class="text-xl font-bold" style="color: {TEXT_100};">
										No hay aspectos a mejorar...
									</p>
									<p class="text-xl font-bold" style="color: {TEXT_100};">
										¡porque todo está recién empezando!
									</p>
									<p class="mt-4 text-sm" style="color: {TEXT_400};">
										Cuando los primeros proyectos se completen, este espacio te ayudará a crecer aún
										más.
									</p>
								</div>
								<a
									href="#"
									class="mt-6 flex w-full items-center justify-end gap-1 text-sm font-semibold transition-colors duration-200 hover:text-white"
									style="color: {PRIMARY_500};"
								>
									Ver todas las sugerencias <ChevronRight class="h-4 w-4" />
								</a>
							</div>
							<div
								class="rounded-[28px] p-7 shadow-xl transition-shadow duration-300 hover:shadow-2xl md:col-span-2"
								style="
                                    background: {BG_CARD};
                                    border: 1px solid {BORDER_SUBTLE};
                                    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
                                "
							>
								<h3 class="mb-4 text-2xl font-bold" style="color: {TEXT_100};">Novedades</h3>
								<div
									class="rounded-[18px] border-2 border-dashed p-6"
									style="
                                        border-color: {PRIMARY_300};
                                        background: {BG_900};
                                        box-shadow: 0 4px 12px {PRIMARY_300}20;
                                    "
								>
									<p class="text-lg font-bold" style="color: {PRIMARY_300};">
										¡Lanzamiento en Argentina!
									</p>
									<p class="mt-2 text-xl font-bold" style="color: {TEXT_100};">
										Conectando Corazones ya está operativo en Rosario.
									</p>
									<p class="mt-1 text-base" style="color: {TEXT_300};">
										Explorá las nuevas funcionalidades pensadas para tu región.
									</p>
								</div>
								<a
									href="#"
									class="mt-6 flex items-center justify-end gap-1 text-sm font-semibold transition-colors duration-200 hover:text-white"
									style="color: {PRIMARY_500};"
								>
									Ver últimas noticias <ChevronRight class="h-4 w-4" />
								</a>
							</div>
						</div>
					{:else if viewMode === 'projects'}
						<div
							class="flex h-full min-h-[70vh] flex-col space-y-8 rounded-[28px] p-10"
							style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
						>
							<h2 class="text-4xl font-extrabold" style="color: {TEXT_100};">
								{selectedProject.name}
							</h2>
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div class="space-y-4">
									<p class="text-2xl font-bold" style="color: {PRIMARY_500};">Estado Actual</p>
									<div
										class="flex items-center gap-3 rounded-[18px] p-4 text-xl font-bold"
										style="background: {BG_900}; border: 1px solid {selectedProject.statusColor};"
									>
										<span
											class="h-4 w-4 rounded-full shadow-md"
											style="background: {selectedProject.statusColor}; box-shadow: 0 0 8px {selectedProject.statusColor}40;"
										></span>
										{selectedProject.status}
									</div>
									<p class="text-lg font-medium" style="color: {TEXT_300};">
										Fecha de Cierre Estimada: <span class="font-bold" style="color: {TEXT_100};"
											>{selectedProject.date}</span
										>
									</p>
								</div>
								<div class="space-y-4">
									<p class="text-2xl font-bold" style="color: {PRIMARY_500};">Resumen</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										En la Escuela Esperanza, cada día los chicos y chicas estudian casi a oscuras.
										Las lámparas se quemaron y el edificio no cuenta con una instalación eléctrica
										segura. Sin embargo, la voluntad de aprender nunca se apagó. Este proyecto busca
										llevar nueva iluminación LED y cableado seguro a todas las aulas, creando un
										ambiente digno y luminoso para más de 200 alumnos.
									</p>
								</div>
							</div>
							<button
								class="mt-6 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98] sm:w-auto"
								style="
                                    background: linear-gradient(135deg, {PRIMARY_300} 0%, {PRIMARY_500} 100%);
                                    box-shadow: 0 5px 20px {PRIMARY_500}40;
                                    --tw-ring-color: {RING_AZURE_10};
                                "
							>
								<DownloadCloud class="h-5 w-5" />
								Ver Evidencia y Documentación
							</button>
						</div>
					{:else if viewMode === 'chat'}
						<div
							class="flex h-full min-h-[70vh] flex-col rounded-[28px] p-10"
							style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
						>
							<div class="flex-1 space-y-6 overflow-y-auto pr-2">
								<div
									class="ml-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {PRIMARY_500};">
										Tú · Institución (Escuela Esperanza)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										Hola, soy Patricia de la Escuela Esperanza 🌻 ¡Gracias a todos por sumarse para
										que nuestras aulas vuelvan a brillar!
									</p>
									<span class="mt-2 block text-right text-xs" style="color: {TEXT_400};"
										>12:30 PM</span
									>
								</div>
								<div
									class="mr-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {ERROR_COLOR};">
										Lumina Cooperativa · Colaborador (Empresa)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										Un gusto, Patricia. Desde Lumina Cooperativa confirmamos la donación de los
										cables y soportes. Estarán listos para retirar el jueves por la mañana.
									</p>
									<span class="mt-2 block text-left text-xs" style="color: {TEXT_400};"
										>12:35 PM</span
									>
								</div>
								<div
									class="mr-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {ERROR_COLOR};">
										Sembrar Futuro · Colaborador (ONG)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										Excelente!! 🙌 Nosotros enviaremos las lámparas LED mañana. Son de bajo consumo
										y larga duración. Compartimos el comprobante de entrega apenas salga el envío.
									</p>
									<span class="mt-2 block text-left text-xs" style="color: {TEXT_400};"
										>12:42 PM</span
									>
								</div>
								<div
									class="mr-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {ERROR_COLOR};">
										Lucas · Colaborador (Ing. Eléctrica de la UTN)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										Buenísimo, con Sofía podemos pasar el viernes a la escuela para comenzar la
										instalación. Si todo está en condiciones, en un día dejamos las tres aulas
										listas.
									</p>
									<span class="mt-2 block text-left text-xs" style="color: {TEXT_400};"
										>12:43 PM</span
									>
								</div>
								<div
									class="mr-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {ERROR_COLOR};">
										Sofía · Colaboradora (Ing. Eléctrica de la UTN)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										Sí, y podemos registrar fotos del antes y después para subirlas a la galería.
										Así queda trazado todo el proceso!
									</p>
									<span class="mt-2 block text-left text-xs" style="color: {TEXT_400};"
										>12:44 PM</span
									>
								</div>
								<div
									class="ml-auto max-w-[70%] rounded-[18px] p-4"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"
								>
									<p class="text-sm font-bold" style="color: {PRIMARY_500};">
										Tú · Institución (Escuela Esperanza)
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_300};">
										¡Mil gracias a todos! ❤️ Los chicos van a estar felices. Apenas finalicen los
										trabajos, validamos el proyecto en la plataforma.
									</p>
									<span class="mt-2 block text-right text-xs" style="color: {TEXT_400};"
										>12:45 PM</span
									>
								</div>
							</div>
							<div class="mt-6 border-t pt-6" style="border-color: {BORDER_SUBTLE};">
								<input
									type="text"
									placeholder="Escribí un mensaje..."
									class="w-full rounded-[18px] p-4 text-base focus:outline-none focus:ring-2"
									style="
                                        background: {BG_900};
                                        border: 1px solid {BORDER_SUBTLE};
                                        color: {TEXT_100};
                                        caret-color: {PRIMARY_300};
                                        --tw-ring-color: {RING_AZURE_10};
                                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                                    "
								/>
								<button
									class="mt-3 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
									style="
                                        background: {GRADIENT_CTA};
                                        box-shadow: 0 5px 20px {PRIMARY_500}40;
                                        --tw-ring-color: {RING_AZURE_10};
                                    "
								>
									Enviar Mensaje
									<ChevronRight class="h-5 w-5" />
								</button>
							</div>
						</div>
					{:else if viewMode === 'profile'}
						<div
							class="flex h-full min-h-[70vh] flex-col space-y-10 rounded-[28px] p-10"
							style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
						>
							<h2
								class="border-b pb-4 text-4xl font-extrabold"
								style="color: {TEXT_100}; border-color: {BORDER_SUBTLE};"
							>
								Perfil de la Institución
							</h2>
							<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
								<div
									class="space-y-3 rounded-[18px] p-6"
									style="background: {BG_900}; border: 2px solid {PRIMARY_500}; box-shadow: 0 0 12px {PRIMARY_500}30;"
								>
									<h3
										class="flex items-center gap-3 text-2xl font-bold"
										style="color: {PRIMARY_300};"
									>
										<ShieldCheck class="h-7 w-7" /> Verificación Exitosa
									</h3>
									<p class="text-lg font-bold" style="color: {TEXT_100};">
										Tu cuenta ha sido verificada correctamente en la plataforma.
									</p>
									<p class="text-base" style="color: {TEXT_300};">
										Método: Verificación de documentación manual.
									</p>
									<p class="text-base font-semibold" style="color: {TEXT_100};">
										Última verificación: Octubre 2025.
									</p>
									<p class="text-base font-bold" style="color: {ERROR_COLOR};">
										Próxima verificación: Octubre 2026.
									</p>
								</div>
								<div
									class="space-y-4 rounded-[18px] p-6"
									style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 4px 18px rgba(0,0,32,0.18);"
								>
									<h3 class="text-2xl font-bold" style="color: {PRIMARY_500};">
										Datos de la Institución
									</h3>
									<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
										<span class="block text-sm font-bold" style="color: {TEXT_400};"
											>Institución:</span
										> Escuela Esperanza
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
										<span class="block text-sm font-bold" style="color: {TEXT_400};"
											>Representante Legal:</span
										> Patricia
									</p>
									<p class="text-lg leading-relaxed" style="color: {TEXT_100};">
										<span class="block text-sm font-bold" style="color: {TEXT_400};"
											>Ubicación:</span
										> Escuela Esperanza, Rosario, Santa Fe, Argentina.
									</p>
								</div>
							</div>
							<button
								class="mt-8 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
								style="
                                    background: {GRADIENT_CTA};
                                    box-shadow: 0 5px 20px {PRIMARY_500}40;
                                    --tw-ring-color: {RING_AZURE_10};
                                "
							>
								<Settings class="h-5 w-5" />
								Editar perfil
							</button>
						</div>
					{:else if viewMode === 'settings'}
						<div
							class="flex h-full min-h-[70vh] flex-col space-y-10 rounded-[28px] p-10"
							style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
						>
							<h2
								class="border-b pb-4 text-4xl font-extrabold"
								style="color: {TEXT_100}; border-color: {BORDER_SUBTLE};"
							>
								Configuración de Privacidad
							</h2>
							<div class="space-y-6">
								<p class="text-2xl font-bold" style="color: {PRIMARY_500};">
									Visibilidad de Datos de Contacto
								</p>
								{#each [{ label: 'Dirección de la escuela', key: 'address' }, { label: 'Correo electrónico (Email)', key: 'email' }, { label: 'Teléfono de contacto', key: 'phone' }] as item}
									<div
										class="flex flex-col items-start justify-between gap-4 rounded-[18px] p-5 md:flex-row md:items-center"
										style="background: {BG_900}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);"
									>
										<label
											class="text-lg font-semibold"
											for="{item.key}-privacy"
											style="color: {TEXT_100};">{item.label}</label
										>
										<div class="flex flex-wrap gap-6">
											<div class="flex items-center gap-2">
												<input
													type="radio"
													id="{item.key}-hidden-settings"
													name="{item.key}-privacy-settings"
													value="hidden"
													class="h-4 w-4"
													style="border-color: {ERROR_COLOR}; background-color: {BG_CARD}; accent-color: {ERROR_COLOR};"
												/>
												<label for="{item.key}-hidden-settings" style="color: {TEXT_400};"
													>Oculto para todos</label
												>
											</div>
											<div class="flex items-center gap-2">
												<input
													type="radio"
													id="{item.key}-public-settings"
													name="{item.key}-privacy-settings"
													value="public"
													class="h-4 w-4"
													checked
													style="border-color: {PRIMARY_500}; background-color: {BG_CARD}; accent-color: {PRIMARY_500};"
												/>
												<label for="{item.key}-public-settings" style="color: {TEXT_400};"
													>Visible para todos</label
												>
											</div>
											<div class="flex items-center gap-2">
												<input
													type="radio"
													id="{item.key}-collaborators-settings"
													name="{item.key}-privacy-settings"
													value="collaborators"
													class="h-4 w-4"
													style="border-color: {WARNING_COLOR}; background-color: {BG_CARD}; accent-color: {WARNING_COLOR};"
												/>
												<label for="{item.key}-collaborators-settings" style="color: {TEXT_400};"
													>Solo colaboradores activos</label
												>
											</div>
										</div>
									</div>
								{/each}
							</div>
							<button
								class="mt-8 flex w-full items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold text-white transition-all duration-200 hover:scale-[1.01] focus:outline-none focus:ring-4 active:scale-[0.98]"
								style="
                                    background: {GRADIENT_CTA};
                                    box-shadow: 0 5px 20px {PRIMARY_500}40;
                                    --tw-ring-color: {RING_AZURE_10};
                                "
							>
								<Settings class="h-5 w-5" />
								Guardar Cambios
							</button>
						</div>
					{:else}
						<div
							class="flex h-full min-h-[70vh] flex-col items-center justify-center space-y-10 rounded-[28px] p-10 text-center"
							style="background: {BG_CARD}; border: 1px solid {BORDER_SUBTLE}; box-shadow: 0 8px 28px rgba(0,0,0,0.22);"
						>
							<h2 class="text-5xl font-extrabold" style="color: {TEXT_100};">
								Sección: {navItems.find((i) => i.view === viewMode)?.label ||
									'Conectando Corazones'}
							</h2>
							<p class="text-xl font-medium leading-relaxed" style="color: {TEXT_300};">
								Esta es la vista para gestionar tu {navItems
									.find((i) => i.view === viewMode)
									?.label.toLowerCase()}.
							</p>
							<div
								class="rounded-[28px] border-4 border-dashed p-16 text-center transition-all duration-300 hover:scale-[1.01] hover:bg-[#20284F]"
								style="border-color: {PRIMARY_500}; background: {BG_900}; box-shadow: 0 4px 12px {PRIMARY_500}20;"
							>
								<svelte:component
									this={navItems.find((i) => i.view === viewMode)?.icon || LayoutGrid}
									class="mx-auto mb-6 h-12 w-12"
									style="color: {PRIMARY_500};"
								/>
								<p class="text-xl font-bold" style="color: {TEXT_100};">¡En construcción!</p>
								<p class="mt-2 text-base" style="color: {TEXT_400};">
									Pronto aquí encontrarás herramientas avanzadas de gestión y reporte.
								</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</section>
	</main>
</div>

<style>
	.text-inter {
		font-family: 'Inter', sans-serif;
	}
	input::placeholder {
		color: var(--webkit-input-placeholder-color);
		opacity: 1;
	}
	input::-ms-input-placeholder {
		color: var(--webkit-input-placeholder-color);
	}
	select option {
		background: #19203f;
		color: #eaf2ff;
	}
	@media (min-width: 1024px) {
		nav {
			width: 200px;
		}
		main {
			margin-left: 200px !important;
		}
	}
</style>
