<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import { breadcrumbs } from '$lib/stores/breadcrumbs';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<Header />

{#if $page.url.pathname !== '/'}
	<Breadcrumbs items={$breadcrumbs} />
{/if}

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
