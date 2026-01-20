<script lang="ts">
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import ComoFuncionaSection from '$lib/components/home/ComoFuncionaSection.svelte';
	import HistoriaSection from '$lib/components/home/HistoriaSection.svelte';
	import CTASection from '$lib/components/home/CTASection.svelte';
	import TestimoniosSection from '$lib/components/home/TestimoniosSection.svelte';
	import FaqSection from '$lib/components/home/FaqSection.svelte';
	import SoporteSection from '$lib/components/home/SoporteSection.svelte';
	import ProyectosDestacadosSection from '$lib/components/home/ProyectosDestacadosSection.svelte';
	import { clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { onMount } from 'svelte';

	onMount(() => {
		clearBreadcrumbs(); // Limpia los breadcrumbs
	});
</script>

<HeroSection />
<ComoFuncionaSection />
<HistoriaSection />
<CTASection />
<TestimoniosSection />
<FaqSection />
<ProyectosDestacadosSection />
<SoporteSection />
