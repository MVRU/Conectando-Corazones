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

	const supports: {
		icon: 'user' | 'support' | 'alert';
		title: string;
		description: string;
		link: string;
		linkText: string;
	}[] = [
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
	];
</script>

<section
	class="relative w-full overflow-x-hidden bg-gradient-to-br from-[#0f1029] to-[#1e223f] px-4 py-24 md:px-8"
>
	<div class="mx-auto flex max-w-7xl flex-col items-center">
		<div class="mb-3">
			<Badge text="Estamos aquí para ayudarte" />
		</div>
		<h2 class="mb-12 text-center text-4xl font-extrabold leading-tight text-white">
			¿Necesitás ayuda para empezar?<br />No dudes en contactarnos.
		</h2>
		<!-- Tarjetas de soporte -->
		<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
			{#each supports as support}
				<SupportCard {...support} />
			{/each}
		</div>
	</div>
</section>
