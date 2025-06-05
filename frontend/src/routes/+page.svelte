<script lang="ts">
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import HowItWorksSection from '$lib/components/sections/HowItWorksSection.svelte';
	import HistorySection from '$lib/components/sections/HistorySection.svelte';
	import CallToActionSection from '$lib/components/sections/CallToActionSection.svelte';
	import TestimonialsSection from '$lib/components/sections/TestimonialsSection.svelte';
	import FaqSection from '$lib/components/sections/FaqSection.svelte';
	import SupportSection from '$lib/components/sections/SupportSection.svelte';
	import FeaturedProjectsSection from '$lib/components/sections/FeaturedProjectsSection.svelte';
	import { clearBreadcrumbs } from '$lib/stores/breadcrumbs';
	import { onMount } from 'svelte';

	onMount(() => {
		clearBreadcrumbs(); // Limpia los breadcrumbs al cargar la home
	});
</script>

<HeroSection />
<HowItWorksSection />
<HistorySection />
<CallToActionSection />
<TestimonialsSection />
<FaqSection />
<FeaturedProjectsSection />
<SupportSection />
