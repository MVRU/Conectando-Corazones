<!--
* Componente: SupportSection
    -*- Descripción: sección de ayuda y contacto, con tarjetas de soporte/contacto.
    -*- Props: por ahora, contenido estático.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Badge from '$lib/components/ui/elements/Badge.svelte';
	import SupportCard from '$lib/components/ui/cards/SupportCard.svelte';

	// Los agregué directamente acá porque son estáticos y no se usan en otros lugares -> no vale la pena crear modelo y data separada.
	const supports = [
		{
			icon: 'user',
			title: 'Sugerencias',
			description: 'Tu opinión es muy valiosa. Si tenés ideas o propuestas, ¡queremos escucharlas!',
			link: '/contact?sugerencia',
			linkText: 'Enviar sugerencias'
		},
		{
			icon: 'support',
			title: 'Soporte General',
			description:
				'Para preguntas sobre la plataforma, problemas técnicos o dudas sobre nuestros servicios.',
			link: '/contact?soporte',
			linkText: 'Contactar a soporte'
		},
		{
			icon: 'alert',
			title: 'Denuncias y Reportes',
			description: 'Nos tomamos muy en serio la seguridad y transparencia de nuestra comunidad.',
			link: '/contact?denuncia',
			linkText: 'Reportar incidencia'
		}
	] as const;

	let visible = false;
	let sectionRef: HTMLElement;

	onMount(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				visible = e.isIntersecting;
			},
			{ threshold: 0.15 }
		);
		if (sectionRef) obs.observe(sectionRef);
		return () => obs.disconnect();
	});
</script>

<section
	id="support"
	bind:this={sectionRef}
	class="relative w-full overflow-x-hidden bg-gradient-to-br from-[#0f1029] to-[#1e223f] px-2 py-60 sm:px-4 md:px-8"
>
	<div class="mx-auto flex max-w-7xl flex-col items-center">
		<div
			class="mb-3 transition-all duration-1000"
			class:fade-down={visible}
			class:fade-initial-down={!visible}
		>
			<Badge text="Estamos aquí para ayudarte" />
		</div>
		<h2
			class="mb-10 text-center text-2xl font-extrabold leading-tight text-white drop-shadow transition-all duration-1000 sm:text-3xl md:text-4xl"
			class:fade-down={visible}
			class:fade-initial-down={!visible}
			style="transition-delay:80ms"
		>
			¿Necesitás ayuda para empezar?<br />
			<span class="text-blue-200">No dudes en contactarnos.</span>
		</h2>
		<!-- *Tarjetas de soporte -->
		<div class="grid w-full grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
			{#each supports as support, i}
				<div
					class="transition-all duration-1000"
					class:fade-up={visible}
					class:fade-initial-up={!visible}
					style="transition-delay:{200 + i * 120}ms"
				>
					<SupportCard {...support} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.fade-initial-down {
		opacity: 0;
		transform: translateY(-56px) scale(0.97);
		filter: blur(6px);
	}
	.fade-down {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
		transition:
			opacity 1.05s cubic-bezier(0.4, 0, 0.22, 1),
			transform 1.05s cubic-bezier(0.4, 0, 0.22, 1),
			filter 0.9s cubic-bezier(0.4, 0, 0.22, 1);
	}

	.fade-initial-up {
		opacity: 0;
		transform: translateY(52px) scale(0.97);
		filter: blur(6px);
	}
	.fade-up {
		opacity: 1;
		transform: translateY(0) scale(1);
		filter: blur(0);
		transition:
			opacity 1.05s cubic-bezier(0.39, 0, 0.19, 1),
			transform 1.05s cubic-bezier(0.39, 0, 0.19, 1),
			filter 0.95s cubic-bezier(0.39, 0, 0.19, 1);
	}
</style>
