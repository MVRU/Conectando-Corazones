<script lang="ts">
  import { writable, derived } from 'svelte/store';

  const searchQuery = writable('');

  const faqs = [
    {
      category: 'Participación e Inscripción',
      questions: [
        {
          q: '¿Quién puede registrarse en la plataforma?',
          a: 'Cualquier institución que necesite ayuda o cualquier colaborador (persona u organización) interesado en brindarla.'
        },
        {
          q: '¿Cómo creo una cuenta en Conectando Corazones?',
          a: 'Primero seleccionás el tipo de usuario (Institución o Colaborador) y luego completás un formulario de registro para crear tu cuenta y acceder a todas las funcionalidades de la plataforma.'
        },
        {
          q: '¿Existen diferentes tipos de usuario?',
          a: 'Sí, podés registrarte como Institución (para crear proyectos y recibir colaboración) o como Colaborador (para postularte para ayudar en los proyectos disponibles).'
        },
        {
          q: '¿Puedo cambiar de tipo de usuario una vez registrado?',
          a: 'No, no se puede cambiar de tipo de usuario una vez registrado.'
        },
        {
          q: '¿Puedo proponer un proyecto si no soy una institución?',
          a: 'Por el momento, solo las instituciones registradas pueden publicar proyectos, pero podés sugerir ideas al equipo de Conectando Corazones..'
        },
      ]
    },
    {
      category: 'Tipos de Ayuda y Proyectos',
      questions: [
        {
          q: '¿Qué tipo de proyectos puedo encontrar en la plataforma?',
          a: 'Encontrarás proyectos de diferentes áreas, como educación, asistencia social, cultura, medio ambiente, salud y otras iniciativas orientadas a mejorar la calidad de vida de comunidades vulnerables.'
        },
        {
          q: '¿Puedo colaborar en más de un proyecto a la vez?',
          a: 'Sí, podés participar en todos los proyectos que desees, siempre que cumplas con los requerimientos y tu disponibilidad lo permita.'
        },
        {
          q: '¿Cómo sé si un proyecto sigue activo?',
          a: 'Cada proyecto tiene un estado actualizado en la plataforma para indicar si sigue activo, está en búsqueda de colaboradores o si ya concluyó.'
        }
      ]
    },
    {
      category: 'Postulación y Participación',
      questions: [
        {
          q: '¿Qué sucede después de enviar mi postulación?',
          a: 'La institución responsable del proyecto revisará todas las postulaciones recibidas y seleccionará a los colaboradores que mejor se adapten a los requerimientos de la iniciativa.'
        },
        {
          q: '¿Puedo cambiar o cancelar mi postulación?',
          a: 'Sí, podés editar o cancelar tu postulación en cualquier momento antes de que la institución la revise.'
        },
        {
          q: '¿Recibiré una notificación si soy seleccionado para colaborar?',
          a: 'Sí, recibirás una notificación por correo electrónico y dentro de la plataforma para confirmarte que tu postulación fue aceptada.'
        },
        {
          q: '¿Qué responsabilidades asumo al participar en un proyecto?',
          a: 'Te comprometés a cumplir con las actividades acordadas, respetar los plazos y colaborar de manera responsable para garantizar que el proyecto alcance sus objetivos.'
        }
      ]
    },
    {
      category: 'Costos y Políticas de la Plataforma',
      questions: [
        {
          q: '¿La plataforma tiene costo para los usuarios?',
          a: 'No, tanto para instituciones como para colaboradores, el registro y uso de la plataforma son completamente gratuitos.'
        },
        {
          q: '¿Existen otros costos involucrados?',
          a: 'La plataforma no cobra ninguna comisión por donaciones o colaboraciones. Todos los aportes llegan directamente a la institución correspondiente.'
        },
        {
          q: '¿Cuáles son las políticas de la comunidad?',
          a: 'Todos los usuarios deben actuar con responsabilidad, respeto y honestidad, promoviendo un ambiente seguro y colaborativo para todas las partes involucradas.'
        },
        {
          q: '¿Puedo denunciar comportamientos inadecuados?',
          a: 'Sí, cualquier usuario puede reportar situaciones que no cumplan con las políticas de la comunidad a través del formulario de contacto o la sección de soporte.'
        }
      ]
    },
  {
      category: 'Seguridad y Privacidad',
      questions: [
        {
          q: '¿Qué pasa con mis datos personales?',
          a: 'Los datos que proporcionás son utilizados únicamente para el funcionamiento de la plataforma y nunca se comparten con terceros sin tu consentimiento.'
        },
        {
          q: '¿Mi información de contacto es visible para otros usuarios?',
          a: 'No. Solo se comparte la información estrictamente necesaria entre las partes cuando una colaboración es confirmada.'
        },
        {
          q: '¿Cómo puedo eliminar mi cuenta?',
          a: 'Podés solicitar la baja de tu cuenta en cualquier momento desde tu perfil o contactando a soporte.'
        },
      ]
    },
]

  const filteredFaqs = derived([searchQuery], ([$searchQuery]) => {
    if (!$searchQuery.trim()) return faqs;

    const lowerQuery = $searchQuery.toLowerCase();
    return faqs
      .map(category => {
        const questions = category.questions.filter(
          q => q.q.toLowerCase().includes(lowerQuery) || q.a.toLowerCase().includes(lowerQuery)
        );
        return { ...category, questions };
      })
      .filter(category => category.questions.length > 0);
  });
</script>

<div class="max-w-3xl mx-auto p-6 space-y-8">
  <h1 class="text-3xl font-bold text-center bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent">Preguntas Frecuentes</h1>

  <div class="relative">
    <input
      type="text"
      placeholder="🔍  Buscar en las preguntas..."
      class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400"
      on:input={(e) => searchQuery.set((e.target as HTMLInputElement).value)}
    />
  </div>

  {#each $filteredFaqs as category}
    <div class="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 class="text-2xl font-semibold border-b border-gray-200 pb-2 bg-gradient-to-r from-[#007fff] via-[#68b4ff] to-[#007fff] bg-clip-text text-transparent">{category.category}</h2>
      <div class="space-y-3">
        {#each category.questions as item}
          <details class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition group">
            <summary class="cursor-pointer text-gray-800 font-medium text-lg flex justify-between items-center">
              {item.q}
              <svg
                class="ml-2 w-5 h-5 text-blue-500 transform transition-transform duration-200 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p class="mt-3 text-gray-600 text-base leading-relaxed">{item.a}</p>
          </details>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  details summary {
    list-style: none;
  }
  details summary::-webkit-details-marker {
    display: none;
  }
</style>
