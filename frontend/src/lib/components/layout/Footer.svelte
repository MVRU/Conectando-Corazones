<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class=" base-color w-full py-12 text-white">
	<div class="mx-auto max-w-7xl px-6">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-x-20">
			<!-- Logo y descripción -->
			<div>
				<h3 class="white-text">Conectando Corazones</h3>
				<p class="mb-6 text-[--gray-color]">
					Uniendo personas a través de la generosidad y el apoyo mutuo. Juntos podemos hacer la
					diferencia.
				</p>
				<div class="custom-link flex space-x-4">
					<!-- Redes sociales -->
					<a href="https://facebook.com" aria-label="Facebook" class="text-white/90">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
							/>
						</svg>
					</a>
					<a href="https://twitter.com" aria-label="Twitter" class="text-white/90">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
							/>
						</svg>
					</a>
					<a href="https://instagram.com" aria-label="Instagram" class="text-white/90">
						<svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
							<path
								d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
							/>
						</svg>
					</a>
				</div>
			</div>

			<!-- Sección Enlaces -->
			<nav class="custom-link md:pl-15 flex flex-col space-y-2">
				<h5 class="white-text">Enlaces rápidos</h5>

				<a href="/about" class="text-white/90">Sobre Nosotros</a>
				<a href="/donate" class="text-white/90">Donar</a>
				<a href="/projects" class="text-white/90">Proyectos</a>
				<a href="/contact" class="text-white/90">Contacto</a>
			</nav>

			<!-- Sección Contacto -->
			<nav class="flex flex-col space-y-2">
				<h5 class="white-text">Contacto</h5>
				<div class="flex flex-row items-center gap-1">
					<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
					</svg>
					<a href="mailto:info@conectandocorazones.org"> info@conectando-corazones.org </a>
				</div>

				<div class="flex flex-row items-center gap-1">
					<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
						/>
					</svg>
					<span>+54 11 1234-5678</span>
				</div>
			</nav>
		</div>

		<!-- Línea divisoria -->
		<hr class="my-10 border-white/20" />

		<div class=" flex flex-row items-center justify-between gap-4">
			<p>
				&copy; {year} Conectando Corazones. Todos los derechos reservados.
			</p>

			<!-- Sección Soporte -->
			<nav aria-label="Soporte" class="custom-link flex flex-row gap-6 text-sm">
				<a href="/faq" class="text-white/90">Preguntas Frecuentas</a>
				<a href="/privacy" class="text-white/90">Política de Privacidad</a>
				<a href="/terms" class="text-white/90">Términos de Uso</a>
			</nav>
		</div>
	</div>
</footer>

<style>
	.base-color {
		background-color: rgb(var(--base-color));
	}
	.white-text {
		color: rgb(var(--white-color));
	}

	.custom-link a {
		text-decoration: none;
		opacity: 0.8;
		transition: opacity 0.3s ease-in-out;
	}

	.custom-link a:hover {
		opacity: 1;
	}
</style>
