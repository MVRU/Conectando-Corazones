<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import HowItWorks from '$lib/components/sections/HowItWorks.svelte';

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
<HowItWorks />
