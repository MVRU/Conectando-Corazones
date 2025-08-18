<script lang="ts">
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import HowItWorksSection from '$lib/components/home/HowItWorksSection.svelte';
	import HistorySection from '$lib/components/home/HistorySection.svelte';
	import CallToActionSection from '$lib/components/home/CallToActionSection.svelte';
	import TestimoniosSection from '$lib/components/home/TestimoniosSection.svelte';
	import FaqSection from '$lib/components/home/FaqSection.svelte';
	import SoporteSection from '$lib/components/home/SoporteSection.svelte';
	import FeaturedProjectsSection from '$lib/components/home/FeaturedProjectsSection.svelte';
	import { clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { onMount } from 'svelte';

	onMount(() => {
		clearBreadcrumbs(); // Limpia los breadcrumbs
	});
</script>

<HeroSection />
<HowItWorksSection />
<HistorySection />
<CallToActionSection />
<TestimoniosSection />
<FaqSection />
<FeaturedProjectsSection />
<SoporteSection />
