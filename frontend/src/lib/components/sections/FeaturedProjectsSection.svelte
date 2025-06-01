<!--
* Componente: FeaturedProjectsSection
* Descripción : Sección que lista 3 proyectos destacados y un CTA para ver más.
* Uso        : <FeaturedProjectsSection {projects}/>  – si no se pasa prop, usa datos locales.
* Notas      : Animación de aparición al hacer scroll gracias a IntersectionObserver.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard2 from '$lib/components/ui/ProjectCard2.svelte';
	import Button from '../ui/Button.svelte';
	import Badge from '../ui/Badge.svelte';
	import { projects } from '$lib/data/projects';

	/* ----  Animación en scroll  ---- */
	let visible = false;
	let sectionRef: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
			threshold: 0.15
		});
		sectionRef && observer.observe(sectionRef);
		return () => observer.disconnect();
	});
</script>

<section
	bind:this={sectionRef}
	class="w-full bg-[#f9fafe] px-4 py-20 md:px-8"
	style="
    opacity:{visible ? 1 : 0};
    transform:translateY({visible ? 0 : 46}px) scale({visible ? 1 : 0.96});
    filter:blur({visible ? 0 : 6}px);
    transition:opacity .8s cubic-bezier(.45,0,.2,1),
              transform .8s cubic-bezier(.45,0,.2,1),
              filter   .8s cubic-bezier(.45,0,.2,1);
  "
>
	<!-- Encabezado -->
	<div class="mx-auto mb-12 max-w-6xl text-center">
		<div class="flex items-center justify-center">
			<Badge text="Algunos de los proyectos que están cambiando vidas" />
		</div>
		<h2 class="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
			Descubrí historias reales de impacto social y unite a ellas
		</h2>
	</div>

	<!-- Grid de Proyectos -->
	<div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
		{#each projects.slice(0, 3) as proj (proj.id)}
			<ProjectCard2 project={proj} />
		{/each}
	</div>

	<!-- CTA -->

	<div class="mt-14 flex justify-center">
		<Button label="Descubrí más" href="/projects" />
	</div>
</section>
