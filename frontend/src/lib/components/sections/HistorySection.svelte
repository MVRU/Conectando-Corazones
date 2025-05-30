<!--
* Componente: HistorySection
	-*- Descripción: sección narrativa que presenta la historia e inspiración del proyecto.
	-*- Funcionalidad: muestra un título llamativo con fondo en degradado oscuro, badge y una imagen significativa.

* Props:
	-*- No recibe props por ahora (contenido estático).

TODO:
	- [ ] Añadir animaciones de entrada suave.
-->

<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Image from '$lib/components/ui/Image.svelte';
</script>

<section class="w-full bg-white px-4 py-20 md:px-8">
	<div
		class="rounded-4xl mx-auto max-w-5xl bg-gradient-to-b from-[rgb(var(--base-color))] to-[#27273e] px-6 pt-12 text-white sm:px-10 sm:pt-16"
	>
		<div class="text-center">
			<div class="flex justify-center">
				<Badge text="De un sueño a una realidad: nuestra historia" />
			</div>
			<h2 class="mx-auto mt-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
				¿Y si pudiéramos conectar a quienes necesitan ayuda con quienes desean brindarla?
			</h2>
		</div>

		<!-- Imagen destacada -->
		<div class="rounded-4xl overflow-hidden">
			<Image src="/img/historia-1.jpg" alt="Monje ofreciendo ayuda a niños" variant="card" />
		</div>
	</div>
</section>
