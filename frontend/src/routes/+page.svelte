<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import Bagde from '$lib/components/ui/Badge.svelte';
	import Ticker from '$lib/components/visual/Ticker.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];

	// Establecer breadcrumbs al montar la página
	onMount(() => {
		setBreadcrumbs([
			{ label: 'Inicio' } // Sin href porque es la página actual
		]);
	});
</script>

<HeroSection />
