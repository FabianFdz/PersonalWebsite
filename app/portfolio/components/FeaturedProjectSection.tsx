import type { CSSProperties } from "react";
import type { FeaturedProject } from "../../i18n";
import { SectionLabel } from "./SectionLabel";

type FeaturedProjectSectionProps = {
  label: string;
  agentFlowLabel: string;
  project: FeaturedProject;
};

export function FeaturedProjectSection({
  label,
  agentFlowLabel,
  project,
}: FeaturedProjectSectionProps) {
  return (
    <section className="case-study" data-reveal>
      <div className="case-top">
        <SectionLabel number="02" tone="light">{label}</SectionLabel>
        <span>{project.year}</span>
      </div>
      <div className="case-grid">
        <div>
          <p className="kicker">{project.kicker}</p>
          <h2>{project.title}</h2>
        </div>
        <div className="case-copy">
          <p>{project.summary}</p>
          <a href={project.link.href} aria-label={project.link.accessibilityLabel}>
            {project.link.label} <span>↗</span>
          </a>
        </div>
      </div>
      <div className="agent-track" aria-label={agentFlowLabel}>
        {project.stages.map((stage, index) => (
          <div
            key={stage}
            style={{ "--reveal-index": index } as CSSProperties}
          >
            <b>{index + 1}</b>
            <span>{stage}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
