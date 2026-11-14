import { useLoaderData } from "react-router";
import App from "./App";

const API = (
  import.meta.env.VITE_API_URL || "https://newportfolio-231g.onrender.com/api"
).replace(/\/+$/, "");

async function fetchEndpoint(endpoint) {
  const response = await fetch(`${API}/${endpoint}`, {
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: HTTP ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(`The ${endpoint} API returned an unsuccessful response.`);
  }

  return result.data;
}

export async function loader({ request }) {
  const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/";

  if (pathname === "/") {
    const [profile, projects, skills, testimonials] = await Promise.all([
      fetchEndpoint("profile"),
      fetchEndpoint("projects"),
      fetchEndpoint("skills"),
      fetchEndpoint("testimonials"),
    ]);

    return {
      profile,
      projects,
      skills,
      testimonials,
    };
  }

  if (pathname === "/contact") {
    return {
      profile: await fetchEndpoint("profile"),
    };
  }

  if (pathname === "/team") {
    return {
      team: await fetchEndpoint("team"),
    };
  }

  return {};
}

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

export function meta({ location }) {
  const pathname = location.pathname.replace(/\/+$/, "") || "/";

  const isInvitationPage = pathname.startsWith("/join/");

  const metadata = PAGE_METADATA[pathname] || {
    title: "GH Studios | Digital Development Studio",
    description:
      "Explore website development, custom applications and digital solutions by GH Studios.",
    index: false,
  };

  const canonicalPath = isInvitationPage ? "/" : pathname;
  const canonical = `${SITE_URL}${canonicalPath}`;

  return [
    { title: metadata.title },
    {
      name: "description",
      content: metadata.description,
    },
    {
      name: "robots",
      content:
        isInvitationPage || !metadata.index
          ? "noindex, nofollow"
          : "index, follow",
    },
    {
      property: "og:title",
      content: metadata.title,
    },
    {
      property: "og:description",
      content: metadata.description,
    },
    {
      property: "og:url",
      content: canonical,
    },
    {
      name: "twitter:title",
      content: metadata.title,
    },
    {
      name: "twitter:description",
      content: metadata.description,
    },
    {
      tagName: "link",
      rel: "canonical",
      href: canonical,
    },
  ];
}

export default function CatchAll() {
  const initialData = useLoaderData();

  return <App initialData={initialData} />;
}
