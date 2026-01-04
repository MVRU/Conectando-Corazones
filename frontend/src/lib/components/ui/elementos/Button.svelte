<script lang="ts">
	import { clsx } from 'clsx';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import { isSafeHref } from '$lib/utils/sanitize';
	export let label: string = 'Hacé clic!';
	export let disabled = false;
	export let loading = false;
	export let loadingLabel: string | null = null;
	export let href: string | null = null;
	export let target: '_blank' | '_self' | string = '_blank';
	export let external = false;
	export let variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
	export let size: 'md' | 'sm' = 'md';
	export let customClass = '';
	export let customAriaLabel: string | null = null;
	export let type: 'button' | 'submit' | 'reset' = 'submit';
	$: ariaLabel = customAriaLabel ?? (href ? `Ir a ${href}` : undefined);
	$: isDisabled = disabled || loading;
	$: busyLabel = loadingLabel ?? label;
	const dispatch = createEventDispatcher();

	function handleClick(event: MouseEvent) {
		dispatch('click', event);

		if (href && !isDisabled && isSafeHref(href)) {
			if (external) {
				window.open(href, target, 'noopener');
			} else {
				goto(href);
			}
		}
	}

	const rootSize = {
		md: 'h-12 md:h-14 min-w-[140px] px-6 py-3',
		sm: 'h-9  md:h-10 min-w-[100px] px-4 py-2'
	};
	const textSize = { md: 'text-[18px]', sm: 'text-[15px]' };
	const iconSize = { md: 'w-5 h-5', sm: 'w-4 h-4' };
	const rootBase =
		'rounded-4xl group relative flex cursor-pointer items-center justify-center gap-2 overflow-hidden font-semibold tracking-tight transition-all duration-300';
</script>

<!-- ! Variante Primary -->
{#if variant === 'primary'}
	<button
		on:click={handleClick}
		class={clsx(
			rootBase,
			rootSize[size],
			'bg-primary hover:bg-primary-hover text-white',
			isDisabled && 'pointer-events-none cursor-not-allowed opacity-50 ',
			customClass
		)}
		{type}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
		aria-busy={loading || undefined}
		aria-disabled={isDisabled}
		disabled={isDisabled}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		{#if loading}
			<svg
				class={clsx(iconSize[size], 'z-10 animate-spin')}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				role="status"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span class="sr-only">{busyLabel}</span>
		{:else}
			<span
				class={clsx(
					'text-animation font-inter z-10 whitespace-nowrap leading-[1.11]',
					textSize[size]
				)}
			>
				{label}
			</span>
			<span
				class={clsx(
					'icon-animation absolute z-10 flex items-center justify-center',
					iconSize[size]
				)}
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
		{/if}
	</button>

	<!-- ! Variante Secondary -->
{:else if variant === 'secondary'}
	<button
		on:click={handleClick}
		class={clsx(
			rootBase,
			rootSize[size],
			'bg-[#eff6ff] text-[rgb(var(--color-primary))] hover:bg-[#dbeafe]',
			isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
			customClass
		)}
		{type}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
		aria-busy={loading || undefined}
		aria-disabled={isDisabled}
		disabled={isDisabled}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		{#if loading}
			<svg
				class={clsx(iconSize[size], 'z-10 animate-spin')}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				role="status"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span class="sr-only">{busyLabel}</span>
		{:else}
			<span
				class={clsx(
					'text-animation font-inter z-10 whitespace-nowrap leading-[1.11]',
					textSize[size]
				)}
			>
				{label}
			</span>
			<span
				class={clsx(
					'icon-animation absolute z-10 flex items-center justify-center',
					iconSize[size]
				)}
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
		{/if}
	</button>

	<!-- ! Variante Danger -->
{:else if variant === 'danger'}
	<button
		on:click={handleClick}
		class={clsx(
			rootBase,
			rootSize[size],
			'bg-red-600 text-white hover:bg-red-700',
			isDisabled && 'pointer-events-none cursor-not-allowed opacity-50 ',
			customClass
		)}
		{type}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
		aria-busy={loading || undefined}
		aria-disabled={isDisabled}
		disabled={isDisabled}
	>
		<span class="background-animation absolute inset-0 z-0 origin-bottom bg-current"></span>
		{#if loading}
			<svg
				class={clsx(iconSize[size], 'z-10 animate-spin')}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				role="status"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span class="sr-only">{busyLabel}</span>
		{:else}
			<span
				class={clsx(
					'text-animation font-inter z-10 whitespace-nowrap leading-[1.11]',
					textSize[size]
				)}
			>
				{label}
			</span>
			<span
				class={clsx(
					'icon-animation absolute z-10 flex items-center justify-center',
					iconSize[size]
				)}
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
		{/if}
	</button>

	<!-- ! Variante Ghost -->
{:else}
	<button
		on:click={handleClick}
		class={clsx(
			rootBase,
			'cta-minimal-shine-btn inline-flex border border-blue-400 bg-white/5 font-semibold text-blue-400 shadow-none outline-none focus:ring-2 focus:ring-blue-300',
			size === 'md'
				? 'h-12 min-w-[140px] px-8 py-3 md:h-14'
				: 'h-9 min-w-[100px]  px-5 py-2 md:h-10',
			isDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
			customClass
		)}
		{type}
		role="link"
		tabindex="0"
		aria-label={ariaLabel}
		aria-busy={loading || undefined}
		aria-disabled={isDisabled}
		disabled={isDisabled}
	>
		{#if loading}
			<svg
				class={clsx(iconSize[size], 'z-10 animate-spin')}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="4"
				role="status"
				aria-hidden="true"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span class="sr-only">{busyLabel}</span>
		{:else}
			<span class="relative z-10 flex items-center gap-2 transition-colors duration-200">
				{label}
				<svg
					class={clsx(
						'transition-transform duration-300 group-hover:translate-x-1',
						iconSize[size]
					)}
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
		{/if}
		<span class="cta-btn-bg pointer-events-none absolute inset-0 z-0"></span>
	</button>
{/if}

<style>
	/**
	* ! --- ANIMACIÓN PARA PRIMARY BUTTON --- */
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

	button[disabled] .background-animation,
	button[disabled] .text-animation,
	button[disabled] .icon-animation {
		animation: none;
	}

	/**
	* ! --- ANIMACIÓN PARA GHOST BUTTON --- */
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
