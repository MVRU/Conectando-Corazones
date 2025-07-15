<!--
* Componente: Button
	-*- Descripción: botón interactivo con animaciones visuales y navegación integrada.
	-*- Funcionalidad: soporta navegación interna (mediante `goto`) o externa (`window.location.href`) según el caso.

* Props:
	-*- label (string): texto visible dentro del botón. Por defecto: 'Hacé clic!'.
	-*- disabled (boolean): si está activado, el botón queda deshabilitado y atenuado.
	-*- href (string): ruta o URL de destino al hacer clic.
	-*- external (boolean): si es `true`, se navega usando `window.location.href` en lugar de `goto()`.
	-*- variant (string): 'primary', 'secondary' o 'ghost'. Por defecto: 'primary'.

TODO:
	- [ ] Agregar otras variantes de estilo: `outline`, `danger`.

! WARNING:
	-!- Este botón asume que `href` siempre es una URL válida.
-->

<script lang="ts">
	import { clsx } from 'clsx';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	export let label: string = 'Hacé clic!';
	export let disabled = false;
	export let href: string | null = null;
	export let external = false;
	export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
	export let size: 'md' | 'sm' = 'md';
	export let customClass = '';
	export let customAriaLabel: string | null = null; // para accesibilidad
	$: ariaLabel = customAriaLabel ?? (href ? `Ir a ${href}` : undefined);
	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		dispatch('click', event); // Reenviamos el evento al padre

		if (href && !disabled) {
			if (external) {
				window.location.href = href;
			} else {
				goto(href);
			}
		}
	}

	/* ---------- mapas de tamaño para size ---------- */
	const rootSize = {
		md: 'h-12 md:h-14 min-w-[140px] px-6 py-3',
		sm: 'h-9  md:h-10 min-w-[100px] px-4 py-2'
	};
	const textSize = { md: 'text-[18px]', sm: 'text-[15px]' };
	const iconSize = { md: 'w-5 h-5', sm: 'w-4 h-4' };
</script>

<!-- ! Variante Primary -->
{#if variant === 'primary'}
	<button
		on:click={handleClick}
		class={clsx(
			'rounded-4xl group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden font-semibold tracking-tight transition-all duration-300',
			rootSize[size],
			'bg-primary hover:bg-primary-hover text-white',
			disabled && 'cursor-not-allowed opacity-50',
			customClass
		)}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		<span
			class={clsx(
				'text-animation font-inter z-10 whitespace-nowrap leading-[1.11]',
				textSize[size]
			)}
		>
			{label}
		</span>
		<span
			class={clsx('icon-animation absolute z-10 flex items-center justify-center', iconSize[size])}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</span>
	</button>

	<!-- ! Variante Secondary -->
{:else if variant === 'secondary'}
	<button
		on:click={handleClick}
		class={clsx(
			'rounded-4xl group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden font-semibold tracking-tight transition-all duration-300',
			rootSize[size],
			'bg-[#eff6ff] text-[rgb(var(--color-primary))] hover:bg-[#dbeafe]',
			disabled && 'cursor-not-allowed opacity-50',
			customClass
		)}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		<span
			class={clsx(
				'text-animation font-inter z-10 whitespace-nowrap leading-[1.11]',
				textSize[size]
			)}
		>
			{label}
		</span>
		<span
			class={clsx('icon-animation absolute z-10 flex items-center justify-center', iconSize[size])}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</span>
	</button>

	<!-- ! Variante Ghost -->
{:else}
	<button
		on:click={handleClick}
		class={clsx(
			'cta-minimal-shine-btn rounded-4xl group relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden border border-blue-400 bg-white/5 font-semibold tracking-tight text-blue-400 shadow-none outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-300',
			size === 'md'
				? 'h-12 min-w-[140px] px-8 py-3 md:h-14'
				: 'h-9 min-w-[100px]  px-5 py-2 md:h-10',
			disabled && 'cursor-not-allowed opacity-50',
			customClass
		)}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
	>
		<span class="relative z-10 flex items-center gap-2 transition-colors duration-200">
			{label}
			<svg
				class={clsx('transition-transform duration-300 group-hover:translate-x-1', iconSize[size])}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#3b82f6"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M5 12h14M12 5l7 7-7 7" />
			</svg>
		</span>
		<span class="cta-btn-bg pointer-events-none absolute inset-0 z-0"></span>
	</button>
{/if}

<style>
	/* --- ANIMACIÓN PARA PRIMARY BUTTON --- */
	@keyframes background-up {
		from {
			transform: scaleY(0);
			opacity: 0;
		}
		to {
			transform: scaleY(1);
			opacity: 0.1;
		}
	}
	@keyframes background-down {
		from {
			transform: scaleY(1);
			opacity: 0.1;
		}
		to {
			transform: scaleY(0);
			opacity: 0;
		}
	}
	@keyframes text-up {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(-20px);
			opacity: 0;
		}
	}
	@keyframes text-down {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes icon-down {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes icon-up {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(20px);
			opacity: 0;
		}
	}
	.group:hover .background-animation {
		animation: background-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	.group:not(:hover) .background-animation {
		animation: background-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	.group:hover .text-animation {
		animation: text-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	.group:not(:hover) .text-animation {
		animation: text-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	.group:hover .icon-animation {
		animation: icon-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	.group:not(:hover) .icon-animation {
		animation: icon-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* --- ANIMACIÓN PARA GHOST BUTTON --- */
	.cta-minimal-shine-btn {
		position: relative;
		overflow: hidden;
		color: #93c5fd;
		background: rgba(255, 255, 255, 0.03);
		transition:
			color 0.28s cubic-bezier(0.45, 0, 0.18, 1),
			background 0.32s cubic-bezier(0.45, 0, 0.18, 1),
			border-color 0.32s cubic-bezier(0.45, 0, 0.18, 1),
			box-shadow 0.32s cubic-bezier(0.45, 0, 0.18, 1);
	}

	.cta-minimal-shine-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		background: linear-gradient(
			120deg,
			rgba(72, 182, 255, 0) 0%,
			rgba(72, 182, 255, 0.08) 30%,
			rgba(110, 180, 255, 0.19) 50%,
			rgba(72, 182, 255, 0.08) 70%,
			rgba(72, 182, 255, 0) 100%
		);
		transform: translateX(-70%);
		transition: transform 0.65s cubic-bezier(0.45, 0, 0.18, 1);
		pointer-events: none;
	}
	.cta-minimal-shine-btn:hover,
	.cta-minimal-shine-btn:focus-visible {
		border-color: #4f8cff;
		color: #e0eefe;
		background: rgba(71, 166, 255, 0.06);
		box-shadow: 0 6px 18px 0 #377cff18;
	}
	.cta-minimal-shine-btn:hover::before,
	.cta-minimal-shine-btn:focus-visible::before {
		transform: translateX(0);
	}
	.cta-minimal-shine-btn:active {
		color: #fff;
		background: rgba(72, 182, 255, 0.09);
	}
</style>
