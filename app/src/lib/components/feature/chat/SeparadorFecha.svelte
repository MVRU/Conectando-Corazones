<script lang="ts">
	export let fecha: Date;

	// Formatear la fecha según la proximidad
	function formatearFecha(fecha: Date): string {
		const hoy = new Date();
		const ayer = new Date(hoy);
		ayer.setDate(ayer.getDate() - 1);

		// Resetear horas para comparación de días
		const soloFecha = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
		const soloHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
		const soloAyer = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());

		if (soloFecha.getTime() === soloHoy.getTime()) {
			return 'Hoy';
		} else if (soloFecha.getTime() === soloAyer.getTime()) {
			return 'Ayer';
		} else {
			const opciones: Intl.DateTimeFormatOptions = {
				weekday: 'long',
				day: 'numeric',
				month: 'long'
			};
			const formateada = fecha.toLocaleDateString('es-AR', opciones);
			return formateada.charAt(0).toUpperCase() + formateada.slice(1);
		}
	}
</script>

<div class="my-6 flex items-center justify-center">
	<div class="relative">
		<div class="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 shadow-sm">
			<span class="text-xs font-semibold text-blue-800">{formatearFecha(fecha)}</span>
		</div>
		<div
			class="absolute top-1/2 left-full ml-3 h-px w-12 bg-gradient-to-r from-gray-300 to-transparent"
		></div>
		<div
			class="absolute top-1/2 right-full mr-3 h-px w-12 bg-gradient-to-l from-gray-300 to-transparent"
		></div>
	</div>
</div>
