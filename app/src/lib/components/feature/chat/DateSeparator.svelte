<script lang="ts">
	export let date: Date;

	// Formatear la fecha según la proximidad
	function formatDate(date: Date): string {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// Resetear horas para comparación de días
		const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const yesterdayOnly = new Date(
			yesterday.getFullYear(),
			yesterday.getMonth(),
			yesterday.getDate()
		);

		if (dateOnly.getTime() === todayOnly.getTime()) {
			return 'Hoy';
		} else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
			return 'Ayer';
		} else {
			const options: Intl.DateTimeFormatOptions = {
				weekday: 'long',
				day: 'numeric',
				month: 'long'
			};
			const formatted = date.toLocaleDateString('es-AR', options);
			return formatted.charAt(0).toUpperCase() + formatted.slice(1);
		}
	}
</script>

<div class="my-6 flex items-center justify-center">
	<div class="relative">
		<div class="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 shadow-sm">
			<span class="text-xs font-semibold text-blue-800">{formatDate(date)}</span>
		</div>
		<div
			class="absolute top-1/2 left-full ml-3 h-px w-12 bg-gradient-to-r from-gray-300 to-transparent"
		></div>
		<div
			class="absolute top-1/2 right-full mr-3 h-px w-12 bg-gradient-to-l from-gray-300 to-transparent"
		></div>
	</div>
</div>
