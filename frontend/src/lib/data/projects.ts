import type { Project } from '$lib/models/Project';

export const projects: Project[] = [
  {
    id: 1,
    titulo: "Un libro, un sueño",
    descripcion: "Una escuela rural necesita libros para su biblioteca escolar. Con tu ayuda, podemos proporcionar materiales educativos que inspiren a los niños a soñar más allá de su entorno.",
    institucion: "Escuela Esperanza",
    fechaInicio: "2025-07-15",
    fechaCierre: "2025-10-30",
    provincia: "Santa Fe",
    ciudad: "Rosario",
    estado: "Activo",
    urgencia: "Alta",
    beneficiarios: 150,
    deadline: "2025-06-30",
    imagen: "/img/proyectos-1.webp",
    ubicacion: "Rosario, Santa Fe",
    contacto: {
      "responsable": "Prof. Marta Fernández",
      "telefono": "+54 341 123-4567",
      "email": "mfernandez@escuelaesperanza.edu.ar",
      "sitioWeb": "escuelaesperanza.edu.ar"
    },
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "libros",
        "objetivo": 200,
        "cantidadEstimada": 180,
        "cantidadRecaudada": 150
      }
    ]
  },
  {
    "id": 2,
    "titulo": "Comedores con alma",
    "descripcion": "Un comedor comunitario en una zona urbana marginal requiere alimentos no perecederos para alimentar a más de 50 familias semanales. Tu contribución garantizará que nadie pase hambre.",
    "institucion": "Comedor Los Pinos",
    "fechaInicio": "2025-07-01",
    "fechaCierre": "2025-10-30",
    "provincia": "Buenos Aires",
    "ciudad": "La Plata",
    "estado": "Activo",
    "urgencia": "Media",
    "beneficiarios": 75,
    "deadline": "2025-07-30",
    "imagen": "/img/proyectos-2.webp",
    "ubicacion": "La Plata, Buenos Aires",
    "objetivos": [
      {
        unidad: "dinero",
        especie: "ARS",
        objetivo: 50000,
        cantidadEstimada: 0,
        cantidadRecaudada: 0
      },
      {
        "unidad": "materiales",
        "especie": "kilogramos",
        "objetivo": 300,
        "cantidadEstimada": 200,
        "cantidadRecaudada": 100
      },
      {
        "unidad": "voluntarios",
        "especie": "repartidores",
        "objetivo": 10,
        "cantidadEstimada": 10,
        "cantidadRecaudada": 10
      }
    ]
  },
  {
    "id": 3,
    "titulo": "Hogar de sonrisas",
    "descripcion": "Un hogar de niños con discapacidades necesita voluntarios para organizar talleres artísticos y recreativos. Tu tiempo y talento pueden marcar una diferencia significativa en sus vidas.",
    "institucion": "Fundación Siempre",
    "fechaInicio": "2025-03-01",
    "fechaCierre": "2025-08-15",
    "provincia": "Córdoba",
    "ciudad": "Córdoba Capital",
    "estado": "En ejecución",
    "urgencia": "Baja",
    "beneficiarios": 80,
    "deadline": "2025-08-15",
    "imagen": "/img/proyectos-3.webp",
    "ubicacion": "Córdoba Capital, Córdoba",
    "objetivos": [
      {
        "unidad": "voluntarios",
        "especie": "talleristas",
        "objetivo": 20,
        "cantidadEstimada": 30,
        "cantidadRecaudada": 25
      }
    ]
  },
  {
    "id": 4,
    "titulo": "Equipamiento Médico Hospitalario",
    "descripcion": "Adquisición de equipos médicos esenciales para el hospital público de la comunidad: desfibrilador, monitor multiparamétrico y bomba de infusión.",
    "institucion": "Hospital General San José",
    "fechaInicio": "2025-01-01",
    "fechaCierre": "2025-05-31",
    "provincia": "Mendoza",
    "ciudad": "Mendoza Capital",
    "estado": "Finalizado",
    "urgencia": "Alta",
    "beneficiarios": 500,
    "deadline": "2024-05-31",
    "imagen": "/img/proyectos-4.webp",
    "ubicacion": "Mendoza Capital, Mendoza",
    "objetivos": [
      {
        "unidad": "dinero",
        "especie": "pesos",
        "objetivo": 75000000,
        "cantidadEstimada": 68000000,
        "cantidadRecaudada": 50000000
      }
    ]
  },
  {
    id: 5,
    titulo: "Apoyo Escolar Comunitario",
    descripcion: "Necesitamos docentes y estudiantes universitarios para dar clases de apoyo en matemática, lengua y ciencias a niños en situación de vulnerabilidad social.",
    institucion: "Instituto de Formación Laboral",
    fechaInicio: "2025-04-01",
    fechaCierre: "2025-10-30",
    provincia: "Tucumán",
    ciudad: "San Miguel de Tucumán",
    estado: "En ejecución",
    urgencia: "Media",
    beneficiarios: 60,
    deadline: "2024-10-30",
    imagen: "/img/proyectos-5.webp",
    ubicacion: "San Miguel de Tucumán, Tucumán",
    objetivos: [
      {
        "unidad": "voluntarios",
        "especie": "docentes",
        "objetivo": 8,
        "cantidadEstimada": 3,
        "cantidadRecaudada": 2
      }
    ]
  },
  {
    id: 6,
    titulo: 'Alimentos No Perecederos',
    descripcion:
      'Recolección de alimentos no perecederos (arroz, fideos, aceite, conservas) para abastecer comedores comunitarios durante el invierno.',
    institucion: 'Red de Comedores Unidos',
    fechaInicio: '2025-02-15',
    fechaCierre: '2025-12-31',
    provincia: 'Buenos Aires',
    ciudad: 'Quilmes',
    estado: 'En ejecución',
    urgencia: 'Alta',
    beneficiarios: 200,
    deadline: '2024-12-31',
    imagen: '/img/proyectos-6.webp',
    ubicacion: 'Quilmes, Buenos Aires',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "kilogramos",
        "objetivo": 500,
        "cantidadEstimada": 320,
        "cantidadRecaudada": 250
      }
    ]
  },
  {
    id: 7,
    titulo: 'Ropa de Abrigo Invernal',
    descripcion:
      'Se solicitan camperas, buzos, mantas y frazadas en buen estado para personas en situación de calle durante los meses de frío.',
    institucion: 'Fundación Calor Humano',
    fechaInicio: '2025-03-15',
    fechaCierre: '2025-06-30',
    provincia: 'Buenos Aires',
    ciudad: 'CABA',
    estado: 'En ejecución',
    urgencia: 'Alta',
    beneficiarios: 100,
    deadline: '2024-06-30',
    imagen: '/img/proyectos-7.webp',
    ubicacion: 'CABA, Buenos Aires',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "prendas",
        "objetivo": 100,
        "cantidadEstimada": 120,
        "cantidadRecaudada": 100
      }
    ]
  },
  {
    id: 8,
    titulo: 'Cuidadores de Adultos Mayores',
    descripcion:
      'Buscamos voluntarios para acompañar y brindar cuidados básicos a adultos mayores en hogar geriátrico. Se requiere disponibilidad de tiempo y paciencia.',
    institucion: 'Hogar Santa Teresa',
    fechaInicio: '2025-01-20',
    fechaCierre: '2025-12-20',
    provincia: 'Santa Fe',
    ciudad: 'Santa Fe Capital',
    estado: 'En ejecución',
    urgencia: 'Media',
    beneficiarios: 45,
    deadline: '2024-12-20',
    imagen: '/img/proyectos-8.webp',
    ubicacion: 'Santa Fe Capital, Santa Fe',
    objetivos: [
      {
        unidad: "voluntarios",
        especie: "voluntarios",
        objetivo: 15,
        cantidadEstimada: 9,
        cantidadRecaudada: 6
      },
      {
        unidad: "dinero",
        especie: "ARS",
        objetivo: 200000,
        cantidadEstimada: 50000,
        cantidadRecaudada: 30000
      }
    ]
  },
  {
    id: 9,
    titulo: 'Computadoras para Escuela Rural',
    descripcion:
      'La escuela rural necesita equipos informáticos para que los alumnos puedan acceder a herramientas digitales. Buscamos computadoras en buen estado.',
    institucion: 'Escuela Rural N° 123',
    fechaInicio: '2025-02-10',
    fechaCierre: '2025-05-15',
    provincia: 'Salta',
    ciudad: 'Cafayate',
    estado: 'Finalizado',
    urgencia: 'Media',
    beneficiarios: 85,
    deadline: '2024-07-15',
    imagen: '/img/proyectos-9.webp',
    ubicacion: 'Cafayate, Salta',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "computadoras",
        "objetivo": 20,
        "cantidadEstimada": 6,
        "cantidadRecaudada": 6
      }
    ]
  },
  {
    id: 10,
    titulo: 'Becas Universitarias',
    descripcion:
      'Programa de becas para estudiantes de bajos recursos que desean acceder a la educación superior. Cada beca cubre matrícula y materiales por un año.',
    institucion: 'Fundación Educación para Todos',
    fechaInicio: '2025-02-20',
    fechaCierre: '2025-11-30',
    provincia: 'Neuquén',
    ciudad: 'Neuquén Capital',
    estado: 'En ejecución',
    urgencia: 'Baja',
    beneficiarios: 24,
    deadline: '2024-11-30',
    imagen: '/img/proyectos-10.webp',
    ubicacion: 'Neuquén Capital, Neuquén',
    objetivos: [
      {
        "unidad": "dinero",
        "especie": "ARS",
        "objetivo": 12000000,
        "cantidadEstimada": 4500000,
        "cantidadRecaudada": 3000000
      }
    ]
  }
];
