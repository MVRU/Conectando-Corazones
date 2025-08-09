<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/ui/cards/ProjectCard.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import Badge from '$lib/components/ui/elements/Badge.svelte';
	import { projects } from '$lib/mocks/mock-projects';

	let visible = false;
	let sectionRef: HTMLElement;

	onMount(() => {
		const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			threshold: 0.18
		});
		sectionRef && io.observe(sectionRef);
		return () => io.disconnect();
	});
</script>

<section
	bind:this={sectionRef}
	class="relative w-full px-4 py-24 md:px-8"
	style="
		opacity:{visible ? 1 : 0};
		transform:translateY({visible ? 0 : 48}px) scale({visible ? 1 : 0.96});
		filter:blur({visible ? 0 : 6}px);
		transition:all .85s cubic-bezier(.45,0,.2,1);
	"
>
	<!-- *Background con degradé -->
	<span
		class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br
		       from-sky-50 via-white to-white"
	></span>

	<svg
		class="pointer-events-none absolute -top-1 h-6 w-full fill-white"
		viewBox="0 0 1440 48"
		preserveAspectRatio="none"
	>
		<path d="M0,48 C240,16 480,16 720,32 C960,48 1200,48 1440,32 L1440,0 L0,0 Z" />
	</svg>

	<!-- *Encabezado -->
	<div class="mx-auto mb-14 max-w-6xl text-center">
		<Badge text="Algunos proyectos que ya inspiran" customClass="flex justify-center" />
		<h2
			class="mx-auto mt-4 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl"
		>
			<span
				class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent"
			>
				Historias reales
			</span>
			<!-- -*- <br> visible solo en <508px, oculto si >=508px -->
			<br class="block min-[508px]:hidden" />
			<span class="inline min-[508px]:inline"> de impacto social </span>
		</h2>
	</div>

	<!-- *Grid de Proyectos -->
	<div class="mx-auto grid max-w-7xl gap-10 max-[1049px]:grid-cols-1 min-[1050px]:grid-cols-3">
		{#each projects.slice(0, 3) as proj (proj.id)}
			<ProjectCard proyecto={proj} />
		{/each}
	</div>

	<!-- *CTA -->
	<div class="mt-16 flex justify-center">
		<Button
			label="Descubrí más proyectos"
			href="/projects"
			size="md"
			customClass="hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition duration-200 shadow-md"
		/>
	</div>
</section>
