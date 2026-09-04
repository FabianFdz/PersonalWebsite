import { englishContent } from "./locales/en";
import { spanishContent } from "./locales/es";
import type { Language, PortfolioContent } from "./types";

export const DEFAULT_LANGUAGE: Language = "en";

export const translations: Readonly<Record<Language, PortfolioContent>> = {
  en: englishContent,
  es: spanishContent,
};

export type {
  ExperienceItem,
  FeaturedProject,
  FeaturedProjectSkill,
  InstallStep,
  Language,
  NavigationItem,
  PortfolioContent,
  SocialLink,
  StackTechnology,
  StackTechnologyId,
} from "./types";
