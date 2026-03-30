<script lang="ts">
	import HeroSection from '$lib/components/feature/home/HeroSection.svelte';
	import ComoFuncionaSection from '$lib/components/feature/home/ComoFuncionaSection.svelte';
	import HistoriaSection from '$lib/components/feature/home/HistoriaSection.svelte';
	import CTASection from '$lib/components/feature/home/CTASection.svelte';
	import TestimoniosSection from '$lib/components/feature/home/TestimoniosSection.svelte';
	import FaqSection from '$lib/components/feature/home/FaqSection.svelte';
	import SoporteSection from '$lib/components/feature/home/SoporteSection.svelte';
	import ProyectosDestacadosSection from '$lib/components/feature/home/ProyectosDestacadosSection.svelte';
	import { clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		clearBreadcrumbs();
	});
</script>

<HeroSection />
<ComoFuncionaSection />
<HistoriaSection />
<CTASection />
<TestimoniosSection />
<FaqSection />
<ProyectosDestacadosSection proyectos={data.proyectosDestacados} />
<SoporteSection />
