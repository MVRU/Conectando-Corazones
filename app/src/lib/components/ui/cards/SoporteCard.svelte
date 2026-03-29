<script lang="ts">
	import Button from '$lib/components/ui/elementos/Button.svelte';
	import { User, Headphones, ShieldAlert } from 'lucide-svelte';

	export let icon: 'user' | 'support' | 'alert' = 'user';
	export let title = '';
	export let description = '';
	export let link = '';
	export let linkText = '';
</script>

<div
	class="support-card group relative flex flex-col items-center rounded-2xl border border-blue-400/10 bg-gradient-to-b from-white/10 to-[#172040] p-6 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_40px_0_#7dd3fc33] hover:ring-2 hover:ring-blue-300/20 sm:p-8"
>
	<div
		class="icon-wrapper mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-400/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-400/20 sm:h-16 sm:w-16"
	>
		{#if icon === 'user'}
			<User class="h-7 w-7 text-gray-300 transition-all group-hover:text-gray-200 sm:h-8 sm:w-8" />
		{:else if icon === 'support'}
			<Headphones
				class="h-7 w-7 text-blue-400 transition-all group-hover:text-blue-300 sm:h-8 sm:w-8"
			/>
		{:else if icon === 'alert'}
			<ShieldAlert
				class="h-7 w-7 text-red-400 transition-all group-hover:text-red-300 sm:h-8 sm:w-8"
			/>
		{/if}
	</div>
	<h3 class="mb-1 text-base font-bold text-white sm:text-lg">{title}</h3>
	<p class="mb-4 text-xs text-blue-100 sm:text-sm">{description}</p>
	<div class="mt-5 flex w-full justify-center">
		<Button
			href={link}
			label={linkText}
			variant="ghost"
			customClass="text-xs sm:text-sm"
			size="sm"
		/>
	</div>
</div>
