<script lang="ts">
	import { Info, CircleCheck, TriangleAlert, CircleAlert } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let variant: 'info' | 'success' | 'warning' | 'error' = 'info';
	export let title: string = '';
	export let message: string = '';

	const styles = {
		info: {
			container: 'bg-blue-50 border-blue-200',
			icon: 'text-blue-600',
			title: 'text-blue-800',
			text: 'text-blue-700'
		},
		success: {
			container: 'bg-emerald-50 border-emerald-200',
			icon: 'text-emerald-600',
			title: 'text-emerald-800',
			text: 'text-emerald-700'
		},
		warning: {
			container: 'bg-amber-50 border-amber-200',
			icon: 'text-amber-600',
			title: 'text-amber-800',
			text: 'text-amber-700'
		},
		error: {
			container: 'bg-red-50 border-red-200',
			icon: 'text-red-600',
			title: 'text-red-800',
			text: 'text-red-700'
		}
	};

	const icons = {
		info: Info,
		success: CircleCheck,
		warning: TriangleAlert,
		error: CircleAlert
	};
</script>

<div
	class="rounded-lg border p-4 shadow-sm transition-all duration-300 {styles[variant].container}"
	role="alert"
	transition:fade={{ duration: 200 }}
>
	<div class="flex items-start gap-4">
		<div class="mt-0.5 flex-shrink-0">
			<svelte:component
				this={icons[variant]}
				class="h-5 w-5 {styles[variant].icon}"
				strokeWidth={2}
			/>
		</div>
		<div class="flex-1">
			{#if title}
				<h3 class="mb-1 text-base font-semibold {styles[variant].title}">
					{title}
				</h3>
			{/if}
			{#if message}
				<div class="text-sm font-medium {styles[variant].text}">
					{message}
				</div>
			{/if}
			<div class="text-sm {styles[variant].text}">
				<slot />
			</div>
		</div>
	</div>
</div>

