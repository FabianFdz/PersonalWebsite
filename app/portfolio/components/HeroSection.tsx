type HeroSectionProps = {
  location: string;
  coordinates: string;
  nameLines: readonly [string, ...string[]];
  roleLines: readonly string[];
  introduction: string;
  scrollPrompt: string;
};

function renderName(nameLines: readonly [string, ...string[]]) {
  return (
    <>
      {nameLines.map((line, index) => (
        <span className="hero-title-line" key={line}>
          {line}
          {index === nameLines.length - 1 && (
            <span className="hero-title-dot" aria-hidden="true" />
          )}
        </span>
      ))}
    </>
  );
}

export function HeroSection({
  location,
  coordinates,
  nameLines,
  roleLines,
  introduction,
  scrollPrompt,
}: HeroSectionProps) {
  return (
    <section className="hero" id="top">
      <div className="eyebrow">{location} · <span>{coordinates}</span></div>
      <h1>{renderName(nameLines)}</h1>
      <div className="hero-bottom">
        <p className="role">
          {roleLines.map((line, index) => (
            <span key={line}>{index > 0 && <br />}{line}</span>
          ))}
        </p>
        <p className="intro">{introduction}</p>
      </div>
      <div className="scroll-note" aria-hidden="true">
        <span className="scroll-text">{scrollPrompt}</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}
