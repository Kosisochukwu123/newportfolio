
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
    `meta[${attribute}="${name}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const pathname =
      location.pathname.replace(/\/+$/, "") || "/";

    const isInvitationPage = pathname.startsWith("/join/");

    const metadata = PAGE_METADATA[pathname] || {
      title: "GH Studios | Digital Development Studio",
      description:
        "Explore website development, custom applications and digital solutions by GH Studios.",
      index: false,
    };

    const canonical = `${SITE_URL}${pathname}`;

    document.title = metadata.title;

    updateMeta("name", "description", metadata.description);

    updateMeta(
      "name",
      "robots",
      isInvitationPage || !metadata.index
        ? "noindex, nofollow"
        : "index, follow"
    );

    updateMeta("property", "og:title", metadata.title);
    updateMeta("property", "og:description", metadata.description);
    updateMeta("property", "og:url", canonical);

    updateMeta("name", "twitter:title", metadata.title);
    updateMeta("name", "twitter:description", metadata.description);

    let canonicalLink = document.head.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute(
      "href",
      isInvitationPage ? `${SITE_URL}/` : canonical
    );

  }, [location.pathname]);

  return null;
}
