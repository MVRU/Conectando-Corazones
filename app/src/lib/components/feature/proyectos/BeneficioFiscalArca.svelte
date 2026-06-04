<script lang="ts">
	import { ExternalLink, Landmark } from 'lucide-svelte';

	const urlGuiaAfip =
		'https://serviciosweb.afip.gob.ar/genericos/guiasPasoPaso/VerGuia.aspx?id=278';
</script>

<section
	class="rounded-xl border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg sm:p-6"
	aria-labelledby="titulo-beneficio-fiscal"
>
	<div class="mb-4 flex items-center gap-3">
		<div class="shrink-0 rounded-lg bg-gray-100 p-2">
			<Landmark class="h-5 w-5 text-gray-600" />
		</div>
		<h2 id="titulo-beneficio-fiscal" class="text-xl font-semibold text-gray-900 sm:text-2xl">
			Beneficio impositivo
		</h2>
	</div>

	<div class="space-y-3 text-sm leading-relaxed text-gray-600">
		<p>
			Tu organización realizó una donación a través de este proyecto y puede acceder a beneficios
			fiscales.
		</p>
		<p>
			En Argentina, las donaciones a entidades habilitadas pueden deducirse del impuesto a las
			ganancias según la normativa vigente (RG 2681).
		</p>
		<p>
			Te recomendamos consultar la guía oficial para conocer los requisitos y el procedimiento de
			deducción.
		</p>
	</div>

	<div class="mt-5">
		<a
			href={urlGuiaAfip}
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-hidden"
		>
			Ver cómo solicitar la deducción
			<ExternalLink class="h-4 w-4" />
		</a>
	</div>
</section>
