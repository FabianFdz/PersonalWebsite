import type {
  Language,
  NavigationItem,
  PortfolioContent,
} from "../../i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteHeaderProps = {
  initials: string;
  name: string;
  navigation: readonly NavigationItem[];
  availability: string;
  accessibility: PortfolioContent["accessibility"];
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export function SiteHeader({
  initials,
  name,
  navigation,
  availability,
  accessibility,
  language,
  onLanguageChange,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#top"
        aria-label={`${name}, ${accessibility.home}`}
      >
        {initials}<span>.</span>
      </a>
      <nav className="site-navigation" aria-label={accessibility.mainNavigation}>
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <span className="availability">
          <i aria-hidden="true" /> {availability}
        </span>
        <LanguageSwitcher
          activeLanguage={language}
          accessibility={accessibility}
          onChange={onLanguageChange}
        />
      </div>
    </header>
  );
}
