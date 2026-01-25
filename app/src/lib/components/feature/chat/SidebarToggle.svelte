<script lang="ts">
	import { chatStore } from '$lib/stores/chatStore';

	$: collapsed = $chatStore.sidebarCollapsed;
</script>

<button
	on:click={() => chatStore.toggleSidebar()}
	class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
	aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
	title={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		class="h-5 w-5 transition-transform duration-300 {collapsed ? 'rotate-180' : ''}"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
		/>
	</svg>
</button>
