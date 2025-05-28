<!--
* Página: Contacto
	-*- Descripción: Información de contacto del equipo y formulario para consultas
	-*- Funcionalidad: Datos del equipo, formulario de contacto y información institucional

TODO:
	- [ ] Conectar formulario con backend
	- [ ] Agregar validación de campos
	- [ ] Implementar envío de emails
	- [ ] Agregar reCAPTCHA para seguridad
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { setBreadcrumbs, BREADCRUMB_ROUTES } from '$lib/stores/breadcrumbs';

	let formularioEnviado = false;
	let enviandoFormulario = false;

	// Establecer breadcrumbs al montar la página
	onMount(() => {
		setBreadcrumbs([
			BREADCRUMB_ROUTES.home,
			{ label: 'Contacto' }
		]);
	});

	// Información del equipo
	const equipoCreadores = [
		{
			nombre: 'Tomás García',
			rol: 'Desarrollador Principal & Founder',
			especialidad: 'Full Stack Developer',
			email: 'tomas.garcia@conectandocorazones.org',
			descripcion: 'Estudiante de Ingeniería en Sistemas de Información en UTN FRRo. Especializado en desarrollo web moderno y tecnologías de la información.'
		},
		{
			nombre: 'Equipo de Desarrollo',
			rol: 'Colaboradores Técnicos',
			especialidad: 'Desarrollo & Diseño',
			email: 'dev@conectandocorazones.org',
			descripcion: 'Grupo de estudiantes y profesionales comprometidos con el desarrollo de soluciones tecnológicas para el bien social.'
		}
	];

	// Función para enviar formulario
	async function enviarFormulario(event: Event) {
		event.preventDefault();
		enviandoFormulario = true;

		// Simular envío (en producción se conectaría con backend)
		setTimeout(() => {
			enviandoFormulario = false;
			formularioEnviado = true;
			
			// Resetear después de 5 segundos
			setTimeout(() => {
				formularioEnviado = false;
			}, 5000);
		}, 2000);
	}
</script>

<svelte:head>
	<title>Contacto - Conectando Corazones</title>
	<meta name="description" content="Contacta con el equipo de Conectando Corazones. Información sobre los creadores y administradores del sistema." />
</svelte:head>

<main class="min-h-screen bg-gray-50 py-8">
	<div class="max-w-7xl mx-auto px-8">
		
		<!-- Header de la página -->
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-[rgb(var(--base-color))] mb-4">
				Contacto
			</h1>
			<p class="text-lg text-gray-600 max-w-3xl mx-auto">
				Conocé al equipo detrás de Conectando Corazones y ponte en contacto con nosotros para consultas, sugerencias o colaboraciones.
			</p>
		</div>

		<div class="grid lg:grid-cols-2 gap-12">
			
			<!-- Sección del equipo -->
			<div class="space-y-8">
				<div class="bg-white rounded-2xl shadow-lg p-8">
					<h2 class="text-2xl font-semibold text-[rgb(var(--base-color))] mb-6">
						🚀 Nuestro Equipo
					</h2>
					
					<div class="space-y-6">
						{#each equipoCreadores as miembro}
							<div class="border-l-4 border-[rgb(var(--color-primary))] bg-blue-50 p-6 rounded-r-lg">
								<div class="flex justify-between items-start mb-3">
									<div>
										<h3 class="text-xl font-semibold text-[rgb(var(--base-color))]">
											{miembro.nombre}
										</h3>
										<p class="text-[rgb(var(--color-primary))] font-medium">
											{miembro.rol}
										</p>
										<p class="text-sm text-gray-600">
											{miembro.especialidad}
										</p>
									</div>
								</div>
								
								<p class="text-gray-700 mb-4">
									{miembro.descripcion}
								</p>
								
								<div class="flex flex-wrap gap-4 text-sm">
									<a 
										href="mailto:{miembro.email}" 
										class="flex items-center gap-2 text-[rgb(var(--color-primary))] hover:underline"
									>
										📧 {miembro.email}
									</a>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Información institucional -->
				<div class="bg-white rounded-2xl shadow-lg p-8">
					<h2 class="text-2xl font-semibold text-[rgb(var(--base-color))] mb-6">
						🎓 Información Académica
					</h2>
					
					<div class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Institución</h4>
								<p class="text-gray-700">Universidad Tecnológica Nacional</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Facultad</h4>
								<p class="text-gray-700">Facultad Regional Rosario (UTN FRRo)</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Carrera</h4>
								<p class="text-gray-700">Ingeniería en Sistemas de Información</p>
							</div>
							<div>
								<h4 class="font-semibold text-[rgb(var(--base-color))]">Año</h4>
								<p class="text-gray-700">2024</p>
							</div>
						</div>
						
						<div class="mt-6 p-4 bg-gray-50 rounded-lg">
							<h4 class="font-semibold text-[rgb(var(--base-color))] mb-2">Acerca del Proyecto</h4>
							<p class="text-gray-700">
								Conectando Corazones es desarrollado como Proyecto Final de Carrera de Ingeniería en Sistemas de Información. 
								El objetivo es crear una plataforma tecnológica que facilite la conexión entre donantes y organizaciones benéficas, 
								promoviendo la transparencia y trazabilidad en cada proyecto social.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Formulario de contacto -->
			<div class="bg-white rounded-2xl shadow-lg p-8">
				<h2 class="text-2xl font-semibold text-[rgb(var(--base-color))] mb-6">
					📩 Envianos un Mensaje
				</h2>

				{#if formularioEnviado}
					<div class="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg">
						<p class="text-green-700 font-medium">
							✅ ¡Mensaje enviado correctamente! Te responderemos a la brevedad.
						</p>
					</div>
				{:else}
					<form on:submit={enviarFormulario} class="space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="nombre" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Nombre completo *
								</label>
								<input 
									id="nombre"
									type="text" 
									required 
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="Tu nombre completo"
								/>
							</div>

							<div>
								<label for="email" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
									Email *
								</label>
								<input 
									id="email"
									type="email" 
									required 
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
									placeholder="tu.email@ejemplo.com"
								/>
							</div>
						</div>

						<div>
							<label for="asunto" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
								Asunto *
							</label>
							<select 
								id="asunto"
								required 
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
							>
								<option value="">Seleccionar asunto</option>
								<option value="consulta-general">Consulta general</option>
								<option value="soporte-tecnico">Soporte técnico</option>
								<option value="colaboracion">Propuesta de colaboración</option>
								<option value="institucion">Soy una institución</option>
								<option value="feedback">Feedback del sistema</option>
								<option value="otro">Otro</option>
							</select>
						</div>

						<div>
							<label for="mensaje" class="block text-sm font-medium text-[rgb(var(--base-color))] mb-2">
								Mensaje *
							</label>
							<textarea 
								id="mensaje"
								required 
								rows="6"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:border-transparent"
								placeholder="Escribí tu mensaje aquí..."
							></textarea>
						</div>

						<button 
							type="submit"
							disabled={enviandoFormulario}
							class="w-full bg-[rgb(var(--color-primary))] text-white px-6 py-3 rounded-lg hover:bg-[rgb(var(--color-primary-hover))] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if enviandoFormulario}
								Enviando mensaje...
							{:else}
								Enviar mensaje
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>

		<!-- Información adicional -->
		<div class="mt-12 bg-white rounded-2xl shadow-lg p-8">
			<h2 class="text-2xl font-semibold text-[rgb(var(--base-color))] mb-6 text-center">
				📍 Información de Contacto
			</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
				<div>
					<div class="text-4xl mb-4">🏛️</div>
					<h3 class="font-semibold text-[rgb(var(--base-color))] mb-2">Institución</h3>
					<p class="text-gray-600">Universidad Tecnológica Nacional</p>
					<p class="text-gray-600">Facultad Regional Rosario</p>
					<p class="text-sm text-gray-500 mt-2">Zeballos 1341, Rosario, Santa Fe</p>
				</div>
				
				<div>
					<div class="text-4xl mb-4">💻</div>
					<h3 class="font-semibold text-[rgb(var(--base-color))] mb-2">Soporte Técnico</h3>
					<p class="text-gray-600">Lun - Vie: 9:00 - 18:00</p>
					<p class="text-gray-600">soporte@conectandocorazones.org</p>
					<p class="text-sm text-gray-500 mt-2">Tiempo de respuesta: 24-48 hs</p>
				</div>
				
				<div>
					<div class="text-4xl mb-4">🤝</div>
					<h3 class="font-semibold text-[rgb(var(--base-color))] mb-2">Colaboraciones</h3>
					<p class="text-gray-600">¿Querés ser parte del proyecto?</p>
					<p class="text-gray-600">colabora@conectandocorazones.org</p>
					<p class="text-sm text-gray-500 mt-2">Siempre buscamos nuevos talentos</p>
				</div>
			</div>
		</div>

		<!-- Call to action -->
		<div class="mt-12 text-center">
			<div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
				<h2 class="text-2xl font-semibold text-[rgb(var(--base-color))] mb-4">
					¿Tenés una idea o sugerencia?
				</h2>
				<p class="text-gray-600 mb-6 max-w-2xl mx-auto">
					Conectando Corazones está en constante evolución. Tu feedback es fundamental para mejorar la plataforma 
					y crear un impacto positivo más grande en nuestra comunidad.
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<Button 
						label="Ver proyectos activos" 
						href="/projects"
						disabled={false}
					/>
				</div>
			</div>
		</div>
	</div>
</main>
