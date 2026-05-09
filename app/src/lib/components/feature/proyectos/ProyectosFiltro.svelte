<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	let {
		mostrar = $bindable(false),
		participacion = $bindable([]),
		categoria = $bindable([]),
		categoriasDisponibles = ['Todas'],
		tipoUbicacion = $bindable('Todas'),
		provincia = $bindable('Todas'),
		localidad = $bindable('Todas'),
		fechaDesde = $bindable(''),
		fechaHasta = $bindable(''),
		prefijoId = 'filter',
		mostrarEstado = false,
		estado = $bindable([]),
		estadosDisponibles = [],
		provinciasDisponibles = [],
		localidadesDisponibles = [],
		tiposParticipacion = [],
		criterioOrden = $bindable('recientes'),
		onreset,
		onubicacionchange,
		ontoggle
	} = $props<{
		mostrar?: boolean;
		participacion?: string[];
		categoria?: string[];
		categoriasDisponibles?: string[];
		tipoUbicacion?: 'Todas' | 'Presencial' | 'Virtual';
		provincia?: string;
		localidad?: string;
		fechaDesde?: string;
		fechaHasta?: string;
		prefijoId?: string;
		mostrarEstado?: boolean;
		estado?: string[];
		estadosDisponibles?: { value: string; label: string }[];
		provinciasDisponibles?: string[];
		localidadesDisponibles?: string[];
		tiposParticipacion?: string[];
		criterioOrden?: 'recientes' | 'antiguos' | 'mayor_progreso' | 'menor_progreso';
		onreset?: () => void;
		onubicacionchange?: () => void;
		ontoggle?: () => void;
	}>();

	function alternarFiltros() {
		ontoggle?.();
	}

	function restablecerFiltrosLocal() {
		onreset?.();
	}

	function manejarCambioUbicacion() {
		onubicacionchange?.();
	}

	let filtrosActivos = $derived(
		[
			participacion.length > 0 && !participacion.includes('Todos'),
			categoria.length > 0 && !categoria.includes('Todas'),
			tipoUbicacion !== 'Todas',
			provincia !== 'Todas',
			localidad !== 'Todas',
			fechaDesde !== '',
			fechaHasta !== '',
			mostrarEstado && estado.length > 0 && !estado.includes('Todos')
		].filter(Boolean).length
	);

	let estadoDropdownOpen = $state(false);
	let categoriaDropdownOpen = $state(false);
	let participacionDropdownOpen = $state(false);
	let ubicacionDropdownOpen = $state(false);
	let provinciaDropdownOpen = $state(false);
	let localidadDropdownOpen = $state(false);
	let fechaDropdownOpen = $state(false);
</script>

<div class="animate-fade-in-up mb-4 flex flex-wrap justify-center gap-3">
	<!-- Dropdown de Ordenamiento -->
	<div class="relative">
		<select
			bind:value={criterioOrden}
			class="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
			aria-label="Ordenar proyectos"
		>
			<option value="recientes">Más recientes</option>
			<option value="antiguos">Más antiguos</option>
			<option value="mayor_progreso">Mayor progreso</option>
			<option value="menor_progreso">Menor progreso</option>
		</select>
	</div>

	<button
		onclick={alternarFiltros}
		class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-blue-500 hover:bg-gray-50"
	>
		{mostrar ? 'Ocultar filtros' : 'Mostrar filtros'}
		{#if filtrosActivos > 0}
			<span
				class="bg-primary hover:bg-primary-dark ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm"
			>
				{filtrosActivos}
			</span>
		{/if}
		{#if mostrar}
			<ChevronUp size={16} />
		{:else}
			<ChevronDown size={16} />
		{/if}
	</button>
</div>

{#if mostrar}
	<div
		class="animate-fade-in-up mb-6"
		in:fly={{ y: -10, duration: 200 }}
		out:fade={{ duration: 150 }}
	>
		<div class="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-100/50">
			<div class="mb-5 flex items-center justify-between">
				<h4 class="text-base font-semibold text-gray-800">Filtrar proyectos</h4>
				<button
					onclick={restablecerFiltrosLocal}
					class="text-xs font-medium text-red-500 hover:text-red-600 hover:underline disabled:opacity-50"
				>
					Limpiar todo
				</button>
			</div>

			<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
				<!-- Filtro por Tipo de Participación -->
				<div class="flex flex-col gap-1.5">
					<span
						id="{prefijoId}-label-participacion"
						class="text-xs font-medium tracking-wide text-gray-500 uppercase"
					>
						Tipo de participación
					</span>
					<div class="relative">
						<button
							type="button"
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
							onclick={() => (participacionDropdownOpen = !participacionDropdownOpen)}
							aria-haspopup="listbox"
							aria-expanded={participacionDropdownOpen}
							aria-labelledby="{prefijoId}-label-participacion"
						>
							<span class="block max-w-[140px] truncate">
								{#if participacion.length === 0 || participacion.includes('Todos')}
									Todos
								{:else if participacion.length <= 2}
									{participacion.join(', ')}
								{:else}
									{participacion.length} seleccionados
								{/if}
							</span>
							<ChevronDown
								class="text-gray-400 transition-transform duration-200 {participacionDropdownOpen
									? 'rotate-180'
									: ''}"
								size={16}
							/>
						</button>

						{#if participacionDropdownOpen}
							<div
								class="fixed inset-0 z-10 cursor-default"
								onclick={() => (participacionDropdownOpen = false)}
								role="presentation"
							></div>
							<div
								class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
								in:fly={{ y: -5, duration: 150 }}
							>
								<!-- Opción Seleccionar Todos -->
								<label
									class="mb-1 flex cursor-pointer items-center gap-3 rounded-md border-b border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
								>
									<input
										type="checkbox"
										class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										checked={participacion.length === 0 || participacion.includes('Todos')}
										onchange={() => {
											participacion = [];
										}}
									/>
									<span class="font-medium text-blue-600">Seleccionar todos</span>
								</label>

								<div class="space-y-0.5">
									{#each tiposParticipacion.filter((t: string) => t !== 'Todos') as tipo (tipo)}
										<label
											class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											<input
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												checked={participacion.includes(tipo)}
												onchange={() => {
													if (participacion.includes(tipo)) {
														participacion = participacion.filter((t: string) => t !== tipo);
													} else {
														const clean = participacion.filter((t: string) => t !== 'Todos');
														participacion = [...clean, tipo];
													}
												}}
											/>
											<span>{tipo}</span>
										</label>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Filtro por Categoría (Checkbox Dropdown) -->
				<div class="flex flex-col gap-1.5">
					<span
						id="{prefijoId}-label-categoria"
						class="text-xs font-medium tracking-wide text-gray-500 uppercase"
					>
						Categoría
					</span>
					<div class="relative">
						<!-- Botón Trigger -->
						<button
							type="button"
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
							onclick={() => (categoriaDropdownOpen = !categoriaDropdownOpen)}
							aria-haspopup="listbox"
							aria-expanded={categoriaDropdownOpen}
							aria-labelledby="{prefijoId}-label-categoria"
						>
							<span class="block max-w-[140px] truncate">
								{#if categoria.length === 0 || (categoria.length === 1 && categoria[0] === 'Todas')}
									Todas
								{:else if categoria.length <= 2}
									{categoria.join(', ')}
								{:else}
									{categoria.length} seleccionadas
								{/if}
							</span>
							<ChevronDown
								class="text-gray-400 transition-transform duration-200 {categoriaDropdownOpen
									? 'rotate-180'
									: ''}"
								size={16}
							/>
						</button>

						<!-- Dropdown Body -->
						{#if categoriaDropdownOpen}
							<!-- Backdrop transparente -->
							<div
								class="fixed inset-0 z-10 cursor-default"
								onclick={() => (categoriaDropdownOpen = false)}
								role="presentation"
							></div>

							<div
								class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
								in:fly={{ y: -5, duration: 150 }}
							>
								<!-- Opción Seleccionar Todos -->
								<label
									class="mb-1 flex cursor-pointer items-center gap-3 rounded-md border-b border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
								>
									<input
										type="checkbox"
										class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
										checked={categoria.length === 0 ||
											(categoria.length === 1 && categoria[0] === 'Todas')}
										onchange={() => {
											categoria = [];
										}}
									/>
									<span class="font-medium text-blue-600">Seleccionar todas</span>
								</label>

								<!-- Lista de Categorías -->
								<div class="space-y-0.5">
									{#each categoriasDisponibles.filter((c: string) => c !== 'Todas') as cat (cat)}
										<label
											class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
										>
											<input
												type="checkbox"
												class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
												checked={categoria.includes(cat)}
												onchange={() => {
													if (categoria.includes(cat)) {
														categoria = categoria.filter((c: string) => c !== cat);
													} else {
														const clean = categoria.filter((c: string) => c !== 'Todas');
														categoria = [...clean, cat];
													}
												}}
											/>
											<span>{cat}</span>
										</label>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Filtro por Tipo de Ubicación -->
				<div class="flex flex-col gap-1.5">
					<span
						id="{prefijoId}-label-ubicacion"
						class="text-xs font-medium tracking-wide text-gray-500 uppercase"
					>
						Ubicación
					</span>
					<div class="relative">
						<button
							type="button"
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
							onclick={() => (ubicacionDropdownOpen = !ubicacionDropdownOpen)}
						>
							<span class="block truncate">{tipoUbicacion}</span>
							<ChevronDown
								class="text-gray-400 transition-transform duration-200 {ubicacionDropdownOpen
									? 'rotate-180'
									: ''}"
								size={16}
							/>
						</button>

						{#if ubicacionDropdownOpen}
							<div
								class="fixed inset-0 z-10 cursor-default"
								onclick={() => (ubicacionDropdownOpen = false)}
								role="presentation"
							></div>
							<div
								class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
								in:fly={{ y: -5, duration: 150 }}
							>
								<div class="space-y-0.5">
									{#each ['Todas', 'Presencial', 'Virtual'] as tipo (tipo)}
										<button
											type="button"
											class="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50 {tipoUbicacion ===
											tipo
												? 'bg-blue-50 font-medium text-blue-700'
												: 'text-gray-700'}"
											onclick={() => {
												tipoUbicacion = tipo as 'Todas' | 'Presencial' | 'Virtual';
												manejarCambioUbicacion();
												ubicacionDropdownOpen = false;
											}}
										>
											{tipo}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Filtros dinámicos de ubicación (Provincia/Localidad) -->
				{#if tipoUbicacion === 'Presencial'}
					<!-- Provincia -->
					<div class="flex flex-col gap-1.5" in:fade={{ duration: 150 }}>
						<span
							id="{prefijoId}-label-provincia"
							class="text-xs font-medium tracking-wide text-gray-500 uppercase"
						>
							Provincia
						</span>
						<div class="relative">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
								onclick={() => (provinciaDropdownOpen = !provinciaDropdownOpen)}
							>
								<span class="block truncate">{provincia}</span>
								<ChevronDown
									class="text-gray-400 transition-transform duration-200 {provinciaDropdownOpen
										? 'rotate-180'
										: ''}"
									size={16}
								/>
							</button>

							{#if provinciaDropdownOpen}
								<div
									class="fixed inset-0 z-10 cursor-default"
									onclick={() => (provinciaDropdownOpen = false)}
									role="presentation"
								></div>
								<div
									class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
									in:fly={{ y: -5, duration: 150 }}
								>
									<div class="space-y-0.5">
										{#each provinciasDisponibles as prov (prov)}
											<button
												type="button"
												class="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50 {provincia ===
												prov
													? 'bg-blue-50 font-medium text-blue-700'
													: 'text-gray-700'}"
												onclick={() => {
													provincia = prov;
													provinciaDropdownOpen = false;
													localidad = 'Todas';
												}}
											>
												{prov}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Localidad -->
					<div class="flex flex-col gap-1.5" in:fade={{ duration: 150 }}>
						<span
							id="{prefijoId}-label-localidad"
							class="text-xs font-medium tracking-wide text-gray-500 uppercase"
						>
							Localidad
						</span>
						<div class="relative">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								onclick={() => (localidadDropdownOpen = !localidadDropdownOpen)}
								disabled={provincia === 'Todas'}
							>
								<span class="block truncate">{localidad}</span>
								<ChevronDown
									class="text-gray-400 transition-transform duration-200 {localidadDropdownOpen
										? 'rotate-180'
										: ''}"
									size={16}
								/>
							</button>

							{#if localidadDropdownOpen}
								<div
									class="fixed inset-0 z-10 cursor-default"
									onclick={() => (localidadDropdownOpen = false)}
									role="presentation"
								></div>
								<div
									class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
									in:fly={{ y: -5, duration: 150 }}
								>
									<div class="space-y-0.5">
										{#each localidadesDisponibles as loc (loc)}
											<button
												type="button"
												class="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm hover:bg-gray-50 {localidad ===
												loc
													? 'bg-blue-50 font-medium text-blue-700'
													: 'text-gray-700'}"
												onclick={() => {
													localidad = loc;
													localidadDropdownOpen = false;
												}}
											>
												{loc}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Filtro por Estado -->
				{#if mostrarEstado}
					<div class="flex flex-col gap-1.5" in:fade={{ duration: 150 }}>
						<span
							id="{prefijoId}-label-estado"
							class="text-xs font-medium tracking-wide text-gray-500 uppercase"
						>
							Estado
						</span>

						<div class="relative">
							<!-- Botón Trigger -->
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
								onclick={() => (estadoDropdownOpen = !estadoDropdownOpen)}
								aria-haspopup="listbox"
								aria-expanded={estadoDropdownOpen}
								aria-labelledby="{prefijoId}-label-estado"
							>
								<span class="block max-w-[140px] truncate">
									{#if estado.length === 0 || estado.includes('Todos')}
										Todos
									{:else if estado.length <= 2}
										{estado
											.map((e: string) => estadosDisponibles.find((ed: { value: string; label: string }) => ed.value === e)?.label || e)
											.join(', ')}
									{:else}
										{estado.length} seleccionados
									{/if}
								</span>
								<ChevronDown
									class="text-gray-400 transition-transform duration-200 {estadoDropdownOpen
										? 'rotate-180'
										: ''}"
									size={16}
								/>
							</button>

							<!-- Dropdown Body -->
							{#if estadoDropdownOpen}
								<!-- Backdrop transparente para cerrar al hacer click afuera -->
								<div
									class="fixed inset-0 z-10 cursor-default"
									onclick={() => (estadoDropdownOpen = false)}
									role="presentation"
								></div>

								<div
									class="absolute top-full right-0 left-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
									in:fly={{ y: -5, duration: 150 }}
								>
									<!-- Opción Seleccionar Todos -->
									<label
										class="mb-1 flex cursor-pointer items-center gap-3 rounded-md border-b border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										<input
											type="checkbox"
											class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											checked={estado.length === 0 || estado.includes('Todos')}
											onchange={() => {
												estado = [];
											}}
										/>
										<span class="font-medium text-blue-600">Seleccionar todos</span>
									</label>

									<!-- Lista de Estados -->
									<div class="space-y-0.5">
										{#each estadosDisponibles.filter((e: { value: string; label: string }) => e.value !== 'Todos') as est (est.value)}
											<label
												class="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
											>
												<input
													type="checkbox"
													class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
													checked={estado.includes(est.value)}
													onchange={() => {
														if (estado.includes(est.value)) {
															estado = estado.filter((e: string) => e !== est.value);
														} else {
															const clean = estado.filter((e: string) => e !== 'Todos');
															estado = [...clean, est.value];
														}
													}}
												/>
												<span>{est.label}</span>
											</label>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Filtro por Fecha -->
				<div class="flex flex-col gap-1.5 {tipoUbicacion !== 'Presencial' ? 'lg:col-span-2' : ''}">
					<span
						id="{prefijoId}-label-fecha"
						class="text-xs font-medium tracking-wide text-gray-500 uppercase"
					>
						Rango de Fechas
					</span>

					<div class="relative">
						<!-- Botón Trigger -->
						<button
							type="button"
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
							onclick={() => (fechaDropdownOpen = !fechaDropdownOpen)}
							aria-haspopup="dialog"
							aria-expanded={fechaDropdownOpen}
							aria-labelledby="{prefijoId}-label-fecha"
						>
							<span class="block truncate">
								{#if !fechaDesde && !fechaHasta}
									Cualquier fecha
								{:else if fechaDesde && !fechaHasta}
									Desde {new Date(fechaDesde + 'T00:00:00').toLocaleDateString('es-AR', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
								{:else if !fechaDesde && fechaHasta}
									Hasta {new Date(fechaHasta + 'T00:00:00').toLocaleDateString('es-AR', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric'
									})}
								{:else}
									{new Date(fechaDesde + 'T00:00:00').toLocaleDateString('es-AR', {
										day: '2-digit',
										month: '2-digit',
										year: '2-digit'
									})} - {new Date(fechaHasta + 'T00:00:00').toLocaleDateString('es-AR', {
										day: '2-digit',
										month: '2-digit',
										year: '2-digit'
									})}
								{/if}
							</span>
							<ChevronDown
								class="text-gray-400 transition-transform duration-200 {fechaDropdownOpen
									? 'rotate-180'
									: ''}"
								size={16}
							/>
						</button>

						<!-- Dropdown Body -->
						{#if fechaDropdownOpen}
							<!-- Backdrop transparente -->
							<div
								class="fixed inset-0 z-10 cursor-default"
								onclick={() => (fechaDropdownOpen = false)}
								role="presentation"
							></div>

							<div
								class="absolute top-full right-0 left-0 z-20 mt-1 min-w-[280px] rounded-lg border border-gray-100 bg-white p-4 shadow-lg lg:right-auto lg:w-auto"
								in:fly={{ y: -5, duration: 150 }}
							>
								<div class="flex flex-col gap-4">
									<div class="grid grid-cols-2 gap-3">
										<div class="flex flex-col gap-1.5">
											<label for="{prefijoId}-fecha-desde" class="text-xs text-gray-600"
												>Desde</label
											>
											<input
												id="{prefijoId}-fecha-desde"
												type="date"
												bind:value={fechaDesde}
												class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
											/>
										</div>
										<div class="flex flex-col gap-1.5">
											<label for="{prefijoId}-fecha-hasta" class="text-xs text-gray-600"
												>Hasta</label
											>
											<input
												id="{prefijoId}-fecha-hasta"
												type="date"
												bind:value={fechaHasta}
												min={fechaDesde}
												class="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
											/>
										</div>
									</div>

									{#if fechaDesde || fechaHasta}
										<div class="flex justify-end border-t border-gray-100 pt-3">
											<button
												type="button"
												class="text-xs font-medium text-red-500 hover:text-red-700"
												onclick={() => {
													fechaDesde = '';
													fechaHasta = '';
												}}
											>
												Borrar fechas
											</button>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.6s ease-out both;
	}
	select {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right 0.5rem center;
		background-repeat: no-repeat;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}
</style>
