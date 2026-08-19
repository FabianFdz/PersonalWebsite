import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function reveal(elements: readonly HTMLElement[]) {
  elements.forEach((element) => element.classList.add("is-visible"));
}

export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR),
    );

    root.classList.add("motion-ready");

    if (
      window.matchMedia(REDUCED_MOTION_QUERY).matches
      || !("IntersectionObserver" in window)
    ) {
      reveal(elements);
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);
}
