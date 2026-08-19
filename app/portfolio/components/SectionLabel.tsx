type SectionLabelProps = {
  number: string;
  children: string;
  tone?: "default" | "light";
};

export function SectionLabel({
  number,
  children,
  tone = "default",
}: SectionLabelProps) {
  const className = tone === "light" ? "section-label light" : "section-label";

  return <div className={className}>{number} / {children}</div>;
}
