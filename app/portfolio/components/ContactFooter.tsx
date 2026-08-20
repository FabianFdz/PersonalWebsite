import type { SocialLink } from "../../i18n";
import { SectionLabel } from "./SectionLabel";

type ContactFooterProps = {
  label: string;
  prompt: string;
  callToAction: string;
  links: readonly SocialLink[];
  signature: string;
};

export function ContactFooter({
  label,
  prompt,
  callToAction,
  links,
  signature,
}: ContactFooterProps) {
  return (
    <footer className="contact-footer" data-reveal id="contact">
      <SectionLabel number="05" tone="light">{label}</SectionLabel>
      <p>{prompt}</p>
      <h2>{callToAction}<span>.</span></h2>
      <div className="contact-row">
        <div>
          {links.map((link) => (
            <a key={link.label} href={link.href}>{link.label} ↗</a>
          ))}
        </div>
      </div>
      <div className="footer-note">{signature}</div>
    </footer>
  );
}
