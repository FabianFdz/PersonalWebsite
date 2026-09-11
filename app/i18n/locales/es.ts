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
    roleLines: ["Senior Full-Stack Engineer", "& GenAI Builder"],
    introduction:
      "Convierto problemas ambiguos en productos claros: plataformas web full-stack, sistemas empresariales y sistemas de IA que mantienen a las personas al mando. Este es mi rincón de internet.",
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
      role: "Full-Stack Engineering",
      summary:
        "Construyo en todo el stack: front-ends en React/Next.js/TypeScript y backends en C#/.NET, desde la arquitectura hasta la entrega y la observabilidad.",
    },
    {
      period: "PLATFORM",
      role: "Cloud & Modernización",
      summary:
        "He modernizado sistemas legacy y migrado plataformas on-premise a Azure, conectando producto, automatización y prácticas de ingeniería en software confiable y operable.",
    },
  ],
  featuredProject: {
    year: "2026",
    kicker: "HUMAN-IN-THE-LOOP · AGENTIC AI",
    title:
      "Software que se construye con agentes. Decisiones que siguen siendo humanas.",
    summary:
      "dev-setup es mi marketplace de plugins para Claude Code. Su plugin sprint-runner convierte un epic de producto en pull requests revisados y listos para entregar, con un pipeline de cinco agentes que avanza un paso aprobado por una persona a la vez.",
    link: {
      label: "VER EL PLUGIN",
      href: "https://github.com/FabianFdz/dev-setup",
      accessibilityLabel: "Ver el marketplace de plugins dev-setup en GitHub",
    },
    install: {
      label: "INSTALACIÓN",
      terminalTitle: "zsh — dev-setup",
      copy: {
        label: "COPIAR",
        copiedLabel: "COPIADO",
        failedLabel: "NO SE COPIÓ",
        accessibilityLabel: "Copiar los comandos de instalación",
      },
      steps: [
        {
          description: "Agrega el marketplace una vez por máquina.",
          command: "claude plugin marketplace add FabianFdz/dev-setup",
        },
        {
          description: "Instala el plugin en cualquier proyecto.",
          command: "claude plugin install sprint-runner@fabian-dev-setup",
        },
      ],
    },
    skills: {
      label: "SKILLS",
      items: [
        {
          name: "/epic-creator",
          description:
            "Cuestiona la idea inicial y escribe el epic que se haya ganado.",
        },
        {
          name: "/sprint",
          description:
            "Lleva ese epic por los cinco roles de abajo, con una pausa de aprobación en cada entrega.",
        },
      ],
    },
    stages: ["PLANNER", "ARCHITECT", "CODER", "REVIEWER", "DOCS"],
  },
  capabilities: {
    headline: "Diseño sistemas útiles, resistentes y fáciles de entender.",
    items: [
      "Productos de IA",
      "Flujos agénticos",
      "Plataformas full-stack",
      "Arquitectura",
      "Modernización de legacy",
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
    { id: "dotnet", label: "C# / .NET", category: "Lenguaje backend" },
    {
      id: "postgresql",
      label: "PostgreSQL",
      category: "Base de datos relacional",
    },
    {
      id: "sqlserver",
      label: "SQL Server",
      category: "Base de datos relacional",
    },
    {
      id: "mongodb",
      label: "MongoDB",
      category: "Base de datos documental",
    },
    { id: "cloud", label: "Azure", category: "Plataforma cloud" },
    { id: "cicd", label: "CI/CD", category: "Automatización" },
  ],
  contact: {
    prompt: "¿Estás construyendo algo difícil?",
    callToAction: "Hablemos",
    links: [
      { label: "LINKEDIN", href: "https://www.linkedin.com/in/fabianfdz" },
      { label: "GITHUB", href: "https://github.com/FabianFdz" },
    ],
    signature: "FABIÁN FERNÁNDEZ · SENIOR FULL-STACK ENGINEER + GENAI",
  },
  seo: {
    title: "Fabián Fernández — Senior Full-Stack Engineer & GenAI Builder",
    description:
      "Portfolio de Fabián Fernández: ingeniería full-stack (React/Next.js, C#/.NET), productos GenAI, sistemas multiagente y plataformas cloud.",
    socialImagePath: "/og.png",
    socialImageAlt: "Fabián Fernández — Software + GenAI",
    socialImageWidth: 1736,
    socialImageHeight: 907,
  },
} satisfies PortfolioContent;
