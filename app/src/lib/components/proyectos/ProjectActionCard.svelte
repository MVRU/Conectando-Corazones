<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { CheckCircle, Clock } from '@steeze-ui/heroicons';
	import { clsx } from 'clsx';

	let {
		title,
		description,
		buttonLabel,
		onClick,
		variant = 'primary'
	} = $props<{
		title: string;
		description: string;
		buttonLabel: string;
		onClick: () => void;
		variant?: 'primary' | 'secondary';
	}>();

	const isCierre = $derived(buttonLabel.toLowerCase().includes('cierre'));
</script>

<div
	class={clsx(
		'group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5',
		variant === 'primary'
			? 'border-sky-100 bg-gradient-to-br from-sky-50 to-white shadow-sm hover:border-sky-200 hover:shadow-md'
			: 'border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm hover:border-amber-200 hover:shadow-md'
	)}
	role="region"
	aria-label={title}
>
	<!-- Decorative background icon -->
	<div
		class="pointer-events-none absolute -right-4 -top-4 opacity-[0.03] transition-transform duration-500 group-hover:scale-110"
	>
		<Icon src={isCierre ? CheckCircle : Clock} class="h-24 w-24" />
	</div>

	<div class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div class="flex-1">
			<div class="flex items-center gap-2">
				<div
					class={clsx(
						'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
						variant === 'primary' ? 'bg-sky-100 text-sky-600' : 'bg-amber-100 text-amber-600'
					)}
				>
					<Icon src={isCierre ? CheckCircle : Clock} class="h-4 w-4" />
				</div>
				<h4
					class={clsx(
						'text-sm font-bold sm:text-base',
						variant === 'primary' ? 'text-sky-900' : 'text-amber-900'
					)}
				>
					{title}
				</h4>
			</div>
			<p
				class={clsx(
					'mt-2 text-xs leading-relaxed sm:text-sm',
					variant === 'primary' ? 'text-sky-700/80' : 'text-amber-700/80'
				)}
			>
				<span class="hidden sm:inline">{description}</span>
				<span class="sm:hidden">
					{description.length > 80 ? description.substring(0, 80) + '...' : description}
				</span>
			</p>
		</div>

		<div class="shrink-0">
			<Button
				label={buttonLabel}
				variant={variant === 'primary' ? 'primary' : 'secondary'}
				size="sm"
				customClass="w-full sm:w-auto shadow-sm"
				onclick={onClick}
			/>
		</div>
	</div>
</div>
