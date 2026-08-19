import type { CSSProperties } from "react";
import { SectionLabel } from "./SectionLabel";

type CapabilitiesSectionProps = {
  label: string;
  headline: string;
  items: readonly string[];
};

export function CapabilitiesSection({
  label,
  headline,
  items,
}: CapabilitiesSectionProps) {
  return (
    <section className="section split" data-reveal id="about">
      <div>
        <SectionLabel number="03">{label}</SectionLabel>
        <h2 className="manifesto">{headline}</h2>
      </div>
      <div className="capabilities">
        {items.map((item, index) => (
          <span
            key={item}
            style={{ "--reveal-index": index } as CSSProperties}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
