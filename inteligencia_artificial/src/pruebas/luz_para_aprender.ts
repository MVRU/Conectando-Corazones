import type { ProjectReportContext } from "../types.js";

export const luzParaAprenderContext: ProjectReportContext = {
  project: {
    id: "p-2025",
    legacyNumericId: 1,
    title: "Luz para Aprender",
    tagline: "Iluminación segura y eficiente para la Escuela Esperanza",
    description:
      "En la Escuela Esperanza, cada día los chicos y chicas estudian casi a oscuras. Las lámparas se quemaron y el edificio no cuenta con una instalación eléctrica segura. Este proyecto lleva nueva iluminación LED y cableado seguro a todas las aulas, creando un ambiente digno y luminoso para más de 200 alumnos.",
    categories: ["Apoyo ante una crisis", "Educación"],
    beneficiaries: {
      direct: 200,
      summary:
        "200 estudiantes y 18 docentes acceden ahora a aulas con iluminación segura, reduciendo riesgos eléctricos y mejorando las condiciones de estudio.",
    },
    location: "Escuela Esperanza · Rosario, Santa Fe, Argentina",
    institution: {
      name: "Escuela Esperanza",
      sector: "Educación primaria",
      representative: "Patricia González (DNI 23.456.789)",
      contactEmail: "patricia.gonzalez@escuelaesperanza.org",
      contactPhone: "+54 9 341 555 1234",
    },
    timeline: [
      {
        label: "Proyecto creado",
        date: "2025-03-01",
        notes: "Publicación en plataforma y difusión a potenciales aliados.",
      },
      {
        label: "Cierre de postulaciones",
        date: "2025-08-01",
        notes: "Se consolidaron colaboraciones clave con aliados técnicos y donantes.",
      },
      {
        label: "Intervención principal",
        date: "2025-11-03",
        notes: "Instalación de cableado y luminarias con apoyo de voluntarios UTN FRRo.",
      },
      {
        label: "Solicitud de cierre",
        date: "2025-11-12",
        notes: "Colaboradores validaron evidencias finales y se inició el reporte de cierre.",
      },
    ],
  },
  closure: {
    readinessLabel: "Los 4 colaboradores validaron las evidencias finales.",
    progressPercent: 100,
    objectives: [
      {
        id: "tableros-conexion",
        description: "Tableros de conexión instalados",
        unit: "unidades",
        target: 3,
        achieved: 3,
        evidenceSummary:
          "Acta de instalación firmada por Lumina Cooperativa y fotografías del tablero principal.",
      },
      {
        id: "interruptores-seguridad",
        description: "Interruptores de seguridad certificados",
        unit: "unidades",
        target: 6,
        achieved: 6,
        evidenceSummary: "Certificados IRAM y comprobantes de compra adjuntos por Sembrar Futuro.",
      },
      {
        id: "cableado-ignifugo",
        description: "Cableado ignífugo instalado",
        unit: "metros",
        target: 50,
        achieved: 50,
        evidenceSummary: "Informe técnico con pruebas de continuidad y resistencia.",
      },
      {
        id: "lamparas-led",
        description: "Inversión para lámparas LED",
        unit: "ARS",
        target: 180000,
        achieved: 180000,
        evidenceSummary: "Comprobante bancario y remito de recepción en Escuela Esperanza.",
      },
      {
        id: "voluntarios-instalacion",
        description: "Voluntarios para instalación",
        unit: "personas",
        target: 2,
        achieved: 2,
        evidenceSummary: "Planilla de asistencia firmada por Lucas Ferreyra y Sofía Mansilla.",
      },
    ],
  },
  collaborators: [
    {
      id: "active-lumina-cooperativa",
      name: "Lumina Cooperativa",
      role: "Mariano Ponce · Empresa eléctrica",
      joinedAt: "2025-11-03",
      contribution:
        "Instalación del cableado principal, supervisión de soportes y pruebas según normas IRAM.",
      contactEmail: "alianzas@luminacooperativa.com.ar",
    },
    {
      id: "active-sembrar-futuro",
      name: "Sembrar Futuro",
      role: "Clara Medina · ONG",
      joinedAt: "2025-11-03",
      contribution: "Donación y logística de 60 lámparas LED certificadas de bajo consumo.",
      contactEmail: "coordinacion@sembrarfuturo.org",
    },
    {
      id: "active-lucas-ferreyra",
      name: "Lucas Ferreyra",
      role: "Voluntario UTN FRRo · Ing. Eléctrica",
      joinedAt: "2025-11-03",
      contribution:
        "Asistencia en tendido interno, pruebas de seguridad y mentoría para mantenimiento escolar.",
      contactEmail: "lucas.ferreyra@frro.utn.edu.ar",
    },
    {
      id: "active-sofia-mansilla",
      name: "Sofía Mansilla",
      role: "Voluntaria UTN FRRo · Ing. Eléctrica",
      joinedAt: "2025-11-03",
      contribution: "Coordinación de instalación de luminarias y talleres básicos para docentes.",
      contactEmail: "sofia.mansilla@frro.utn.edu.ar",
    },
  ],
  communications: [
    {
      author: "Mariano Ponce",
      organization: "Lumina Cooperativa",
      sentAt: "2025-11-03T08:30:00-03:00",
      summary:
        "Confirmó donación y retiro de cables y soportes, asegurando cumplimiento técnico del tendido.",
    },
    {
      author: "Clara Medina",
      organization: "Sembrar Futuro",
      sentAt: "2025-11-03T08:41:00-03:00",
      summary:
        "Garantizó envío de lámparas LED de larga duración y seguimiento de la entrega con comprobantes.",
    },
    {
      author: "Lucas Ferreyra",
      organization: "Voluntario UTN FRRo",
      sentAt: "2025-11-03T08:45:00-03:00",
      summary:
        "Planificó jornada de instalación completa en un día, coordinando tareas con el equipo técnico.",
    },
    {
      author: "Sofía Mansilla",
      organization: "Voluntaria UTN FRRo",
      sentAt: "2025-11-03T08:47:00-03:00",
      summary:
        "Propuso documentar el antes y después con fotografías para subir como evidencia de impacto.",
    },
    {
      author: "Patricia González",
      organization: "Escuela Esperanza",
      sentAt: "2025-11-03T08:50:00-03:00",
      summary:
        "Agradeció al equipo, comprometió validación inmediata tras la finalización y coordinación de evidencias.",
    },
  ],
  participationSummary: {
    volunteers: 2,
    inKindContributions: 3,
    monetaryContributionsARS: 180000,
  },
  fundingBreakdown: [
    { label: "Voluntariado", percent: 32, insight: "2 voluntarios técnicos activos" },
    { label: "Monetaria", percent: 33, insight: "$180.000 ARS invertidos en luminarias" },
    { label: "En especie", percent: 35, insight: "Cableado, tableros e interruptores certificados" },
  ],
  reviews: {
    averageScore: 5,
    details: [
      {
        source: "lumina_cooperativa",
        role: "Empresa eléctrica",
        score: 5,
        comment:
          "Ver las aulas encenderse fue increíble. Desde Lumina hicimos la entrega de materiales y la conexión final, pero lo más lindo fue sentir que esa luz también llega a los chicos.",
        createdAt: "2025-11-12T19:00:00-03:00",
      },
      {
        source: "sembrar_futuro",
        role: "ONG",
        score: 5,
        comment:
          "Cuando Patricia nos mandó la foto del aula iluminada, se nos llenó el corazón. Saber que nuestras lámparas ahora alumbran un lugar donde se aprende es lo que nos mueve a seguir.",
        createdAt: "2025-11-12T19:05:00-03:00",
      },
      {
        source: "lucas_ferreyra",
        role: "Colaborador individual",
        score: 5,
        comment:
          "Instalar esas luces con Sofía fue una experiencia que no se olvida. Llegamos con herramientas y nos fuimos con una sonrisa enorme. Los chicos nos agradecían desde la puerta.",
        createdAt: "2025-11-12T19:10:00-03:00",
      },
      {
        source: "sofia_mansilla",
        role: "Colaboradora individual",
        score: 5,
        comment:
          "Esa noche, cuando terminamos y encendimos la última lámpara, todos aplaudieron. Fue emocionante ver la escuela llena de luz y saber que pusimos un granito de arena.",
        createdAt: "2025-11-12T19:15:00-03:00",
      },
    ],
  },
  metrics: [
    { label: "Proyectos totales", value: "1" },
    { label: "Colaboradores totales", value: "4" },
    { label: "Próx. Finalización", value: "Cierre validado" },
  ],
  pendingRequests: [],
  aiNotice:
    "La IA de Conectando Corazones está sintetizando aprendizajes, métricas de impacto y reseñas de cada colaborador. El reporte se compartirá minutos después de cerrar el proyecto.",
};