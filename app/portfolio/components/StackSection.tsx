import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import { BsOpenai } from "react-icons/bs";
import { LuCloud, LuGitBranch, LuWorkflow } from "react-icons/lu";
import {
  SiClaude,
  SiExpress,
  SiLangchain,
  SiLanggraph,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import type { StackTechnology, StackTechnologyId } from "../../i18n";
import { SectionLabel } from "./SectionLabel";

type StackSectionProps = {
  label: string;
  technologies: readonly StackTechnology[];
};

type TechnologyIcon = {
  id: string;
  component: IconType;
};

const technologyIcons: Readonly<
  Record<StackTechnologyId, readonly TechnologyIcon[]>
> = {
  typescript: [{ id: "typescript", component: SiTypescript }],
  react: [{ id: "react", component: SiReact }],
  nextjs: [{ id: "nextjs", component: SiNextdotjs }],
  nodejs: [{ id: "nodejs", component: SiNodedotjs }],
  express: [{ id: "express", component: SiExpress }],
  nestjs: [{ id: "nestjs", component: SiNestjs }],
  postgresql: [{ id: "postgresql", component: SiPostgresql }],
  mongodb: [{ id: "mongodb", component: SiMongodb }],
  genai: [
    { id: "openai", component: BsOpenai },
    { id: "claude", component: SiClaude },
  ],
  langchain: [{ id: "langchain", component: SiLangchain }],
  langgraph: [{ id: "langgraph", component: SiLanggraph }],
  "agentic-systems": [{ id: "agentic", component: LuWorkflow }],
  cloud: [{ id: "cloud", component: LuCloud }],
  cicd: [{ id: "cicd", component: LuGitBranch }],
};

export function StackSection({ label, technologies }: StackSectionProps) {
  return (
    <section className="stack-section" data-reveal>
      <SectionLabel number="04">{label}</SectionLabel>
      <div className="stack-grid">
        {technologies.map((technology, index) => (
          <StackCard
            index={String(index + 1).padStart(2, "0")}
            key={technology.id}
            revealIndex={index}
            technology={technology}
          />
        ))}
      </div>
    </section>
  );
}

type StackCardProps = {
  index: string;
  revealIndex: number;
  technology: StackTechnology;
};

function StackCard({ index, revealIndex, technology }: StackCardProps) {
  const icons = technologyIcons[technology.id];
  const iconSetClassName = icons.length > 1
    ? "stack-icon-set stack-icon-set--layered"
    : "stack-icon-set";

  return (
    <article
      className="stack-card"
      style={{ "--reveal-index": revealIndex } as CSSProperties}
    >
      <div className="stack-card-meta">
        <span>{index}</span>
        <span>{technology.category}</span>
      </div>
      <div className="stack-card-main">
        <h3>{technology.label}</h3>
        <span className={iconSetClassName} aria-hidden="true">
          {icons.map(({ id, component: Icon }) => (
            <span className={`stack-icon stack-icon--${id}`} key={id}>
              <Icon />
            </span>
          ))}
        </span>
      </div>
    </article>
  );
}
