import type { Metadata } from "next";
import type { PortfolioContent } from "../i18n";

type HeaderReader = Pick<Headers, "get">;

export function resolveRequestOrigin(headers: HeaderReader): string {
  const host =
    headers.get("x-forwarded-host") ?? headers.get("host") ?? "localhost:3000";
  const protocol =
    headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

export function buildPortfolioMetadata(
  origin: string,
  seo: PortfolioContent["seo"],
): Metadata {
  const socialImageUrl = new URL(seo.socialImagePath, origin).toString();

  return {
    metadataBase: new URL(origin),
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [
        { url: "/favicon.svg?v=2", type: "image/svg+xml" },
        { url: "/favicon.ico?v=2", sizes: "any" },
      ],
      shortcut: "/favicon.ico?v=2",
      apple: [
        {
          url: "/apple-touch-icon.png?v=2",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      url: origin,
      images: [
        {
          url: socialImageUrl,
          width: seo.socialImageWidth,
          height: seo.socialImageHeight,
          alt: seo.socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [socialImageUrl],
    },
  };
}
