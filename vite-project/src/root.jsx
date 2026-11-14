
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export function meta() {
  return [
    { name: "author", content: "GH Studios" },
    { name: "theme-color", content: "#0b0b0c" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "GH Studios" },
    {
      property: "og:image",
      content: "https://www.ghstudios.online/GHStudios-logo-preview.png",
    },
    { property: "og:image:alt", content: "GH Studios company logo" },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:image",
      content: "https://www.ghstudios.online/GHStudios-logo-preview.png",
    },
  ];
}

export function links() {
  return [
    {
      rel: "icon",
      type: "image/png",
      href: "/GHStudios-logo-preview.png",
    },
  ];
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <Meta />
        <Links />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GH Studios",
              url: "https://www.ghstudios.online/",
              logo: "https://www.ghstudios.online/GHStudios-logo-preview.png",
              description:
                "GH Studios is a digital development studio specializing in web development, custom web applications, UI/UX design, backend engineering and digital solutions.",
            }),
          }}
        />
      </head>

      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "grid",
        placeItems: "center",
        color: "#e8ff47",
        fontFamily: "monospace",
      }}
    >
      GH STUDIOS
    </div>
  );
}
