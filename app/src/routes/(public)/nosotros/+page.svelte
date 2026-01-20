<script lang="ts">
	import { onMount } from 'svelte';
	import 'aos/dist/aos.css';
	import AOS from 'aos';
	import '@fontsource/raleway/400.css';
	import '@fontsource/raleway/600.css';

	// Manejo de errores de imagen (modifiqué para evitar riesgos de XSS)
	function handleImageError(event: Event) {
		const img = event.target as HTMLImageElement;
		const container = img.parentElement;
		if (!container) return;
		img.remove();
		container.style.backgroundColor = '#e5e7eb';
		const fallback = document.createElement('div');
		fallback.textContent = 'Sin foto';
		fallback.className =
			'flex items-center justify-center h-full text-gray-500 text-2xl font-semibold';
		container.appendChild(fallback);
	}

	onMount(() => {
		AOS.init({
			duration: 900,
			once: true,
			easing: 'ease-out-cubic'
		});
	});
</script>

<div
	class="mx-auto max-w-7xl rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 shadow-xl sm:px-6 md:py-14 lg:px-8"
>
	<!-- Sección "Por qué existimos" -->
	<section class="mb-24">
		<div
			class="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-2xl backdrop-blur-md md:p-14"
		>
			<div class="pointer-events-none absolute inset-0">
				<div
					class="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-200/30 via-purple-200/20 to-transparent blur-3xl"
				></div>
				<div
					class="absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-tr from-blue-100/30 via-pink-100/20 to-transparent blur-2xl"
				></div>
			</div>
			<div class="mb-8 flex justify-center">
				<span
					class="letter-spacing-wide inline-block rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-400 px-6 py-2 text-sm font-semibold tracking-wide text-white uppercase shadow-md"
				>
					Sobre Nosotros
				</span>
			</div>
			<div class="mx-auto mb-12 max-w-4xl text-center">
				<div
					class="relative inline-block aspect-[4/3] min-h-[320px] overflow-hidden rounded-[2.5rem] border-4 border-white/80 shadow-2xl transition-transform duration-500 hover:scale-95"
				>
					<img
						src="/img/manosUnidas.jpg"
						alt="Manos unidas"
						class="h-full w-full object-cover transition-all duration-500 hover:scale-105 hover:brightness-95"
						on:error={handleImageError}
						loading="lazy"
						decoding="async"
					/>
				</div>
				<h1 class="mt-10 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
					<span
						class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md"
					>
						¿Por qué existimos?
					</span>
				</h1>
			</div>

			<div class="mx-auto flex max-w-3xl flex-col gap-8 md:gap-10">
				{#each ['Creemos que ningún niño debería irse a dormir con hambre.', 'Que ningún abuelo pase sus días en soledad, sin un abrazo, sin una palabra amable, sin una sonrisa.', 'Que las escuelas no tengan que improvisar con lo que hay, sino que puedan enseñar con todo lo que necesitan.', 'Que los hospitales no tengan que hacer milagros con lo mínimo, sino que cuenten con todo lo necesario para cuidar con dignidad.', 'Conectando Corazones nace del deseo profundo de cambiar realidades.', 'No desde un escritorio, sino desde el alma.', 'Queremos ser el puente entre quienes necesitan ayuda y quienes están dispuestos a darla.', 'Porque la empatía no tiene fronteras, y el compromiso no entiende de excusas.', 'Esta plataforma es un acto de amor. Es la mano que se extiende, el oído que escucha, el corazón que late junto al de otro.', 'Porque cuando conectamos corazones, el mundo cambia. Y cambia para bien.'] as frase, i (i)}
					<div data-aos="fade-up" data-aos-delay={i * 120} class="relative overflow-visible">
						<blockquote
							class="mx-auto max-w-2xl rounded-3xl border border-blue-200/40 px-7 py-8 text-center text-lg leading-relaxed font-normal italic shadow-[0_4px_28px_0_#bbeafe20] md:px-10 md:py-10 md:text-2xl"
							class:bg-gradient-to-b={i % 2 === 0}
							class:from-[#e0f2fe]={i % 2 === 0}
							class:via-[#f0faff]={i % 2 === 0}
							class:to-[#e0f2fe]={i % 2 === 0}
							class:text-sky-700={i % 2 === 0}
							class:bg-white={i % 2 === 1}
							class:text-gray-500={i % 2 === 1}
						>
							<span
								class="absolute -top-2 -left-4 text-2xl text-blue-200/60 select-none md:text-3xl"
								>“</span
							>
							{frase}
							<span class="text-2xl text-blue-200/60 select-none md:text-3xl">”</span>
						</blockquote>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Sección "Misión, Visión y Valores" -->
	<section class="mb-24">
		<h2 class="mb-14 text-center text-3xl font-bold">
			<span
				class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md"
			>
				Misión, Visión y Valores
			</span>
		</h2>
		<div class="grid gap-10 md:grid-cols-3">
			<!-- Misión -->
			<div
				class="group rounded-2xl border-t-4 border-blue-200 bg-white/90 p-8 text-center shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md transition-colors duration-300 group-hover:bg-blue-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-blue-600 transition-colors duration-300 group-hover:text-blue-800"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="mb-4 text-xl font-semibold tracking-wide text-gray-800">Misión</h3>
				<p class="text-gray-600">
					Conectar personas y organizaciones para crear un impacto positivo en la sociedad,
					facilitando la ayuda humanitaria y promoviendo la solidaridad.
				</p>
			</div>

			<!-- Visión -->
			<div
				class="group rounded-2xl border-t-4 border-green-200 bg-white/90 p-8 text-center shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 shadow-md transition-colors duration-300 group-hover:bg-green-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-green-600 transition-colors duration-300 group-hover:text-green-800"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
				</div>
				<h3 class="mb-4 text-xl font-semibold tracking-wide text-gray-800">Visión</h3>
				<p class="text-gray-600">
					Ser el puente que transforma la solidaridad local en un impacto colectivo que cambie vidas
					y fortalezca comunidades.
				</p>
			</div>

			<!-- Valores -->
			<div
				class="group rounded-2xl border-t-4 border-purple-200 bg-white/90 p-8 text-center shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
			>
				<div
					class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 shadow-md transition-colors duration-300 group-hover:bg-purple-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-purple-600 transition-colors duration-300 group-hover:text-purple-800"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				</div>
				<h3 class="mb-4 text-xl font-semibold tracking-wide text-gray-800">Valores</h3>
				<ul class="space-y-2 text-gray-600">
					<li>Empatía</li>
					<li>Transparencia</li>
					<li>Compromiso</li>
					<li>Solidaridad</li>
					<li>Innovación</li>
				</ul>
			</div>
		</div>
	</section>

	<!-- Sección "Nuestro equipo" -->
	<section>
		<h2 class="mb-10 text-center text-3xl font-bold">
			<span
				class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md"
			>
				Nuestro Equipo
			</span>
		</h2>
		<div
			class="mx-auto mb-14 max-w-4xl space-y-4 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8 text-justify text-lg leading-relaxed text-gray-700 shadow-md md:p-10"
		>
			<p>
				Somos tres estudiantes de la Universidad Tecnológica Nacional – Facultad Regional Rosario,
				convencidos de que la tecnología puede ser mucho más que líneas de código: puede ser el hilo
				invisible que une corazones dispuestos a cambiar realidades.
			</p>
			<p>
				<strong>Conectando Corazones</strong> nació como nuestro proyecto final, pero va más allá de
				una entrega académica. Es una iniciativa que busca potenciar las buenas acciones, creando herramientas
				digitales simples, seguras y efectivas que conecten a quienes quieren colaborar con quienes más
				lo necesitan.
			</p>
			<p>
				Porque la tecnología, cuando se pone al servicio de la solidaridad, se convierte en una
				herramienta poderosa para el cambio social.
			</p>
		</div>

		<div class="grid gap-10 md:grid-cols-3">
			{#each [{ name: 'Alexis Julián Sklate', role: 'Cofundador y desarrollador', quote: 'La solidaridad es el lenguaje universal del corazón', img: 'https://github.com/AleSklate0807.png', url: 'https://github.com/AleSklate0807' }, { name: 'Marina Ana Milo', role: 'Cofundadora y desarrolladora', quote: 'A veces, un simple gesto de amor puede ser el milagro que alguien estaba esperando.', img: 'https://github.com/MVRU.png', url: 'https://github.com/MVRU' }, { name: 'Martín Tomás Álvarez', role: 'Cofundador y desarrollador', quote: 'La empatía es el puente que conecta corazones', img: 'https://github.com/TomasAlvarez0.png', url: 'https://github.com/TomasAlvarez0' }] as member, i (i)}
				<div
					class="group rounded-2xl border-t-4 border-blue-100 bg-white/90 p-6 text-center shadow-xl transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
				>
					<a
						href={member.url}
						target="_blank"
						rel="noopener noreferrer"
						class="mx-auto mb-4 block h-40 w-40 overflow-hidden rounded-3xl border-4 border-white/80 bg-gradient-to-br from-blue-100 via-purple-100 to-white shadow-lg transition-transform duration-300 group-hover:scale-105"
					>
						<img
							src={member.img}
							alt={member.name}
							class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-95"
							on:error={handleImageError}
						/>
					</a>
					<h3 class="mb-2 text-xl font-semibold tracking-wide text-gray-800">{member.name}</h3>
					<p class="mb-2 font-medium text-blue-600">{member.role}</p>
					<p class="text-gray-600 italic">"{member.quote}"</p>
				</div>
			{/each}
		</div>
	</section>
</div>
