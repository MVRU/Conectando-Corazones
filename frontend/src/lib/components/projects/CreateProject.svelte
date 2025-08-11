<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/elements/Button.svelte';
	import ImageUpload from '$lib/components/forms/ImageUpload.svelte';
	import BienesList from '$lib/components/forms/BienesList.svelte';
	import DatePicker from '$lib/components/forms/DatePicker.svelte';
	import { provinces } from '$lib/data/provinces';
	import { getAllProvinces, getCitiesByProvince, type City } from '$lib/data/cities';
	import type { Project } from '$lib/types/Project';
	import type { CreateProjectForm, CreateProjectErrors, TipoParticipacion, CategoriaProyecto, Bien } from '$lib/types/CreateProject';

	// Estados del formulario
	let titulo = '';
	let descripcion = '';
	let url_portada = '';
	let categorias: CategoriaProyecto[] = [];
	let categoriaOtro = '';
	let tipoParticipacion: TipoParticipacion[] = [];
	let fechaFinTentativa = '';
	let id_provincia: number | null = null;
	let ciudadSeleccionada: City | null = null;
	let cantidadVoluntarios = '';
	let montoDinero = '';
	let bienes: Bien[] = [];
	let isSubmitting = false;

	// Estados de validación
	let errors: CreateProjectErrors = {};

	// Datos de ubicación
	let allProvinces = getAllProvinces();
	let availableCities: City[] = [];

	// Categorías disponibles
	const categoriasDisponibles = [
		{ id: 'educacion', nombre: 'Educación', icono: '📚' },
		{ id: 'salud', nombre: 'Salud', icono: '🏥' },
		{ id: 'medioambiente', nombre: 'Medioambiente', icono: '🌱' },
		{ id: 'promocion-paz', nombre: 'Promoción de la paz', icono: '🕊' },
		{ id: 'seguridad', nombre: 'Seguridad', icono: '🛡' },
		{ id: 'entretenimiento', nombre: 'Entretenimiento', icono: '🎭' },
		{ id: 'liderazgo', nombre: 'Liderazgo', icono: '👑' },
		{ id: 'personas-discapacidades', nombre: 'Personas con discapacidades', icono: '♿' },
		{ id: 'tecnologia', nombre: 'Tecnología', icono: '💻' },
		{ id: 'politica', nombre: 'Política', icono: '🏛' },
		{ id: 'religion', nombre: 'Religión', icono: '⛪' },
		{ id: 'lgbtq', nombre: 'LGTBQ+', icono: '🌈' },
		{ id: 'apoyo-crisis', nombre: 'Apoyo ante una crisis', icono: '🚨' },
		{ id: 'empleo', nombre: 'Empleo', icono: '💼' },
		{ id: 'inmigrantes-refugiados', nombre: 'Inmigrantes y refugiados', icono: '🌍' },
		{ id: 'otro', nombre: 'Otro', icono: '➕' }
	];

	// Función para manejar cambio de provincia
	function handleProvinceChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		id_provincia = parseInt(target.value) || null;
		ciudadSeleccionada = null; // Reset ciudad cuando cambia provincia
		availableCities = id_provincia ? getCitiesByProvince(id_provincia) : [];
	}

	// Función para manejar cambio de ciudad
	function handleCityChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const codigoPostal = target.value;
		ciudadSeleccionada = availableCities.find(city => city.codigo_postal === codigoPostal) || null;
	}

	// Función para alternar categoría
	function alternarCategoria(cat: CategoriaProyecto) {
		if (categorias.includes(cat)) {
			categorias = categorias.filter(c => c !== cat);
			if (cat === 'otro') {
				categoriaOtro = '';
			}
		} else {
			categorias = [...categorias, cat];
		}
	}

	// Función para agregar tipo de participación
	function agregarTipoParticipacion(tipo: TipoParticipacion) {
		if (!tipoParticipacion.includes(tipo)) {
			tipoParticipacion = [...tipoParticipacion, tipo];
		}
	}

	// Función para eliminar tipo de participación
	function eliminarTipoParticipacion(tipo: TipoParticipacion) {
		tipoParticipacion = tipoParticipacion.filter(t => t !== tipo);
		
		// Limpiar campos relacionados
		if (tipo === 'voluntariado') {
			cantidadVoluntarios = '';
		} else if (tipo === 'dinero') {
			montoDinero = '';
		} else if (tipo === 'bienes') {
			bienes = [];
		}
	}

	// Función para validar el formulario
	function validateForm(): boolean {
		errors = {};

		// Validar título
		const tituloTrim = titulo.trim();
		if (!tituloTrim) {
			errors.titulo = 'Este campo es obligatorio';
		} else if (tituloTrim.length < 5) {
			errors.titulo = 'El título debe tener al menos 5 caracteres';
		} else if (tituloTrim.length > 100) {
			errors.titulo = 'El título no puede superar los 100 caracteres';
		}

		// Validar descripción
		if (!descripcion.trim()) {
			errors.descripcion = 'Este campo es obligatorio';
		} else if (descripcion.length < 20) {
			errors.descripcion = 'La descripción debe tener al menos 20 caracteres';
		}

		// Validar URL de portada (si se proporciona)
		if (url_portada.trim() && !isValidUrl(url_portada.trim())) {
			errors.url_portada = 'La URL de la imagen no es válida';
		}

		// Validar categorías
		if (categorias.length === 0) {
			errors.categorias = 'Este campo es obligatorio';
		} else if (categorias.includes('otro') && !categoriaOtro.trim()) {
			errors.categoriaOtro = 'Debes especificar la categoría personalizada';
		}

		// Validar tipos de participación
		if (tipoParticipacion.length === 0) {
			errors.tipoParticipacion = 'Este campo es obligatorio';
		}

		// Validar fecha de fin tentativa
		if (!fechaFinTentativa.trim()) {
			errors.fecha_fin_tentativa = 'Este campo es obligatorio';
		} else {
			const fechaSeleccionada = new Date(fechaFinTentativa);
			const fechaActual = new Date();
			fechaActual.setHours(0, 0, 0, 0);
			if (fechaSeleccionada < fechaActual) {
				errors.fecha_fin_tentativa = 'La fecha de fin no puede ser anterior al día actual';
			}
		}

		// Validar objetivos según los tipos de participación seleccionados
		if (tipoParticipacion.includes('voluntariado')) {
			if (!cantidadVoluntarios || parseInt(cantidadVoluntarios) <= 0) {
				errors.cantidadVoluntarios = 'Debes especificar la cantidad de voluntarios';
			}
		}
		if (tipoParticipacion.includes('dinero')) {
			if (!montoDinero || parseFloat(montoDinero) <= 0) {
				errors.montoDinero = 'Debes especificar el monto de dinero';
			}
		}
		if (tipoParticipacion.includes('bienes')) {
			if (bienes.length === 0) {
				errors.bienes = 'Debes agregar al menos un bien';
			}
		}
		return Object.keys(errors).length === 0;
	}

	// Función para validar URL
	function isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	// Función para manejar el envío del formulario
	async function handleSubmit() {
		// Validar el formulario
		const isValid = validateForm();
		
		// Si hay errores de validación, detener aquí y mostrar todos los errores
		if (!isValid) {
			// Forzar la reactividad de Svelte
			errors = { ...errors };
			// Forzar la actualización de la interfaz
			setTimeout(() => {
				errors = { ...errors };
			}, 0);
			return;
		}

		// Solo continuar si no hay errores de validación
		isSubmitting = true;

		try {
			// Obtener nombres de provincia y ciudad
			const selectedProvince = allProvinces.find(p => p.id === id_provincia);

			// Preparar los datos del formulario
			const formData: CreateProjectForm = {
				titulo: titulo.trim(),
				descripcion: descripcion.trim(),
				url_portada: url_portada.trim() || undefined,
				categorias,
				categoriaOtro: categorias.includes('otro') ? categoriaOtro.trim() : undefined,
				tipoParticipacion,
				fecha_fin_tentativa: fechaFinTentativa,
				id_provincia: id_provincia!,
				codigo_postal: ciudadSeleccionada!.codigo_postal,
				cantidadVoluntarios: tipoParticipacion.includes('voluntariado')
					? parseInt(cantidadVoluntarios) 
					: undefined,
				montoDinero: tipoParticipacion.includes('dinero')
					? parseFloat(montoDinero)
					: undefined,
				bienes: tipoParticipacion.includes('bienes')
					? bienes
					: []
			};

			console.log('Datos del proyecto:', formData);

			// Aquí iría la lógica para enviar los datos al backend
			// const response = await fetch('/api/projects', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(formData)
			// });

			// Simular envío exitoso
			await new Promise(resolve => setTimeout(resolve, 1000));

			// Redirigir a la página de proyectos
			goto('/projects');

		} catch (error) {
			console.error('Error al crear el proyecto:', error);
			// Solo mostrar error general si no hay errores de validación
			if (Object.keys(errors).length === 0) {
				errors.general = 'Hubo un error al crear el proyecto. Inténtalo de nuevo.';
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Crear Proyecto - Conectando Corazones</title>
	<meta name="description" content="Crea un nuevo proyecto solidario y conecta con voluntarios" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
	<div class="container mx-auto px-4 max-w-4xl">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Crear Nuevo Proyecto</h1>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Comparte tu proyecto solidario y conecta con voluntarios que quieran ayudar a hacer la diferencia
			</p>
		</div>

		<!-- Formulario -->
		<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-2xl shadow-xl p-8">
			{#if errors.general}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<p class="text-red-600 text-sm">{errors.general}</p>
				</div>
			{/if}

			<!-- Título -->
			<div class="mb-6">
				<label for="titulo" class="block text-base font-semibold text-gray-700 mb-2">
					Título del Proyecto <span class="text-red-500">*</span>
				</label>
				<input
					id="titulo"
					name="titulo"
					bind:value={titulo}
					placeholder="Ej: Infancias felices 2025"
					required={true}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] {errors.titulo ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
					on:input={() => { if (errors.titulo) { errors.titulo = undefined; errors = { ...errors }; } }}
				/>
				{#if errors.titulo}
					<p class="text-sm text-red-600 mt-1">{errors.titulo}</p>
				{/if}
			</div>

			<!-- Descripción -->
			<div class="mb-6">
				<label for="descripcion" class="block text-base font-semibold text-gray-700 mb-2">
					Descripción <span class="text-red-500">*</span>
				</label>
				<textarea
					id="descripcion"
					name="descripcion"
					bind:value={descripcion}
					placeholder="Contanos brevemente de qué se trata el proyecto..."
					required={true}
					rows="4"
					class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] {errors.descripcion ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
					on:input={() => { if (errors.descripcion) { errors.descripcion = undefined; errors = { ...errors }; } }}
				></textarea>
				{#if errors.descripcion}
					<p class="text-sm text-red-600 mt-1">{errors.descripcion}</p>
				{/if}
			</div>

			<!-- URL de portada -->
			<div class="mb-6">
				<ImageUpload
					bind:value={url_portada}
					placeholder="https://ejemplo.com/imagen.jpg"
					label="Imagen de portada"
					error={errors.url_portada}
				/>
			</div>

			<!-- Categorías del Proyecto -->
			<div class="mb-6">
				<label for="categorias" class="block text-base font-semibold text-gray-700 mb-4">
					Categorías del Proyecto <span class="text-red-500">*</span>
				</label>
				
				<!-- Chips de categorías -->
				<div id="categorias" class="flex flex-wrap gap-2 mb-4 p-4 rounded-lg border-2 transition-all duration-200 {errors.categorias ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}" role="group" aria-labelledby="categorias">
					{#each categoriasDisponibles as cat}
						<button
							type="button"
							on:click={() => alternarCategoria(cat.id as CategoriaProyecto)}
							class="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200 hover:scale-105 {categorias.includes(cat.id as CategoriaProyecto)
								? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
								: 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}"
						>
							<span class="text-sm">{cat.icono}</span>
							<span class="text-sm font-medium whitespace-nowrap">{cat.nombre}</span>
						</button>
					{/each}
				</div>

				{#if errors.categorias}
					<p class="text-sm text-red-600 mt-1">{errors.categorias}</p>
				{/if}

				<!-- Campo para categoría personalizada -->
				{#if categorias.includes('otro')}
					<div class="mt-4">
						<label for="categoriaOtro" class="block text-sm font-medium text-gray-700 mb-2">
							Especifica la categoría personalizada <span class="text-red-500">*</span>
						</label>
						<input
							id="categoriaOtro"
							name="categoriaOtro"
							bind:value={categoriaOtro}
							placeholder="Ej: Tecnología, Arte, Deportes..."
							required={true}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 {errors.categoriaOtro ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
							on:input={() => { if (errors.categoriaOtro) { errors.categoriaOtro = undefined; errors = { ...errors }; } }}
						/>
						{#if errors.categoriaOtro}
							<p class="text-sm text-red-600 mt-1">{errors.categoriaOtro}</p>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Tipos de Participación -->
			<div class="mb-6">
				<label for="tipos-participacion" class="block text-base font-semibold text-gray-700 mb-4">
					Tipos de Participación <span class="text-red-500">*</span>
				</label>
				
				<!-- Botones de acción -->
				<div id="tipos-participacion" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded-lg border-2 transition-all duration-200 {errors.tipoParticipacion ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}" role="group" aria-labelledby="tipos-participacion">
					{#if !tipoParticipacion.includes('voluntariado')}
						<button
							type="button"
							on:click={() => agregarTipoParticipacion('voluntariado')}
							class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
						>
							<div class="text-3xl mb-2">👥</div>
							<div class="text-lg font-semibold text-blue-700 group-hover:text-blue-800">Voluntariado</div>
							<div class="text-sm text-blue-600 text-center group-hover:text-blue-700">Necesitas personas que colaboren con su tiempo</div>
						</button>
					{/if}

					{#if !tipoParticipacion.includes('dinero')}
						<button
							type="button"
							on:click={() => agregarTipoParticipacion('dinero')}
							class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50 hover:border-green-500 hover:bg-green-100 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
						>
							<div class="text-3xl mb-2">💰</div>
							<div class="text-lg font-semibold text-green-700 group-hover:text-green-800">Dinero</div>
							<div class="text-sm text-green-600 text-center group-hover:text-green-700">Necesitas donaciones monetarias</div>
						</button>
					{/if}

					{#if !tipoParticipacion.includes('bienes')}
						<button
							type="button"
							on:click={() => agregarTipoParticipacion('bienes')}
							class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 hover:border-purple-500 hover:bg-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
						>
							<div class="text-3xl mb-2">📦</div>
							<div class="text-lg font-semibold text-purple-700 group-hover:text-purple-800">Bienes</div>
							<div class="text-sm text-purple-600 text-center group-hover:text-purple-700">Necesitas donaciones de materiales o productos</div>
						</button>
					{/if}
				</div>

				{#if errors.tipoParticipacion}
					<p class="text-sm text-red-600 mt-1">{errors.tipoParticipacion}</p>
				{/if}
			</div>

			<!-- Secciones de participación seleccionadas -->
			{#if tipoParticipacion.includes('voluntariado')}
				<div class="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-xl">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center">
							<div class="text-2xl mr-3">👥</div>
							<h3 class="text-lg font-semibold text-blue-800">Voluntariado</h3>
						</div>
						<button
							type="button"
							on:click={() => eliminarTipoParticipacion('voluntariado')}
							class="text-red-500 hover:text-red-700 text-sm font-medium"
						>
							Eliminar sección
						</button>
					</div>
					<div>
						<label for="cantidadVoluntarios" class="block text-sm font-medium text-gray-700 mb-2">
							Cantidad de voluntarios necesarios *
						</label>
						<input
							id="cantidadVoluntarios"
							name="cantidadVoluntarios"
							bind:value={cantidadVoluntarios}
							placeholder="Ej: 10"
							type="number"
							min="1"
							required={true}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 {errors.cantidadVoluntarios ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
							on:input={() => { if (errors.cantidadVoluntarios) { errors.cantidadVoluntarios = undefined; errors = { ...errors }; } }}
						/>
						{#if errors.cantidadVoluntarios}
							<p class="text-sm text-red-600 mt-1">{errors.cantidadVoluntarios}</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if tipoParticipacion.includes('dinero')}
				<div class="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center">
							<div class="text-2xl mr-3">💰</div>
							<h3 class="text-lg font-semibold text-green-800">Dinero</h3>
						</div>
						<button
							type="button"
							on:click={() => eliminarTipoParticipacion('dinero')}
							class="text-red-500 hover:text-red-700 text-sm font-medium"
						>
							Eliminar sección
						</button>
					</div>
					<div>
						<label for="montoDinero" class="block text-sm font-medium text-gray-700 mb-2">
							Monto de dinero objetivo (ARS) *
						</label>
						<input
							id="montoDinero"
							name="montoDinero"
							bind:value={montoDinero}
							placeholder="Ej: 50000"
							type="number"
							min="1"
							required={true}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 {errors.montoDinero ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}"
							on:input={() => { if (errors.montoDinero) { errors.montoDinero = undefined; errors = { ...errors }; } }}
						/>
						{#if errors.montoDinero}
							<p class="text-sm text-red-600 mt-1">{errors.montoDinero}</p>
						{/if}
					</div>
				</div>
			{/if}

			{#if tipoParticipacion.includes('bienes')}
				<div class="mb-6 p-6 bg-purple-50 border border-purple-200 rounded-xl">
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center">
							<div class="text-2xl mr-3">📦</div>
							<h3 class="text-lg font-semibold text-purple-800">Bienes</h3>
						</div>
						<button
							type="button"
							on:click={() => eliminarTipoParticipacion('bienes')}
							class="text-red-500 hover:text-red-700 text-sm font-medium"
						>
							Eliminar sección
						</button>
					</div>
					<div>
						<BienesList 
							bind:bienes 
							error={errors.bienes}
							on:change={(event) => bienes = event.detail.bienes}
							on:error={(event) => errors.bienes = event.detail.message}
						/>
					</div>
				</div>
			{/if}

			<!-- Fecha de fin tentativa -->
			<div class="mb-6">
				<label for="fechaFinTentativa" class="block text-base font-semibold text-gray-700 mb-2">
					Fecha de fin tentativa <span class="text-red-500">*</span>
				</label>
				<div class="relative">
					<DatePicker
						id="fechaFinTentativa"
						name="fechaFinTentativa"
						bind:value={fechaFinTentativa}
						error={errors.fecha_fin_tentativa}
						min={new Date().toISOString().split('T')[0]}
						placeholder="Selecciona la fecha de finalización"
						required={true}
						customClass={errors.fecha_fin_tentativa ? 'border-red-500 ring-red-500 focus:ring-red-500' : ''}
					/>
					{#if errors.fecha_fin_tentativa}
						<style>
							:global(input[name="fechaFinTentativa"]) {
								border-color: #ef4444 !important;
								box-shadow: 0 0 0 2px #fecaca !important;
							}
						</style>
					{/if}
				</div>
				<p class="text-sm text-gray-500 mt-1">
					Establece una fecha tentativa de finalización del proyecto
				</p>
			</div>

			<!-- Ubicación -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
				<div>
					<label for="id_provincia" class="block text-base font-semibold text-gray-700 mb-2">
						Provincia
					</label>
					<select
						id="id_provincia"
						name="id_provincia"
						bind:value={id_provincia}
						on:change={handleProvinceChange}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
					>
						<option value="">Selecciona una provincia</option>
						{#each allProvinces as province}
							<option value={province.id}>{province.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="ciudadSeleccionada" class="block text-base font-semibold text-gray-700 mb-2">
						Ciudad
					</label>
					<select
						id="ciudadSeleccionada"
						name="ciudadSeleccionada"
						value={ciudadSeleccionada?.codigo_postal || ''}
						on:change={handleCityChange}
						disabled={!id_provincia}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] {!id_provincia ? 'bg-gray-100 cursor-not-allowed' : ''}"
					>
						<option value="">{id_provincia ? 'Selecciona una ciudad' : 'Primero selecciona una provincia'}</option>
						{#each availableCities as city}
							<option value={city.codigo_postal}>{city.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Botón de envío -->
			<div class="flex justify-center">
				<button
					type="submit"
					disabled={isSubmitting}
					class="w-full max-w-md h-14 text-lg font-semibold rounded-4xl bg-primary hover:bg-primary-hover text-white font-semibold tracking-tight transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isSubmitting ? 'Creando proyecto...' : 'Crear Proyecto'}
				</button>
			</div>
		</form>
	</div>
</div>
