export type Language = "en" | "es";

export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

export type ExperienceItem = {
  period: string;
  role: string;
  summary: string;
};

export type InstallStep = {
  description: string;
  command: string;
};

export type FeaturedProjectSkill = {
  name: string;
  description: string;
};

export type FeaturedProject = {
  year: string;
  kicker: string;
  title: string;
  summary: string;
  link: {
    label: string;
    href: string;
    accessibilityLabel: string;
  };
  install: {
    label: string;
    terminalTitle: string;
    copy: {
      label: string;
      copiedLabel: string;
      failedLabel: string;
      accessibilityLabel: string;
    };
    steps: readonly InstallStep[];
  };
  skills: {
    label: string;
    items: readonly FeaturedProjectSkill[];
  };
  stages: readonly string[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type StackTechnologyId =
  | "typescript"
  | "react"
  | "nextjs"
  | "nodejs"
  | "express"
  | "nestjs"
  | "postgresql"
  | "mongodb"
  | "genai"
  | "langchain"
  | "langgraph"
  | "agentic-systems"
  | "cloud"
  | "cicd";

export type StackTechnology = {
  id: StackTechnologyId;
  label: string;
  category: string;
};

export type PortfolioContent = {
  accessibility: {
    mainNavigation: string;
    home: string;
    agentFlow: string;
    languageSelector: string;
    switchToEnglish: string;
    switchToSpanish: string;
  };
  identity: {
    initials: string;
    name: {
      full: string;
      displayLines: readonly [string, ...string[]];
    };
    location: string;
    coordinates: string;
    roleLines: readonly string[];
    introduction: string;
    availability: string;
  };
  navigation: readonly NavigationItem[];
  sectionLabels: {
    experience: string;
    featuredProject: string;
    capabilities: string;
    stack: string;
    contact: string;
  };
  scrollPrompt: string;
  experience: readonly ExperienceItem[];
  featuredProject: FeaturedProject;
  capabilities: {
    headline: string;
    items: readonly string[];
  };
  stack: readonly StackTechnology[];
  contact: {
    prompt: string;
    callToAction: string;
    links: readonly SocialLink[];
    signature: string;
  };
  seo: {
    title: string;
    description: string;
    socialImagePath: `/${string}`;
    socialImageAlt: string;
    socialImageWidth: number;
    socialImageHeight: number;
  };
};
