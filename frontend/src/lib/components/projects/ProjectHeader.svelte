<!-- TODOs:
 	- [ ] Corregir atributos cuando se resuelvan las inconsistencias con el DER -->

<script lang="ts">
	export let proyecto;
	export let getColorUrgencia;
	export let getColorEstado;
</script>

{#if proyecto.imagen}
	<div
		class="animate-fade-down relative overflow-hidden rounded-3xl border border-gray-200 shadow-lg"
	>
		<img
			src={proyecto.imagen}
			alt="Imagen del proyecto"
			class="h-64 w-full object-cover sm:h-80 lg:h-[26rem]"
			loading="lazy"
		/>

		<!-- Degradado para contraste -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

		<!-- Contenido superpuesto -->
		<div class="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-10 text-white sm:px-8 lg:px-10">
			<h1
				class="max-w-4xl text-2xl font-extrabold leading-snug drop-shadow-md sm:text-3xl lg:text-4xl"
			>
				{proyecto.titulo}
			</h1>

			<div
				class="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium drop-shadow sm:text-base"
			>
				<!-- Ubicación -->
				<span class="flex items-center gap-1 text-pink-200">
					📍 {proyecto.ciudad}, {proyecto.provincia}
				</span>

				<!-- Badges -->
				{#if proyecto.urgencia}
					<span
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorUrgencia(proyecto.urgencia)} bg-white/80`}
					>
						⚠️ {proyecto.urgencia}
					</span>
				{/if}

				{#if proyecto.estado}
					<span
						class={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm transition ${getColorEstado(proyecto.estado)} bg-white/80`}
					>
						📌 {proyecto.estado}
					</span>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-down {
		from {
			opacity: 0;
			transform: translateY(-16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-down {
		animation: fade-down 0.5s ease-out both;
	}
</style>
