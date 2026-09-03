import type { PortfolioContent } from "../types";

export const spanishContent = {
  accessibility: {
    mainNavigation: "Navegación principal",
    home: "inicio",
    agentFlow: "Flujo de agentes",
    languageSelector: "Selector de idioma",
    switchToEnglish: "Cambiar a inglés",
    switchToSpanish: "Cambiar a español",
  },
  identity: {
    initials: "FF",
    name: {
      full: "Fabián Fernández",
      displayLines: ["Fabián", "Fernández"],
    },
    location: "CARTAGO, COSTA RICA",
    coordinates: "9.8642°N / 83.9199°W",
    roleLines: ["Senior Software Engineer", "& GenAI Builder"],
    introduction:
      "Convierto problemas ambiguos en productos claros: experiencias web, plataformas cloud y sistemas de IA que mantienen a las personas al mando. Este es mi rincón de internet.",
    availability: "DISPONIBLE PARA CONVERSAR",
  },
  navigation: [
    { label: "/trabajo", href: "#work" },
    { label: "/perfil", href: "#about" },
    { label: "/contacto", href: "#contact" },
  ],
  sectionLabels: {
    experience: "EXPERIENCIA",
    featuredProject: "PROYECTO DESTACADO",
    capabilities: "LO QUE HAGO",
    stack: "STACK",
    contact: "CONTACTO",
  },
  scrollPrompt: "DESLIZA PARA EXPLORAR",
  experience: [
    {
      period: "ACTUALIDAD",
      role: "Senior Software Engineer · GenAI",
      summary:
        "Diseño productos AI-powered y sistemas multiagente con validación determinista, trazabilidad y decisiones humanas en los puntos de mayor impacto.",
    },
    {
      period: "PRODUCT ENGINEERING",
      role: "Frontend & Full-stack",
      summary:
        "Construyo experiencias web mantenibles con React, Next.js y TypeScript, desde la arquitectura hasta la entrega y observabilidad.",
    },
    {
      period: "PLATFORM",
      role: "Cloud & Delivery",
      summary:
        "Conecto producto, automatización y prácticas de ingeniería para convertir ideas complejas en software confiable y operable.",
    },
  ],
  featuredProject: {
    year: "2026",
    kicker: "HUMAN-IN-THE-LOOP · AGENTIC AI",
    title:
      "Software que se construye con agentes. Decisiones que siguen siendo humanas.",
    summary:
      "Un harness multiagente que transforma epics en tickets, decisiones arquitectónicas, código revisado y documentación, con contratos JSON, checkpoints reanudables y validación determinista.",
    link: {
      label: "VER ARQUITECTURA",
      href: "https://github.com/FabianFdz/PersonalWebsite",
      accessibilityLabel: "Ver la arquitectura del proyecto destacado en GitHub",
    },
    stages: ["PLANNER", "ARCHITECT", "CODER", "REVIEWER", "DOCS"],
  },
  capabilities: {
    headline: "Diseño sistemas útiles, resistentes y fáciles de entender.",
    items: [
      "Productos de IA",
      "Flujos agénticos",
      "Plataformas web",
      "Arquitectura",
      "Experiencia de desarrollo",
      "Entrega cloud",
    ],
  },
  stack: [
    { id: "genai", label: "GenAI", category: "Inteligencia artificial" },
    { id: "langchain", label: "LangChain", category: "Framework para LLM" },
    {
      id: "langgraph",
      label: "LangGraph",
      category: "Orquestación de agentes",
    },
    {
      id: "agentic-systems",
      label: "Sistemas agénticos",
      category: "Orquestación",
    },
    { id: "typescript", label: "TypeScript", category: "Lenguaje" },
    { id: "react", label: "React", category: "Librería UI" },
    { id: "nextjs", label: "Next.js", category: "Framework" },
    { id: "nodejs", label: "Node.js", category: "Runtime" },
    { id: "express", label: "Express", category: "Framework backend" },
    { id: "nestjs", label: "NestJS", category: "Framework backend" },
    {
      id: "postgresql",
      label: "PostgreSQL",
      category: "Base de datos relacional",
    },
    {
      id: "mongodb",
      label: "MongoDB",
      category: "Base de datos documental",
    },
    { id: "cloud", label: "Cloud", category: "Infraestructura" },
    { id: "cicd", label: "CI/CD", category: "Automatización" },
  ],
  contact: {
    prompt: "¿Estás construyendo algo difícil?",
    callToAction: "Hablemos",
    links: [
      { label: "LINKEDIN", href: "https://www.linkedin.com/in/fabianfdz" },
      { label: "GITHUB", href: "https://github.com/FabianFdz" },
    ],
    signature: "FABIÁN FERNÁNDEZ · SENIOR SOFTWARE ENGINEER + GENAI",
  },
  seo: {
    title: "Fabián Fernández — Senior Software Engineer & GenAI Builder",
    description:
      "Portfolio de Fabián Fernández: ingeniería de software, productos GenAI, sistemas multiagente y experiencias web.",
    socialImagePath: "/og.png",
    socialImageAlt: "Fabián Fernández — Software + GenAI",
    socialImageWidth: 1736,
    socialImageHeight: 907,
  },
} satisfies PortfolioContent;
