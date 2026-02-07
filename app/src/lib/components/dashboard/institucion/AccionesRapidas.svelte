<script lang="ts">
	import {
		Plus,
		FileText,
		UploadCloud,
		FolderKanban,
		MessageSquare,
		XCircle,
		ChevronDown,
		ChevronUp
	} from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let showAllActions = false;

	export let solicitudesPendientes = 0;
	export let mensajesNoLeidos = 0;
	export let proyectosPendienteCierre = 0;

	export let showEvidenceModal = false;
	export let onExportPDF: () => void = () => {};

	// Configuracion de indicadores y color para los botones de acción rápida
	let badgeConfig: Record<string, { count: number; color: string; shadow: string }>;
	$: badgeConfig = {
		'Ver solicitudes': {
			count: solicitudesPendientes,
			color: 'bg-rose-500',
			shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]'
		},
		'Mis chats': {
			count: mensajesNoLeidos,
			color: 'bg-rose-500',
			shadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]'
		},
		'Solicitar cierre': {
			count: proyectosPendienteCierre,
			color: 'bg-emerald-500',
			shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]'
		}
	};

	interface Accion {
		label: string;
		icon: any;
		href?: string;
		onClick?: () => void;
		primary?: boolean;
		secondary?: boolean;
		color?: string;
	}

	const acciones: Accion[] = [
		{ label: 'Crear proyecto', icon: Plus, href: '/proyectos/crear', primary: true },
		{ label: 'Ver solicitudes', icon: FileText, href: '/institucion/solicitudes-colaboracion' },
		{ label: 'Cargar evidencia', icon: UploadCloud, onClick: () => (showEvidenceModal = true) },
		{ label: 'Mis proyectos', icon: FolderKanban, href: '/proyectos?tab=mis-proyectos' },
		{ label: 'Mis chats', icon: MessageSquare, href: '/mensajes' },
		{ label: 'Solicitar cierre', icon: XCircle, href: '/institucion/solicitar-cierre' },
		{
			label: 'Exportar reporte',
			icon: FileText,
			onClick: onExportPDF,
			secondary: true,
			color: 'rose'
		}
	];
</script>

<div class="relative mb-12">
	<!-- Desktop Layout (Grid) -->
	<div class="hidden sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-4 xl:grid-cols-7">
		{#each acciones as accion}
			<div class="relative w-full">
				{#if accion.href}
					<a
						href={accion.href}
						class="group flex h-full items-center justify-center gap-3 rounded-full px-5 py-3 backdrop-blur-md transition-all duration-300
					{accion.primary
							? 'border border-blue-500/30 bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_6px_25px_-4px_rgba(59,130,246,0.6)]'
							: accion.secondary && accion.color === 'rose'
								? 'border border-rose-500/30 bg-gradient-to-r from-rose-600/80 to-rose-500/80 text-white shadow-[0_4px_20px_-4px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-[0_6px_25px_-4px_rgba(244,63,94,0.6)]'
								: 'border border-white/5 bg-white/5 text-slate-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white'}"
					>
						<div
							class={accion.primary || (accion.secondary && accion.color === 'rose')
								? 'text-white'
								: 'text-slate-400 transition-colors group-hover:text-white'}
						>
							<svelte:component this={accion.icon} size={18} />
						</div>
						<span class="text-sm tracking-wide whitespace-nowrap">{accion.label}</span>
					</a>
				{:else}
					<button
						on:click={accion.onClick}
						class="group flex h-full w-full items-center justify-center gap-3 rounded-full px-5 py-3 backdrop-blur-md transition-all duration-300
					{accion.primary
							? 'border border-blue-500/30 bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_6px_25px_-4px_rgba(59,130,246,0.6)]'
							: accion.secondary && accion.color === 'rose'
								? 'border border-rose-500/30 bg-gradient-to-r from-rose-600/80 to-rose-500/80 text-white shadow-[0_4px_20px_-4px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-[0_6px_25px_-4px_rgba(244,63,94,0.6)]'
								: 'border border-white/5 bg-white/5 text-slate-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white'}"
					>
						<div
							class={accion.primary || (accion.secondary && accion.color === 'rose')
								? 'text-white'
								: 'text-slate-400 transition-colors group-hover:text-white'}
						>
							<svelte:component this={accion.icon} size={18} />
						</div>
						<span class="text-sm tracking-wide whitespace-nowrap">{accion.label}</span>
					</button>
				{/if}

				<!-- Dinamically rendered Badges -->
				{#if badgeConfig[accion.label] && badgeConfig[accion.label].count > 0}
					<div
						class="animate-bounce-subtle pointer-events-none absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-[#0F1029] select-none md:-top-2 md:-right-2 {badgeConfig[
							accion.label
						].color} {badgeConfig[accion.label].shadow}"
					>
						{badgeConfig[accion.label].count}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Mobile Layout (Stack + Expandable) -->
	<div class="flex flex-col gap-3 sm:hidden">
		<!-- Featured Actions (Always Visible) -->
		{#each acciones.filter((a) => a.primary || (a.secondary && a.color === 'rose')) as accion}
			<div class="relative w-full">
				{#if accion.href}
					<a
						href={accion.href}
						class="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl p-4 text-white shadow-lg backdrop-blur-xl transition-all duration-300 active:scale-[0.98]
						{accion.primary
							? 'border border-blue-500/30 bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-blue-800/90 shadow-blue-500/25 hover:shadow-blue-500/40'
							: 'border border-rose-500/30 bg-gradient-to-br from-rose-500/90 via-rose-600/90 to-rose-800/90 shadow-rose-500/25 hover:shadow-rose-500/40'}"
					>
						<div
							class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<svelte:component this={accion.icon} size={22} weight="bold" />
						<span class="text-lg font-bold tracking-wide">{accion.label}</span>
					</a>
				{:else}
					<button
						on:click={accion.onClick}
						class="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl p-4 text-white shadow-lg backdrop-blur-xl transition-all duration-300 active:scale-[0.98]
						{accion.primary
							? 'border border-blue-500/30 bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-blue-800/90 shadow-blue-500/25 hover:shadow-blue-500/40'
							: 'border border-rose-500/30 bg-gradient-to-br from-rose-500/90 via-rose-600/90 to-rose-800/90 shadow-rose-500/25 hover:shadow-rose-500/40'}"
					>
						<!-- Subtle Shine Effect -->
						<div
							class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>

						<svelte:component this={accion.icon} size={22} weight="bold" />
						<span class="text-lg font-bold tracking-wide">{accion.label}</span>
					</button>
				{/if}
			</div>
		{/each}

		<!-- Secondary Actions (Expandable) -->
		{#if showAllActions}
			<div transition:slide={{ duration: 300, axis: 'y' }} class="grid grid-cols-2 gap-3 pt-2">
				{#each acciones.filter((a) => !a.primary && !(a.secondary && a.color === 'rose')) as accion}
					<div class="relative w-full">
						{#if accion.href}
							<a
								href={accion.href}
								class="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 text-slate-300 backdrop-blur-md transition-all active:scale-[0.98] active:bg-white/10"
							>
								<svelte:component this={accion.icon} size={20} />
								<span class="text-center text-xs font-medium">{accion.label}</span>
							</a>
						{:else}
							<button
								on:click={accion.onClick}
								class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 text-slate-300 backdrop-blur-md transition-all active:scale-[0.98] active:bg-white/10"
							>
								<svelte:component this={accion.icon} size={20} />
								<span class="text-center text-xs font-medium">{accion.label}</span>
							</button>
						{/if}

						<!-- Badges -->
						{#if badgeConfig[accion.label] && badgeConfig[accion.label].count > 0}
							<div
								class="absolute top-2 right-2 flex h-2.5 w-2.5 rounded-full {badgeConfig[
									accion.label
								].color} {badgeConfig[accion.label].shadow}"
							></div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Toggle Button -->
		<button
			on:click={() => (showAllActions = !showAllActions)}
			class="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-400 transition-colors hover:text-white"
		>
			<span>{showAllActions ? 'Ver menos acciones' : 'Ver más acciones'}</span>
			{#if showAllActions}
				<ChevronUp size={14} />
			{:else}
				<ChevronDown size={14} />
			{/if}
		</button>
	</div>
</div>

<style>
	@keyframes bounceSubtle {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px);
		}
	}
	.animate-bounce-subtle {
		animation: bounceSubtle 2s ease-in-out infinite;
	}
</style>
