<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ChevronDown } from '@steeze-ui/heroicons';
	import { slide, fade } from 'svelte/transition';

	let {
		isOpen = $bindable(false),
		accionesMenu,
		isMobile = false,
		esAdministrador = false
	} = $props<{
		isOpen: boolean;
		accionesMenu: {
			label: string;
			icon: any;
			onclick: () => void;
			variant?: 'danger' | 'default';
			disabled?: boolean;
			divider?: boolean;
		}[];
		isMobile?: boolean;
		esAdministrador?: boolean;
	}>();

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}
</script>

<div class="relative flex-1">
	<button
		type="button"
		onclick={toggle}
		class={esAdministrador
			? isMobile
				? 'flex w-full items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold whitespace-nowrap text-white shadow-lg transition active:scale-[0.98]'
				: 'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-slate-900 px-4 font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(15,23,42,.35)] transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]'
			: isMobile
				? 'flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 py-3 font-bold whitespace-nowrap text-white shadow-lg transition active:scale-[0.98]'
				: 'inline-flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 px-4 font-semibold whitespace-nowrap text-white shadow-[0_8px_24px_rgba(2,132,199,.35)] transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-[1px]'}
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		<span>Gestionar proyecto</span>
		<Icon
			src={ChevronDown}
			class="h-4 w-4 shrink-0 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>

	{#if isOpen}
		<!-- Overlay for closing -->
		<div
			class="fixed inset-0 z-40 {isMobile ? 'bg-black/50 backdrop-blur-sm' : ''}"
			onclick={close}
			onkeydown={(e) => e.key === 'Escape' && close()}
			transition:fade={{ duration: 150 }}
			aria-hidden="true"
		></div>

		<div
			class="animate-in {isMobile
				? 'slide-in-from-bottom-5 absolute bottom-full left-0 z-50 mb-3 flex w-max min-w-full text-left'
				: 'fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 flex'} flex-col overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl ring-1 ring-black/5 duration-100"
			role="menu"
			tabindex="-1"
			transition:slide={{ duration: 200 }}
		>
			{#each accionesMenu as accion}
				{#if accion.divider}
					<div class="my-1 border-t border-gray-100"></div>
				{:else}
					<button
						class="flex w-full items-center gap-3 px-4 py-2.5 {isMobile
							? 'text-base'
							: 'text-sm'} font-medium transition-colors {accion.variant === 'danger'
							? accion.disabled
								? 'cursor-not-allowed text-gray-400 opacity-50'
								: 'text-red-600 hover:bg-red-50'
							: 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'} {accion.disabled
							? 'cursor-not-allowed opacity-50'
							: ''}"
						role="menuitem"
						disabled={accion.disabled}
						onclick={() => {
							accion.onclick();
							close();
						}}
					>
						<Icon
							src={accion.icon}
							class="{isMobile ? 'h-5 w-5' : 'h-4 w-4'} {accion.variant === 'danger'
								? accion.disabled
									? 'text-gray-400'
									: 'text-red-500'
								: 'text-gray-500'}"
						/>
						{accion.label}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
