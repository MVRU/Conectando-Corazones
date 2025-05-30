<!--
* Componente: SupportSection
    -*- Descripción: sección de ayuda y contacto, con tarjetas de soporte/contacto.
    -*- Props: por ahora, contenido estático.

TODO:
	- [ ] Implementar enlaces dinámicos para sugerencias, soporte y denuncias.
	- [ ] Modificar iconos según el tipo de soporte y mejorar diseño.
	- [ ] Agregar animaciones.
	- [ ] Crear model y data para código más limpio.
-->

<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import SupportCard from '$lib/components/ui/SupportCard.svelte';

	const supports = [
		{
			icon: 'user',
			title: 'Sugerencias',
			description:
				'Tu opinión es muy valiosa. Si tenés ideas, sugerencias o propuestas, ¡queremos escucharlas!',
			link: '/contacto?sugerencia',
			linkText: 'Enviar sugerencias'
		},
		{
			icon: 'support',
			title: 'Soporte General',
			description:
				'Para preguntas sobre la plataforma, problemas técnicos o dudas sobre nuestros servicios.',
			link: '/contacto?soporte',
			linkText: 'Contactar a soporte'
		},
		{
			icon: 'alert',
			title: 'Denuncias y Reportes',
			description: 'Nos tomamos muy en serio la seguridad y transparencia de nuestra comunidad.',
			link: '/contacto?denuncia',
			linkText: 'Reportar una incidencia'
		}
	] as const;
</script>

<section
	class="relative w-full overflow-x-hidden bg-gradient-to-br from-[#0f1029] to-[#1e223f] px-4 py-24 md:px-8"
>
	<div class="mx-auto flex max-w-7xl flex-col items-center">
		<div class="animate-fadeInDown mb-3">
			<Badge text="Estamos aquí para ayudarte" />
		</div>
		<h2
			class="animate-fadeInDown mb-12 text-center text-4xl font-extrabold leading-tight text-white drop-shadow"
		>
			¿Necesitás ayuda para empezar?<br />
			<span class="text-blue-200">No dudes en contactarnos.</span>
		</h2>
		<!-- Tarjetas de soporte -->
		<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
			{#each supports as support, i}
				<div class="animate-fadeInUp" style="animation-delay:{i * 120}ms;">
					<SupportCard {...support} />
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes fadeInDown {
		0% {
			opacity: 0;
			transform: translateY(-40px) scale(0.97);
			filter: blur(4px);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
			filter: blur(0);
		}
	}
	@keyframes fadeInUp {
		0% {
			opacity: 0;
			transform: translateY(40px) scale(0.96);
			filter: blur(6px);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
			filter: blur(0);
		}
	}
	.animate-fadeInDown {
		animation: fadeInDown 1s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
	.animate-fadeInUp {
		animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
</style>
