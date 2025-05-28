<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
	import { breadcrumbs } from '$lib/stores/breadcrumbs';

	let { children } = $props();
</script>

<Header />

<Breadcrumbs items={$breadcrumbs} />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
