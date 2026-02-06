<script lang="ts">
	import {
		Plus,
		FileText,
		UploadCloud,
		FolderKanban,
		MessageSquare,
		BarChart3,
		XCircle,
		ChevronRight
	} from 'lucide-svelte';
	import { onMount } from 'svelte';

	let scrollContainer: HTMLDivElement;
	let showRightIndicator = false;

	function checkScroll() {
		if (!scrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
		showRightIndicator = scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10;
	}

	onMount(() => {
		checkScroll();
		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	});

	const actions = [
		{ label: 'Crear proyecto', icon: Plus, href: '/proyectos/nuevo', primary: true },
		{ label: 'Ver solicitudes', icon: FileText, href: '/institucion/solicitudes' },
		{ label: 'Cargar evidencia', icon: UploadCloud, href: '/institucion/evidencias' },
		{ label: 'Mis proyectos', icon: FolderKanban, href: '/institucion/mis-proyectos' },
		{ label: 'Mis chats', icon: MessageSquare, href: '/mensajes' },
		{ label: 'Ver progresos', icon: BarChart3, href: '/institucion/progresos' },
		{ label: 'Solicitar cierre', icon: XCircle, href: '/institucion/cierre-proyecto' }
	];
</script>

<div class="relative mb-12">
	<!-- Mobile: Horizontal Scroll | Desktop: Wrap -->
	<div
		bind:this={scrollContainer}
		on:scroll={checkScroll}
		class="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 xl:grid-cols-7 [&::-webkit-scrollbar]:hidden"
	>
		{#each actions as action}
			<a
				href={action.href}
				class="group flex shrink-0 snap-start items-center justify-center gap-3 rounded-full px-5 py-3 transition-all duration-300 sm:w-full
                {action.primary
					? 'from-primary shadow-primary/25 hover:shadow-primary/40 bg-gradient-to-r to-blue-500 font-semibold text-white shadow-lg hover:-translate-y-1'
					: 'border border-white/5 bg-white/5 text-slate-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white'}"
			>
				<div
					class={action.primary
						? 'text-white'
						: 'text-slate-400 transition-colors group-hover:text-white'}
				>
					<svelte:component this={action.icon} size={18} />
				</div>
				<span class="text-sm tracking-wide whitespace-nowrap">{action.label}</span>
			</a>
		{/each}
	</div>

	<!-- Scroll Indicator (Mobile Only) -->
	<div
		class="pointer-events-none absolute top-0 right-0 bottom-4 flex w-16 items-center justify-end bg-gradient-to-l from-[#0F1029] to-transparent pr-2 transition-opacity duration-300 sm:hidden {showRightIndicator
			? 'opacity-100'
			: 'opacity-0'}"
	>
		<div class="animate-pulse rounded-full bg-white/10 p-1.5 shadow-lg backdrop-blur-md">
			<ChevronRight size={16} class="text-white" />
		</div>
	</div>
</div>
