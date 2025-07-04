<script lang="ts">
  import { inView } from '$lib/actions/inView';
  import { onMount } from 'svelte';
  import 'aos/dist/aos.css';
  import AOS from 'aos';
  import '@fontsource/raleway/400.css';
  import '@fontsource/raleway/600.css';
  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const container = img.parentElement;
    if (container) {
      container.style.backgroundColor = '#e5e7eb';
      container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 text-2xl font-semibold">Sin foto</div>';
    }
  }
  // Animación para bloques
  let visibleBlocks: boolean[] = Array(9).fill(false);
  onMount(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-out-cubic',
    });
  });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-xl">

  <!-- Sección "Por qué existimos" -->
  <section class="mb-24">
    <div class="bg-white/80 backdrop-blur-md rounded-3xl p-8 md:p-14 shadow-2xl border border-blue-100 relative overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="w-72 h-72 bg-gradient-to-br from-blue-200/30 via-purple-200/20 to-transparent rounded-full blur-3xl absolute -top-24 -left-24"></div>
        <div class="w-56 h-56 bg-gradient-to-tr from-blue-100/30 via-pink-100/20 to-transparent rounded-full blur-2xl absolute -bottom-16 -right-16"></div>
      </div>
      <div class="flex justify-center mb-8">
        <span class="inline-block bg-gradient-to-r from-blue-500 via-blue-400 to-purple-400 text-white text-sm font-semibold px-6 py-2 rounded-full shadow-md tracking-wide uppercase letter-spacing-wide">
          Sobre Nosotros
        </span>
      </div>
     <div class="mx-auto mb-12 max-w-4xl text-center">
  <div class="relative inline-block overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform duration-500 hover:scale-95 aspect-[4/3] min-h-[320px] border-4 border-white/80">
    <img 
      src="/img/manosUnidas.jpg" 
      alt="Manos unidas"
      class="object-cover w-full h-full transition-all duration-500 hover:scale-105 hover:brightness-95"
      on:error={handleImageError}
      loading="lazy"
      decoding="async"
    />
  </div>
  <h1 class="mt-10 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
    <span class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md">
      ¿Por qué existimos?
    </span>
  </h1>
</div>

      <div class="max-w-3xl mx-auto flex flex-col gap-8 md:gap-10">
        {#each [
          'Creemos que ningún niño debería irse a dormir con hambre.',
          'Que ningún abuelo pase sus días en soledad, sin un abrazo, sin una palabra amable, sin una sonrisa.',
          'Que las escuelas no tengan que improvisar con lo que hay, sino que puedan enseñar con todo lo que necesitan.',
          'Que los hospitales no tengan que hacer milagros con lo mínimo, sino que cuenten con todo lo necesario para cuidar con dignidad.',
          'Conectando Corazones nace del deseo profundo de cambiar realidades.',
          'No desde un escritorio, sino desde el alma.',
          'Queremos ser el puente entre quienes necesitan ayuda y quienes están dispuestos a darla.',
          'Porque la empatía no tiene fronteras, y el compromiso no entiende de excusas.',
          'Esta plataforma es un acto de amor. Es la mano que se extiende, el oído que escucha, el corazón que late junto al de otro.',
          'Porque cuando conectamos corazones, el mundo cambia. Y cambia para bien.'
        ] as frase, i}
          <div
            data-aos="fade-up"
            data-aos-delay={i * 120}
            class="relative overflow-visible"
          >
            <blockquote
              class="border border-blue-200/40 rounded-3xl shadow-[0_4px_28px_0_#bbeafe20] px-7 py-8 md:px-10 md:py-10 text-lg md:text-2xl font-normal leading-relaxed italic text-center mx-auto max-w-2xl"
              class:bg-gradient-to-b={i % 2 === 0}
              class:from-[#e0f2fe]={i % 2 === 0}
              class:via-[#f0faff]={i % 2 === 0}
              class:to-[#e0f2fe]={i % 2 === 0}
              class:text-sky-700={i % 2 === 0}
              class:bg-white={i % 2 === 1}
              class:text-gray-500={i % 2 === 1}
            >
              <span class="absolute -left-4 -top-2 text-2xl md:text-3xl text-blue-200/60 select-none">“</span>
              {frase}
              <span class="text-2xl md:text-3xl text-blue-200/60 select-none">”</span>
            </blockquote>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Sección "Misión, Visión y Valores" -->
  <section class="mb-24">
    <h2 class="text-3xl font-bold text-center mb-14">
      <span class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md">
        Misión, Visión y Valores
      </span>
    </h2>
    <div class="grid md:grid-cols-3 gap-10">
      <!-- Misión -->
      <div class="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 border-t-4 border-blue-200 group">
        <div class="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 group-hover:text-blue-800 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800 tracking-wide">Misión</h3>
        <p class="text-gray-600">
          Conectar personas y organizaciones para crear un impacto positivo en la sociedad, facilitando la ayuda humanitaria y promoviendo la solidaridad.
        </p>
      </div>

      <!-- Visión -->
      <div class="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 border-t-4 border-green-200 group">
        <div class="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600 group-hover:text-green-800 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800 tracking-wide">Visión</h3>
        <p class="text-gray-600">
          Ser el puente que transforma la solidaridad local en un impacto colectivo que cambie vidas y fortalezca comunidades.
        </p>
      </div>

      <!-- Valores -->
      <div class="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 border-t-4 border-purple-200 group">
        <div class="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600 group-hover:text-purple-800 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800 tracking-wide">Valores</h3>
        <ul class="text-gray-600 space-y-2">
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
    <h2 class="text-3xl font-bold text-center mb-10">
      <span class="bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent drop-shadow-md">
        Nuestro Equipo
      </span>
    </h2>
    <div class="max-w-4xl mx-auto mb-14 text-gray-700 text-lg leading-relaxed bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8 md:p-10 rounded-2xl shadow-md space-y-4 text-justify">
      <p>
        Somos tres estudiantes de la Universidad Tecnológica Nacional – Facultad Regional Rosario, convencidos de que la tecnología puede ser mucho más que líneas de código: puede ser el hilo invisible que une corazones dispuestos a cambiar realidades.
      </p>
      <p>
        <strong>Conectando Corazones</strong> nació como nuestro proyecto final, pero va más allá de una entrega académica. Es una iniciativa que busca potenciar las buenas acciones, creando herramientas digitales simples, seguras y efectivas que conecten a quienes quieren colaborar con quienes más lo necesitan.
      </p>
      <p>
        Porque la tecnología, cuando se pone al servicio de la solidaridad, se convierte en una herramienta poderosa para el cambio social.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-10">
      {#each [
        { name: "Alexis Julian Sklate", role: "Socio", quote: "La solidaridad es el lenguaje universal del corazón", img: "/team/member1.jpg" },
        { name: "Marina Ana Milo", role: "Socia", quote: "A veces, un simple gesto de amor puede ser el milagro que alguien estaba esperando.", img: "/team/member2.jpg" },
        { name: "Martin Tomas Alvarez", role: "Socio", quote: "La empatía es el puente que conecta corazones", img: "/team/member3.jpg" }
      ] as member}
      <div class="text-center hover:shadow-2xl hover:scale-105 transition-transform duration-500 bg-white/90 rounded-2xl p-6 shadow-xl border-t-4 border-blue-100 group">
        <div class="w-40 h-40 mx-auto mb-4 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-white shadow-lg border-4 border-white/80 group-hover:scale-105 transition-transform duration-300">
          <img src={member.img} alt={member.name} class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-95" on:error={handleImageError} />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800 tracking-wide">{member.name}</h3>
        <p class="text-blue-600 mb-2 font-medium">{member.role}</p>
        <p class="text-gray-600 italic">"{member.quote}"</p>
      </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .prose p {
    margin-bottom: 1.5rem;
  }
</style>
