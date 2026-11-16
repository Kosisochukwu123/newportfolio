import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SOURCE_FILE = path.join(DIST_DIR, "index.html");

const PAGES = [
  {
    route: "/contact",
    title: "Contact GH Studios | Start a Website or Software Project",
    description:
      "Get in touch with GH Studios to discuss your website, custom web application, UI/UX design or software development project.",
  },
  {
    route: "/team",
    title: "Our Team | GH Studios",
    description:
      "Meet the people behind GH Studios and discover the creative and technical team building websites, applications and digital experiences.",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attribute}=["']${escapedName}["'])[^>]*>`,
    "i",
  );

  const replacement = (match) => {
    const escapedContent = escapeHtml(content);

    if (/\bcontent=["'][^"']*["']/i.test(match)) {
      return match.replace(
        /\bcontent=["'][^"']*["']/i,
        `content="${escapedContent}"`,
      );
    }

    return match.replace(/>$/, ` content="${escapedContent}">`);
  };

  if (!pattern.test(html)) {
    console.warn(`Metadata tag not found: ${attribute}="${name}"`);
    return html;
  }

  return html.replace(pattern, replacement);
}

function generatePage(sourceHtml, page) {
  const canonical = `https://www.ghstudios.online${page.route}`;

  let html = sourceHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${page.title}</title>`,
  );

  html = replaceMeta(html, "name", "description", page.description);
  html = replaceMeta(html, "property", "og:title", page.title);
  html = replaceMeta(html, "property", "og:description", page.description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "name", "twitter:title", page.title);
  html = replaceMeta(html, "name", "twitter:description", page.description);

  html = html.replace(
    /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`,
  );

  return html;
}

if (!fs.existsSync(SOURCE_FILE)) {
  console.error("Build output not found. Run the Vite build first.");
  process.exit(1);
}

const sourceHtml = fs.readFileSync(SOURCE_FILE, "utf8");

for (const page of PAGES) {
  const outputDirectory = path.join(DIST_DIR, page.route.slice(1));
  const outputFile = path.join(outputDirectory, "index.html");

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(outputFile, generatePage(sourceHtml, page), "utf8");

  console.log(`Generated ${outputFile}`);
}


// Generate a list of files for the service worker to cache offline.
function getBuildFiles(directory, base = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.posix.join(base, entry.name);
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getBuildFiles(fullPath, relativePath);
    }

    // Don't precache the large hero video.
    if (relativePath === "hero-video.mp4") {
      return [];
    }

    // The service worker and manifest don't need to cache themselves.
    if (
      relativePath === "sw.js" ||
      relativePath === "precache-manifest.json"
    ) {
      return [];
    }

    return [`/${relativePath}`];
  });
}

const precacheFiles = getBuildFiles(DIST_DIR);

fs.writeFileSync(
  path.join(DIST_DIR, "precache-manifest.json"),
  JSON.stringify(precacheFiles, null, 2),
);

console.log(`Generated offline manifest with ${precacheFiles.length} files.`);