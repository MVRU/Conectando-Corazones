<script lang="ts">
        import '../app.css';
import Header from '$lib/components/layout/Header.svelte';
import Footer from '$lib/components/layout/Footer.svelte';
import Breadcrumbs from '$lib/components/ui/Breadcrumbs.svelte';
import MotionNotice from '$lib/components/ui/MotionNotice.svelte';
        import { breadcrumbs, clearBreadcrumbs } from '$lib/stores/breadcrumbs';
        import ScrollToTop from '$lib/components/ui/ScrollToTop.svelte';
        import { beforeNavigate } from '$app/navigation';
        import { onMount } from 'svelte';

// ! Mantener el layout simple: breadcrumbs se muestran solo cuando hay nivel suficiente

        let { children } = $props();

        // *Limpia migas de pan al cambiar de ruta para evitar estados huérfanos
        onMount(() => {
                const unsubscribe = beforeNavigate(() => clearBreadcrumbs());
                return () => unsubscribe();
        });
</script>

<Header />
<MotionNotice />

<Breadcrumbs items={$breadcrumbs} />

<ScrollToTop />

<main class="min-h-screen">
	{@render children()}
</main>

<Footer />
