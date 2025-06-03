<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import HowItWorksSection from '$lib/components/sections/HowItWorksSection.svelte';
	import HistorySection from '$lib/components/sections/HistorySection.svelte';
	import CallToActionSection from '$lib/components/sections/CallToActionSection.svelte';
	import TestimonialsSection from '$lib/components/sections/TestimonialsSection.svelte';
	import FaqSection from '$lib/components/sections/FaqSection.svelte';
	import SupportSection from '$lib/components/sections/SupportSection.svelte';
	import FeaturedProjectsSection from '$lib/components/sections/FeaturedProjectsSection.svelte';

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
<HowItWorksSection />
<HistorySection />
<CallToActionSection />
<TestimonialsSection />
<FaqSection />
<FeaturedProjectsSection />
<SupportSection />
