"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  translations,
  type Language,
} from "../../i18n";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { CapabilitiesSection } from "./CapabilitiesSection";
import { ContactFooter } from "./ContactFooter";
import { ExperienceSection } from "./ExperienceSection";
import { FeaturedProjectSection } from "./FeaturedProjectSection";
import { HeroSection } from "./HeroSection";
import { SiteHeader } from "./SiteHeader";
import { StackSection } from "./StackSection";

function synchronizeDocumentLanguage(
  language: Language,
  title: string,
  description: string,
) {
  document.documentElement.lang = language;
  document.title = title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", description);
}

export function PortfolioPage() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  useScrollReveal();
  const content = translations[language];
  const {
    accessibility,
    identity,
    navigation,
    sectionLabels,
    scrollPrompt,
    experience,
    featuredProject,
    capabilities,
    stack,
    contact,
    seo,
  } = content;

  useEffect(() => {
    synchronizeDocumentLanguage(language, seo.title, seo.description);
  }, [language, seo.description, seo.title]);

  return (
    <main>
      <SiteHeader
        initials={identity.initials}
        name={identity.name.full}
        navigation={navigation}
        availability={identity.availability}
        accessibility={accessibility}
        language={language}
        onLanguageChange={setLanguage}
      />
      <HeroSection
        location={identity.location}
        coordinates={identity.coordinates}
        nameLines={identity.name.displayLines}
        roleLines={identity.roleLines}
        introduction={identity.introduction}
        scrollPrompt={scrollPrompt}
      />
      <ExperienceSection label={sectionLabels.experience} items={experience} />
      <FeaturedProjectSection
        label={sectionLabels.featuredProject}
        agentFlowLabel={accessibility.agentFlow}
        project={featuredProject}
      />
      <CapabilitiesSection
        label={sectionLabels.capabilities}
        headline={capabilities.headline}
        items={capabilities.items}
      />
      <StackSection label={sectionLabels.stack} technologies={stack} />
      <ContactFooter
        label={sectionLabels.contact}
        prompt={contact.prompt}
        callToAction={contact.callToAction}
        configurationHint={contact.configurationHint}
        links={contact.links}
        signature={contact.signature}
      />
    </main>
  );
}
