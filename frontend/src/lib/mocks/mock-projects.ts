import type { Project } from '$lib/types/Project';

export const projects: Project[] = [
  {
    id: 1,
    titulo: "Un libro, un sueño",
    descripcion: "Una escuela rural necesita libros para su biblioteca escolar. Con tu ayuda, podemos proporcionar materiales educativos que inspiren a los niños a soñar más allá de su entorno.",
    institucion: { id: "1", razonSocial: "Escuela Esperanza" },
    fechaInicio: "2025-07-15",
    fechaCierre: "2025-10-30",
    provincia: "Santa Fe",
    ciudad: "Rosario",
    estado: "Abierto",
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
        "cantidad": 150
      }
    ]
  },
  {
    id: 2,
    titulo: "Comedores con alma",
    "descripcion": "Un comedor comunitario en una zona urbana marginal requiere alimentos no perecederos para alimentar a más de 50 familias semanales. Tu contribución garantizará que nadie pase hambre.",
    institucion: { id: "2", razonSocial: "Comedor Los Pinos" },
    "fechaInicio": "2025-07-01",
    "fechaCierre": "2025-10-30",
    "provincia": "Buenos Aires",
    "ciudad": "La Plata",
    "estado": "Abierto",
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
        cantidad: 0
      },
      {
        "unidad": "materiales",
        "especie": "kilogramos",
        "objetivo": 300,
        "cantidad": 100
      },
      {
        "unidad": "voluntarios",
        "especie": "repartidores",
        "objetivo": 10,
        "cantidad": 10
      }
    ]
  },
  {
    "id": 3,
    "titulo": "Hogar de sonrisas",
    "descripcion": "Un hogar de niños con discapacidades necesita voluntarios para organizar talleres artísticos y recreativos. Tu tiempo y talento pueden marcar una diferencia significativa en sus vidas.",
    institucion: { id: "3", razonSocial: "Fundación Siempre" },
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
        "cantidad": 25
      }
    ]
  },
  {
    "id": 4,
    "titulo": "Equipamiento Médico Hospitalario",
    "descripcion": "Adquisición de equipos médicos esenciales para el hospital público de la comunidad: desfibrilador, monitor multiparamétrico y bomba de infusión.",
    institucion: { id: "4", razonSocial: "Hospital General San José" },
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
        "cantidad": 50000000
      }
    ]
  },
  {
    id: 5,
    titulo: "Apoyo Escolar Comunitario",
    descripcion: "Necesitamos docentes y estudiantes universitarios para dar clases de apoyo en matemática, lengua y ciencias a niños en situación de vulnerabilidad social.",
    institucion: { id: "5", razonSocial: "Instituto de Formación Laboral" },
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
        "cantidad": 2
      }
    ]
  },
  {
    id: 6,
    titulo: 'Alimentos No Perecederos',
    descripcion:
      'Recolección de alimentos no perecederos (arroz, fideos, aceite, conservas) para abastecer comedores comunitarios durante el invierno.',
    institucion: { id: "6", razonSocial: "Comedor Los Pinos" },
    fechaInicio: '2025-02-15',
    fechaCierre: '2025-12-31',
    provincia: 'Buenos Aires',
    ciudad: 'Quilmes',
    estado: 'Abierto',
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
        "cantidad": 250
      },
      {
        "unidad": "voluntarios",
        "especie": "repartidores",
        "objetivo": 15,
        "cantidad": 8
      }
    ]
  },
  {
    id: 7,
    titulo: 'Ropa de Abrigo Invernal',
    descripcion:
      'Se solicitan camperas, buzos, mantas y frazadas en buen estado para personas en situación de calle durante los meses de frío.',
    institucion: { id: "7", razonSocial: "Fundación Calor Humano" },
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
        "cantidad": 100
      }
    ]
  },
  {
    id: 8,
    titulo: 'Cuidadores de Adultos Mayores',
    descripcion:
      'Buscamos voluntarios para acompañar y brindar cuidados básicos a adultos mayores en hogar geriátrico. Se requiere disponibilidad de tiempo y paciencia.',
    institucion: { id: "8", razonSocial: "Hogar Santa Teresa" },
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
        cantidad: 6
      },
      {
        unidad: "dinero",
        especie: "ARS",
        objetivo: 200000,
        cantidad: 30000
      }
    ]
  },
  {
    id: 9,
    titulo: 'Computadoras para Escuela Rural',
    descripcion:
      'La escuela rural necesita equipos informáticos para que los alumnos puedan acceder a herramientas digitales. Buscamos computadoras en buen estado.',
    institucion: { id: "9", razonSocial: "Escuela Rural N° 123" },
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
        "cantidad": 6
      }
    ]
  },
  {
    id: 10,
    titulo: 'Becas Universitarias',
    descripcion:
      'Programa de becas para estudiantes de bajos recursos que desean acceder a la educación superior. Cada beca cubre matrícula y materiales por un año.',
    institucion: { id: "10", razonSocial: "Fundación Educación para Todos" },
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
        "cantidad": 3000000
      }
    ]
  },
  {
    id: 11,
    titulo: 'Refugio para Animales Abandonados',
    descripcion: 'Refugio que necesita alimento para perros y gatos, medicamentos veterinarios y voluntarios para el cuidado diario de más de 120 animales rescatados.',
    institucion: { id: "11", razonSocial: "Refugio Patitas Felices" },
    fechaInicio: '2025-01-15',
    fechaCierre: '2025-12-31',
    provincia: 'Entre Ríos',
    ciudad: 'Paraná',
    estado: 'Abierto',
    urgencia: 'Alta',
    beneficiarios: 120,
    deadline: '2025-12-31',
    imagen: '/img/proyectos-1.webp',
    ubicacion: 'Paraná, Entre Ríos',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "kilogramos de alimento",
        "objetivo": 800,
        "cantidad": 200
      },
      {
        "unidad": "voluntarios",
        "especie": "cuidadores",
        "objetivo": 12,
        "cantidad": 4
      }
    ]
  },
  {
    id: 12,
    titulo: 'Taller de Oficios para Jóvenes',
    descripcion: 'Centro de formación laboral que busca herramientas, materiales y instructores para enseñar carpintería, electricidad y plomería a jóvenes en situación de vulnerabilidad.',
    institucion: { id: "12", razonSocial: "Centro de Formación Laboral San Martín" },
    fechaInicio: '2024-08-01',
    fechaCierre: '2024-12-15',
    provincia: 'Misiones',
    ciudad: 'Posadas',
    estado: 'Finalizado',
    urgencia: 'Media',
    beneficiarios: 45,
    deadline: '2024-12-15',
    imagen: '/img/proyectos-2.webp',
    ubicacion: 'Posadas, Misiones',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "herramientas",
        "objetivo": 50,
        "cantidad": 50
      },
      {
        "unidad": "voluntarios",
        "especie": "instructores",
        "objetivo": 6,
        "cantidad": 6
      }
    ]
  },
  {
    id: 13,
    titulo: 'Huerta Comunitaria Urbana',
    descripcion: 'Proyecto de agricultura urbana que necesita semillas, herramientas de jardinería y voluntarios para enseñar a familias del barrio a cultivar sus propios alimentos.',
    institucion: { id: "13", razonSocial: "Cooperativa Verde Esperanza" },
    fechaInicio: '2025-03-01',
    fechaCierre: '2025-10-31',
    provincia: 'Río Negro',
    ciudad: 'Bariloche',
    estado: 'En ejecución',
    urgencia: 'Baja',
    beneficiarios: 35,
    deadline: '2025-10-31',
    imagen: '/img/proyectos-3.webp',
    ubicacion: 'Bariloche, Río Negro',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "herramientas y semillas",
        "objetivo": 100,
        "cantidad": 60
      },
      {
        "unidad": "voluntarios",
        "especie": "educadores",
        "objetivo": 8,
        "cantidad": 3
      }
    ]
  },
  {
    id: 14,
    titulo: 'Apoyo Nutricional Infantil',
    descripcion: 'Programa que brinda desayunos y meriendas nutritivas a niños de escuelas primarias en zonas carenciadas. Necesitamos alimentos, utensilios y apoyo económico.',
    institucion: { id: "14", razonSocial: "Fundación Nutrición Infantil" },
    fechaInicio: '2025-02-01',
    fechaCierre: '2025-12-20',
    provincia: 'Chaco',
    ciudad: 'Resistencia',
    estado: 'Abierto',
    urgencia: 'Alta',
    beneficiarios: 280,
    deadline: '2025-12-20',
    imagen: '/img/proyectos-4.webp',
    ubicacion: 'Resistencia, Chaco',
    objetivos: [
      {
        "unidad": "dinero",
        "especie": "ARS",
        "objetivo": 45000000,
        "cantidad": 12000000
      },
      {
        "unidad": "materiales",
        "especie": "kilogramos de alimentos",
        "objetivo": 600,
        "cantidad": 150
      }
    ]
  },
  {
    id: 15,
    titulo: 'Biblioteca Digital Rural',
    descripcion: 'Equipamiento de biblioteca rural con computadoras, tablets y conexión a internet para que estudiantes accedan a recursos educativos digitales.',
    institucion: { id: "15", razonSocial: "Escuela Rural Digital N° 45" },
    fechaInicio: '2024-06-01',
    fechaCierre: '2024-11-30',
    provincia: 'La Pampa',
    ciudad: 'General Pico',
    estado: 'Finalizado',
    urgencia: 'Media',
    beneficiarios: 95,
    deadline: '2024-11-30',
    imagen: '/img/proyectos-5.webp',
    ubicacion: 'General Pico, La Pampa',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "equipos informáticos",
        "objetivo": 15,
        "cantidad": 15
      },
      {
        "unidad": "dinero",
        "especie": "ARS",
        "objetivo": 8000000,
        "cantidad": 8000000
      }
    ]
  },
  {
    id: 16,
    titulo: 'Capacitación en Microemprendimientos',
    descripcion: 'Talleres de formación en habilidades empresariales para mujeres jefas de hogar. Incluye capacitación en marketing digital, contabilidad básica y desarrollo de productos.',
    institucion: { id: "16", razonSocial: "Asociación Mujeres Emprendedoras" },
    fechaInicio: '2025-04-15',
    fechaCierre: '2025-09-30',
    provincia: 'Jujuy',
    ciudad: 'San Salvador de Jujuy',
    estado: 'En ejecución',
    urgencia: 'Media',
    beneficiarios: 55,
    deadline: '2025-09-30',
    imagen: '/img/proyectos-6.webp',
    ubicacion: 'San Salvador de Jujuy, Jujuy',
    objetivos: [
      {
        "unidad": "voluntarios",
        "especie": "capacitadores",
        "objetivo": 10,
        "cantidad": 7
      },
      {
        "unidad": "materiales",
        "especie": "materiales didácticos",
        "objetivo": 80,
        "cantidad": 40
      }
    ]
  },
  {
    id: 17,
    titulo: 'Centro de Día para Adultos Mayores',
    descripcion: 'Centro que brinda actividades recreativas, seguimiento médico y alimentación para adultos mayores en situación de soledad. Necesitamos equipamiento médico y voluntarios.',
    institucion: { id: "17", razonSocial: "Centro de Día Los Abuelos" },
    fechaInicio: '2025-01-08',
    fechaCierre: '2025-12-15',
    provincia: 'Catamarca',
    ciudad: 'San Fernando del Valle de Catamarca',
    estado: 'Abierto',
    urgencia: 'Baja',
    beneficiarios: 65,
    deadline: '2025-12-15',
    imagen: '/img/proyectos-7.webp',
    ubicacion: 'San Fernando del Valle de Catamarca, Catamarca',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "equipamiento médico",
        "objetivo": 25,
        "cantidad": 8
      },
      {
        "unidad": "voluntarios",
        "especie": "acompañantes",
        "objetivo": 20,
        "cantidad": 12
      }
    ]
  },
  {
    id: 18,
    titulo: 'Programa de Reciclaje Comunitario',
    descripcion: 'Iniciativa para establecer puntos de reciclaje en el barrio, educar sobre separación de residuos y crear fuentes de trabajo para recicladores urbanos.',
    institucion: { id: "18", razonSocial: "EcoBarrio Verde" },
    fechaInicio: '2024-10-01',
    fechaCierre: '2025-03-31',
    provincia: 'San Luis',
    ciudad: 'San Luis',
    estado: 'Finalizado',
    urgencia: 'Baja',
    beneficiarios: 150,
    deadline: '2025-03-31',
    imagen: '/img/proyectos-8.webp',
    ubicacion: 'San Luis, San Luis',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "contenedores y herramientas",
        "objetivo": 30,
        "cantidad": 30
      },
      {
        "unidad": "voluntarios",
        "especie": "educadores ambientales",
        "objetivo": 5,
        "cantidad": 5
      }
    ]
  },
  {
    id: 19,
    titulo: 'Apoyo Escolar para Niños con Discapacidad',
    descripcion: 'Programa de integración escolar que necesita material didáctico adaptado, equipamiento especializado y profesionales para acompañar a niños con discapacidades.',
    institucion: { id: "19", razonSocial: "Fundación Incluir" },
    fechaInicio: '2025-03-10',
    fechaCierre: '2025-12-10',
    provincia: 'Formosa',
    ciudad: 'Formosa',
    estado: 'Abierto',
    urgencia: 'Alta',
    beneficiarios: 42,
    deadline: '2025-12-10',
    imagen: '/img/proyectos-9.webp',
    ubicacion: 'Formosa, Formosa',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "material didáctico adaptado",
        "objetivo": 100,
        "cantidad": 25
      },
      {
        "unidad": "voluntarios",
        "especie": "profesionales especializados",
        "objetivo": 8,
        "cantidad": 2
      },
      {
        "unidad": "dinero",
        "especie": "ARS",
        "objetivo": 15000000,
        "cantidad": 4000000
      }
    ]
  },
  {
    id: 20,
    titulo: 'Orquesta Juvenil Comunitaria',
    descripcion: 'Proyecto musical que busca instrumentos, partituras y maestros de música para formar una orquesta con jóvenes del barrio y brindarles una alternativa cultural.',
    institucion: { id: "20", razonSocial: "Conservatorio Popular Música para Todos" },
    fechaInicio: '2025-02-05',
    fechaCierre: '2025-11-25',
    provincia: 'Santiago del Estero',
    ciudad: 'Santiago del Estero',
    estado: 'En ejecución',
    urgencia: 'Media',
    beneficiarios: 38,
    deadline: '2025-11-25',
    imagen: '/img/proyectos-10.webp',
    ubicacion: 'Santiago del Estero, Santiago del Estero',
    objetivos: [
      {
        "unidad": "materiales",
        "especie": "instrumentos musicales",
        "objetivo": 25,
        "cantidad": 8
      },
      {
        "unidad": "voluntarios",
        "especie": "profesores de música",
        "objetivo": 4,
        "cantidad": 1
      }
    ]
  }
];
