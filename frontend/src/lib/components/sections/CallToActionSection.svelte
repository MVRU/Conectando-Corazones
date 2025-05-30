<!--
* Componente: CallToActionSection
	-*- Descripción: sección breve de llamado a la acción con imagen acompañante.

* Props:
	-*- No recibe props por ahora; contenido estático.
-->

<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Image from '$lib/components/ui/Image.svelte';
</script>

<section class="w-full bg-gradient-to-br from-[#0f1029] to-[#1e2052] px-4 py-12 md:px-8">
	<div
		class="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-12 lg:flex-row"
	>
		<!-- Lado izquierdo: texto -->
		<div class="flex-1 space-y-4 text-center text-white lg:text-left">
			<Badge text="Beneficios que van más allá de la conexión" />
			<h2 class="text-3xl font-extrabold leading-tight sm:text-4xl">
				Descubrí lo que ganás al<br />ser parte de esta red solidaria.
			</h2>
			<a
				href="/registro"
				class="inline-block border-b border-blue-500 font-semibold transition-colors hover:text-blue-300"
			>
				Registrate y empezá a generar impacto
			</a>
		</div>

		<!-- Lado derecho: imagen destacada -->
		<div class="flex flex-1 items-end justify-center">
			<div class="h-[460px] w-[320px] overflow-hidden rounded-[2rem]">
				<Image
					src="/img/cta-1.jpg"
					alt="Persona sonriente representando impacto positivo"
					variant="card"
				/>
			</div>
		</div>
	</div>
</section>
