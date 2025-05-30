<!--
* Componente: Button
	-*- Descripción: botón interactivo con animaciones visuales y navegación integrada.
	-*- Funcionalidad: soporta navegación interna (mediante `goto`) o externa (`window.location.href`) según el caso.

* Props:
	-*- label (string): texto visible dentro del botón. Por defecto: 'Hacé clic!'.
	-*- disabled (boolean): si está activado, el botón queda deshabilitado y atenuado.
	-*- href (string): ruta o URL de destino al hacer clic.
	-*- external (boolean): si es `true`, se navega usando `window.location.href` en lugar de `goto()`.
	-*- variant (string): tipo de botón, puede ser 'primary' o 'ghost'. Por defecto: 'primary'.

TODO:
	- [ ] Agregar otras variantes de estilo: `secondary`, `outline`, `danger`.

! WARNING:
	-!- Este botón asume que `href` siempre es una URL válida. Validar si el string es vacío puede ser necesario.

* DECISIÓN DE DISEÑO:
	-*- Se optó por usar `goto()` de SvelteKit para navegación interna y `window.location.href` para externa, sin usar `<a>` para mayor control.

? CUESTIONES ABIERTAS:
	-?- ¿Debería usarse un `<a>` si `external === true` por accesibilidad semántica?
	-?- ¿Conviene separar el componente en dos: Button + LinkButton?
-->

<script lang="ts">
	import { clsx } from 'clsx';
	import { goto } from '$app/navigation';
	export let label: string = 'Hacé clic!';
	export let disabled = false;
	export let href: string = '/';
	export let external = false;
	export let variant: 'primary' | 'ghost' = 'primary';
</script>

{#if variant === 'primary'}
	<button
		on:click={() => {
			if (external) window.location.href = href;
			else if (!disabled) goto(href);
		}}
		class={clsx(
			'rounded-4xl group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 py-3 transition-all duration-300',
			'h-12 min-w-[140px] select-none text-[17px] font-semibold tracking-tight md:h-14',
			'bg-primary hover:bg-primary-hover text-white',
			disabled && 'cursor-not-allowed opacity-50'
		)}
		role="link"
		tabindex="0"
		aria-label={`Ir a ${href}`}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		<span
			class="text-animation font-inter z-10 whitespace-nowrap text-[18px] font-semibold leading-[1.11]"
		>
			{label}
		</span>
		<span class="icon-animation absolute z-10 flex h-full w-full items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
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
{:else}
	<!-- GHOST VARIANT - con una iluminación leve en hover -->
	<button
		on:click={() => {
			if (external) window.location.href = href;
			else if (!disabled) goto(href);
		}}
		class={clsx(
			'cta-minimal-shine-btn rounded-4xl group relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden border border-blue-400 bg-white/5 px-8 py-3 text-[17px] font-semibold tracking-tight text-blue-400 shadow-none outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-300 md:h-14',
			disabled && 'cursor-not-allowed opacity-50'
		)}
		role="link"
		tabindex="0"
		aria-label={`Ir a ${href}`}
	>
		<span class="relative z-10 flex items-center gap-2 transition-colors duration-200">
			{label}
			<svg
				class="ml-1 transition-transform duration-300 group-hover:translate-x-1"
				xmlns="http://www.w3.org/2000/svg"
				width="21"
				height="21"
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
