import type { Language, PortfolioContent } from "../../i18n";

type LanguageSwitcherProps = {
  activeLanguage: Language;
  accessibility: PortfolioContent["accessibility"];
  onChange: (language: Language) => void;
};

const languageOptions: readonly Language[] = ["en", "es"];

export function LanguageSwitcher({
  activeLanguage,
  accessibility,
  onChange,
}: LanguageSwitcherProps) {
  const labels = {
    en: accessibility.switchToEnglish,
    es: accessibility.switchToSpanish,
  } satisfies Record<Language, string>;

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={accessibility.languageSelector}
    >
      {languageOptions.map((language) => {
        const isActive = language === activeLanguage;

        return (
          <button
            type="button"
            key={language}
            className={isActive ? "active" : undefined}
            aria-label={labels[language]}
            aria-pressed={isActive}
            onClick={() => onChange(language)}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
