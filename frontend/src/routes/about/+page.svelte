<script lang="ts">
  function handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Ocultar la imagen si no carga
    img.style.display = 'none';
    // O mostrar un fondo gris con texto
    const container = img.parentElement;
    if (container) {
      container.style.backgroundColor = '#e5e7eb';
      container.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 text-2xl font-semibold">Sin foto</div>';
    }
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 
  <!-- Sección "Por qué existimos" -->
  <section class="mb-20">
    <div class="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
      <h2 class="text-3xl md:text-4xl font-light text-left mb-6 text-gray-800 tracking-wide">
        Por qué existimos
      </h2>
      
      <h1 class="text-2xl md:text-3xl font-serif text-center mb-10 text-gray-700 leading-tight">
        Ayudar no cambia el mundo entero,<br />
        pero sí el mundo de alguien.
      </h1>
      
      <div class="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-sm">
        <div class="prose prose-lg text-gray-600 space-y-4">
          <p class="text-xl leading-relaxed font-light">Creemos que ningún niño debería irse a dormir con hambre.</p>
          <p class="text-xl leading-relaxed font-light">Que ningún abuelo pase sus días en soledad, sin un abrazo, sin una palabra amable, sin una sonrisa.</p>
          <p class="text-xl leading-relaxed font-light">Que las escuelas no tengan que improvisar con lo que hay, sino que puedan enseñar con todo lo que necesitan.</p>
          <p class="text-xl leading-relaxed font-light">Que los hospitales no tengan que hacer milagros con lo mínimo, sino que cuenten con todo lo necesario para cuidar con dignidad.</p>
          <div class="my-8 border-l-4 border-gray-300 pl-6">
            <p class="text-xl leading-relaxed font-light italic">Conectando Corazones nace del deseo profundo de cambiar realidades.</p>
            <p class="text-xl leading-relaxed font-light italic">No desde un escritorio, sino desde el alma.</p>
          </div>
          <p class="text-xl leading-relaxed font-light">Queremos ser el puente entre quienes necesitan ayuda y quienes están dispuestos a darla.</p>
          <p class="text-xl leading-relaxed font-light">Porque la empatía no tiene fronteras, y el compromiso no entiende de excusas.</p>
          <div class="my-8 border-l-4 border-gray-300 pl-6">
            <p class="text-xl leading-relaxed font-light">Esta plataforma es un acto de amor.</p>
            <p class="text-xl leading-relaxed font-light">Es la mano que se extiende, el oído que escucha, el corazón que late junto al de otro.</p>
          </div>
          <p class="text-xl leading-relaxed font-medium text-gray-700">Porque cuando conectamos corazones, el mundo cambia. Y cambia para bien.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Sección "Misión, Visión y Valores" -->
  <section class="mb-20">
    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Misión, Visión y Valores</h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Misión -->
      <div class="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Misión</h3>
        <p class="text-gray-600">
          Conectar personas y organizaciones para crear un impacto positivo en la sociedad, facilitando la ayuda humanitaria y promoviendo la solidaridad.
        </p>
      </div>

      <!-- Visión -->
      <div class="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Visión</h3>
        <p class="text-gray-600">
          Ser la plataforma líder en Latinoamérica que transforme la manera en que las personas se ayudan mutuamente, creando una red de apoyo sostenible y efectiva.
        </p>
      </div>

      <!-- Valores -->
      <div class="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
        <div class="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Valores</h3>
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
    <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">Nuestro Equipo</h2>
    
    <div class="grid md:grid-cols-3 gap-8">
      <!-- Miembro 1 -->
      <div class="text-center">
        <div class="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
          <img src="/team/member1.jpg" alt="Alexis Julian Sklate" class="w-full h-full object-cover" on:error={handleImageError} />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Alexis Julian Sklate </h3>
        <p class="text-blue-600 mb-2">Socio</p>
        <p class="text-gray-600 italic">"La solidaridad es el lenguaje universal del corazón"</p>
      </div>

      <!-- Miembro 2 -->
      <div class="text-center">
        <div class="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
          <img src="/team/member2.jpg" alt="Marina Ana Milo" class="w-full h-full object-cover" on:error={handleImageError} />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Marina Ana Milo</h3>
        <p class="text-blue-600 mb-2">Socia</p>
         <p class="text-gray-600 italic">"A veces, un simple gesto de amor puede ser el milagro que alguien estaba esperando."</p>
      </div>

      <!-- Miembro 3 -->
      <div class="text-center">
        <div class="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
          <img src="/team/member3.jpg" alt="Martin Tomas Alvarez" class="w-full h-full object-cover" on:error={handleImageError} />
        </div>
        <h3 class="text-xl font-semibold mb-2 text-gray-800">Martin Tomas Alvarez</h3>
        <p class="text-blue-600 mb-2">Socio</p>
        <p class="text-gray-600 italic">"La empatía es el puente que conecta corazones"</p>
      </div>
    </div>
  </section>
</div>

<style>
  /* Estilos adicionales */
  .prose p {
    margin-bottom: 1.5rem;
  }
</style>