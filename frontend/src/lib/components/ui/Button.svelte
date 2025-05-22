<script lang="ts">
	import { clsx } from 'clsx';
	export let label: string = 'Click me';
	export let disabled = false;
</script>

<button
	class={clsx(
		'rounded-4xl group relative cursor-pointer overflow-hidden px-6 py-3',
		'flex items-center justify-center gap-2',
		'transition-colors duration-300 ease-in-out',
		'bg-primary hover:bg-primary-hover text-white',
		'h-12 md:h-14',
		disabled && 'cursor-not-allowed opacity-50'
	)}
>
	<!-- Fondo que sube desde abajo -->
	<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>

	<!-- Texto con estilo -->
	<span
		class="text-animation font-inter z-10 whitespace-nowrap text-[18px] font-semibold leading-[1.11]"
	>
		{label}
	</span>

	<!-- Flecha que entra desde abajo -->
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

<style>
	:global(button) {
		padding: 18px 29px;
		min-width: 140px;
		white-space: nowrap;
		font-size: 16px;
	}

	/* Animaciones de entrada (hover) */
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

	/* Animaciones de salida (no hover) */

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

	/* Aplicar animaciones en hover */

	.group:hover .background-animation {
		animation: background-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.group:hover .text-animation {
		animation: text-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.group:hover .icon-animation {
		animation: icon-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	/* Animaciones de salida (sin hover) */

	.group:not(:hover) .background-animation {
		animation: background-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.group:not(:hover) .text-animation {
		animation: text-down 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	.group:not(:hover) .icon-animation {
		animation: icon-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
</style>
