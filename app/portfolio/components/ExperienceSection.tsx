import type { CSSProperties } from "react";
import type { ExperienceItem } from "../../i18n";
import { SectionLabel } from "./SectionLabel";

type ExperienceSectionProps = {
  label: string;
  items: readonly ExperienceItem[];
};

export function ExperienceSection({ label, items }: ExperienceSectionProps) {
  return (
    <section className="section" data-reveal id="work">
      <SectionLabel number="01">{label}</SectionLabel>
      <div className="experience-list">
        {items.map((item, index) => (
          <article
            className="experience-row"
            key={item.role}
            style={{ "--reveal-index": index } as CSSProperties}
          >
            <div className="index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <span className="period">{item.period}</span>
              <h2>{item.role}</h2>
            </div>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
