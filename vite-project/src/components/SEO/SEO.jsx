import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.ghstudios.online";

const PAGE_METADATA = {
  "/": {
    title: "GH Studios | Web Development, UI/UX Design & Software Engineering",
    description:
      "GH Studios builds modern websites, custom web applications, UI/UX experiences, backend systems and APIs. Explore our work and start your next project.",
    index: true,
  },

  "/contact": {
    title: "Contact GH Studios | Start a Website or Software Project",
    description:
      "Get in touch with GH Studios to discuss your website, custom web application, UI/UX design or software development project.",
    index: true,
  },

  "/team": {
    title: "Our Team | GH Studios",
    description:
      "Meet the people behind GH Studios and discover the creative and technical team building websites, applications and digital experiences.",
    index: true,
  },

  "/resume": {
    title: "Professional Resume | GH Studios",
    description:
      "Explore the professional experience, skills and qualifications presented by GH Studios.",
    index: true,
  },
};

function updateMeta(attribute, name, content) {
  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function removeMeta(attribute, name) {
  document.head
    .querySelector(`meta[${attribute}="${name}"]`)
    ?.remove();
}

export default function SEO({ profile = {} }) {
  const location = useLocation();

  useEffect(() => {
    const pathname =
      location.pathname.replace(/\/+$/, "") || "/";

    const isHomePage = pathname === "/";
    const isInvitationPage = pathname.startsWith("/join/");

    const metadata = PAGE_METADATA[pathname] || {
      title: "GH Studios | Digital Development Studio",
      description:
        "Explore website development, custom applications and digital solutions by GH Studios.",
      index: false,
    };

    const title =
      isHomePage && profile.metaTitle?.trim()
        ? profile.metaTitle.trim()
        : metadata.title;

    const description =
      isHomePage && profile.metaDescription?.trim()
        ? profile.metaDescription.trim()
        : metadata.description;

    const image =
      isHomePage && profile.ogImageUrl?.trim()
        ? profile.ogImageUrl.trim()
        : "";

    const canonical = `${SITE_URL}${pathname}`;

    document.title = title;

    updateMeta("name", "description", description);

    updateMeta(
      "name",
      "robots",
      isInvitationPage || !metadata.index
        ? "noindex, nofollow"
        : "index, follow",
    );

    updateMeta("property", "og:title", title);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:url", canonical);

    updateMeta("name", "twitter:title", title);
    updateMeta("name", "twitter:description", description);

    if (image) {
      updateMeta("property", "og:image", image);
      updateMeta("name", "twitter:image", image);
      updateMeta("name", "twitter:card", "summary_large_image");
    } else {
      removeMeta("property", "og:image");
      removeMeta("name", "twitter:image");
      updateMeta("name", "twitter:card", "summary");
    }

    let canonicalLink = document.head.querySelector(
      'link[rel="canonical"]',
    );

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute(
      "href",
      isInvitationPage ? `${SITE_URL}/` : canonical,
    );
  }, [
    location.pathname,
    profile.metaTitle,
    profile.metaDescription,
    profile.ogImageUrl,
  ]);

  return null;
}
