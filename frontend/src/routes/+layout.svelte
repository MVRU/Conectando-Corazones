<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import { breadcrumbs } from '$lib/stores/breadcrumbs';
	import ScrollToTop from '$lib/components/ui/ScrollToTop.svelte';

	const showBreadcrumb = $derived(() => $breadcrumbs.length > 2);

	let { children } = $props();
</script>

<Header />

{#if showBreadcrumb()}
	<Breadcrumbs items={$breadcrumbs} />
{/if}

<ScrollToTop />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
