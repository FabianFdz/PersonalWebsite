import type { PortfolioContent } from "../types";

export const englishContent = {
  accessibility: {
    mainNavigation: "Main navigation",
    home: "home",
    agentFlow: "Agent workflow",
    languageSelector: "Language selector",
    switchToEnglish: "Switch to English",
    switchToSpanish: "Switch to Spanish",
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
      "I turn ambiguous problems into clear products: web experiences, cloud platforms, and AI systems that keep people in control. This is my corner of the internet.",
    availability: "OPEN TO CONVERSATIONS",
  },
  navigation: [
    { label: "/work", href: "#work" },
    { label: "/profile", href: "#about" },
    { label: "/contact", href: "#contact" },
  ],
  sectionLabels: {
    experience: "EXPERIENCE",
    featuredProject: "FEATURED PROJECT",
    capabilities: "WHAT I DO",
    stack: "STACK",
    contact: "CONTACT",
  },
  scrollPrompt: "SCROLL TO EXPLORE",
  experience: [
    {
      period: "NOW",
      role: "Senior Software Engineer · GenAI",
      summary:
        "I design AI-powered products and multi-agent systems with deterministic validation, traceability, and human decisions at the highest-impact points.",
    },
    {
      period: "PRODUCT ENGINEERING",
      role: "Frontend & Full-stack",
      summary:
        "I build maintainable web experiences with React, Next.js, and TypeScript, from architecture through delivery and observability.",
    },
    {
      period: "PLATFORM",
      role: "Cloud & Delivery",
      summary:
        "I connect product, automation, and engineering practices to turn complex ideas into reliable, operable software.",
    },
  ],
  featuredProject: {
    year: "2026",
    kicker: "HUMAN-IN-THE-LOOP · AGENTIC AI",
    title: "Software built with agents. Decisions that remain human.",
    summary:
      "dev-setup is my Claude Code plugin marketplace. Its sprint-runner plugin turns a product epic into shipped, reviewed pull requests through a five-agent pipeline that advances one human-approved step at a time.",
    link: {
      label: "VIEW THE PLUGIN",
      href: "https://github.com/FabianFdz/dev-setup",
      accessibilityLabel: "View the dev-setup plugin marketplace on GitHub",
    },
    install: {
      label: "INSTALL",
      terminalTitle: "zsh — dev-setup",
      copy: {
        label: "COPY",
        copiedLabel: "COPIED",
        failedLabel: "COPY FAILED",
        accessibilityLabel: "Copy the installation commands",
      },
      steps: [
        {
          description: "Add the marketplace once per machine.",
          command: "claude plugin marketplace add FabianFdz/dev-setup",
        },
        {
          description: "Install the plugin in any project.",
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
            "Challenges a rough idea, then drafts the epic it earns.",
        },
        {
          name: "/sprint",
          description:
            "Runs that epic through the five roles below, pausing for approval at every handoff.",
        },
      ],
    },
    stages: ["PLANNER", "ARCHITECT", "CODER", "REVIEWER", "DOCS"],
  },
  capabilities: {
    headline: "I design useful, resilient systems that are easy to understand.",
    items: [
      "AI Products",
      "Agentic Workflows",
      "Web Platforms",
      "Architecture",
      "Developer Experience",
      "Cloud Delivery",
    ],
  },
  stack: [
    { id: "genai", label: "GenAI", category: "Artificial intelligence" },
    { id: "langchain", label: "LangChain", category: "LLM framework" },
    { id: "langgraph", label: "LangGraph", category: "Agent orchestration" },
    {
      id: "agentic-systems",
      label: "Agentic systems",
      category: "Orchestration",
    },
    { id: "typescript", label: "TypeScript", category: "Language" },
    { id: "react", label: "React", category: "UI library" },
    { id: "nextjs", label: "Next.js", category: "Framework" },
    { id: "nodejs", label: "Node.js", category: "Runtime" },
    { id: "express", label: "Express", category: "Backend framework" },
    { id: "nestjs", label: "NestJS", category: "Backend framework" },
    {
      id: "postgresql",
      label: "PostgreSQL",
      category: "Relational database",
    },
    { id: "mongodb", label: "MongoDB", category: "Document database" },
    { id: "cloud", label: "Cloud", category: "Infrastructure" },
    { id: "cicd", label: "CI/CD", category: "Automation" },
  ],
  contact: {
    prompt: "Are you building something difficult?",
    callToAction: "Let's talk",
    links: [
      { label: "LINKEDIN", href: "https://www.linkedin.com/in/fabianfdz" },
      { label: "GITHUB", href: "https://github.com/FabianFdz" },
    ],
    signature: "FABIÁN FERNÁNDEZ · SENIOR SOFTWARE ENGINEER + GENAI",
  },
  seo: {
    title: "Fabián Fernández — Senior Software Engineer & GenAI Builder",
    description:
      "Fabián Fernández's portfolio: software engineering, GenAI products, multi-agent systems, and web experiences.",
    socialImagePath: "/og.png",
    socialImageAlt: "Fabián Fernández — Software + GenAI",
    socialImageWidth: 1736,
    socialImageHeight: 907,
  },
} satisfies PortfolioContent;
