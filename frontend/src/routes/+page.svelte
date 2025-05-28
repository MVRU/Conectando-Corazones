<script lang="ts">
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import { setBreadcrumbs } from '$lib/stores/breadcrumbs';

	const logos = [
		'/instituciones/rotary.png',
		'/instituciones/unicef.png',
		'/instituciones/cruz-roja.png'
	];

	// ! No colocaría un breadcrumb en inicio, ya que es la página principal

	// stablecer breadcrumbs al montar la página
	// onMount(() => {
	// 	setBreadcrumbs([
	// 		{ label: 'Inicio' } // Sin href porque es la página actual
	// 	]);
	// });
</script>

<HeroSection />
