
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaBehance,
  FaDribbble,
  FaTelegram,
  FaDiscord,
  FaMedium,
  FaThreads,
  FaLink,
} from "react-icons/fa6";
import "./SocialIcon.css";

// SocialIcon.jsx — shows a social link with the platform's real logo.
//   npm install react-icons
//
// It works out the platform from the link's label ("GitHub") or its web address
// (github.com/...), so whatever the admin saved just works:
//   <SocialIcon social={{ label: "GitHub", url: "https://github.com/ghstudios" }} />
//
// On hover the button fills with the platform's own colour.

// bg = colour on hover, ink = logo colour on hover
const BRANDS = {
  github: { Icon: FaGithub, bg: "#ffffff", ink: "#111111", name: "GitHub" },
  linkedin: { Icon: FaLinkedinIn, bg: "#0a66c2", ink: "#ffffff", name: "LinkedIn" },
  instagram: {
    Icon: FaInstagram,
    bg: "linear-gradient(45deg, #f9ce34, #ee2a7b 55%, #6228d7)",
    ink: "#ffffff",
    name: "Instagram",
  },
  x: { Icon: FaXTwitter, bg: "#ffffff", ink: "#111111", name: "X" },
  facebook: { Icon: FaFacebookF, bg: "#1877f2", ink: "#ffffff", name: "Facebook" },
  youtube: { Icon: FaYoutube, bg: "#ff0000", ink: "#ffffff", name: "YouTube" },
  tiktok: { Icon: FaTiktok, bg: "#ffffff", ink: "#111111", name: "TikTok" },
  whatsapp: { Icon: FaWhatsapp, bg: "#25d366", ink: "#ffffff", name: "WhatsApp" },
  behance: { Icon: FaBehance, bg: "#1769ff", ink: "#ffffff", name: "Behance" },
  dribbble: { Icon: FaDribbble, bg: "#ea4c89", ink: "#ffffff", name: "Dribbble" },
  telegram: { Icon: FaTelegram, bg: "#26a5e4", ink: "#ffffff", name: "Telegram" },
  discord: { Icon: FaDiscord, bg: "#5865f2", ink: "#ffffff", name: "Discord" },
  medium: { Icon: FaMedium, bg: "#ffffff", ink: "#111111", name: "Medium" },
  threads: { Icon: FaThreads, bg: "#ffffff", ink: "#111111", name: "Threads" },
  link: { Icon: FaLink, bg: "#e8ff47", ink: "#111111", name: "Link" },
};

// what to look for in the label or the web address, in order
const MATCHERS = [
  ["github", "github"],
  ["linkedin", "linkedin"],
  ["instagram", "instagram"],
  ["twitter", "x"],
  ["x.com", "x"],
  ["facebook", "facebook"],
  ["fb.com", "facebook"],
  ["youtube", "youtube"],
  ["youtu.be", "youtube"],
  ["tiktok", "tiktok"],
  ["whatsapp", "whatsapp"],
  ["wa.me", "whatsapp"],
  ["behance", "behance"],
  ["dribbble", "dribbble"],
  ["telegram", "telegram"],
  ["t.me", "telegram"],
  ["discord", "discord"],
  ["medium", "medium"],
  ["threads", "threads"],
];

export function getBrand(social = {}) {
  const label = (social.label || "").trim().toLowerCase();
  if (label === "x") return BRANDS.x;
  const text = `${label} ${social.url || social.href || ""}`.toLowerCase();
  for (const [needle, key] of MATCHERS) {
    if (text.includes(needle)) return BRANDS[key];
  }
  return BRANDS.link;
}

export default function SocialIcon({ social, className = "" }) {
  const href = social.url || social.href;
  if (!href) return null;

  const brand = getBrand(social);
  const name = social.label || brand.name;
  const { Icon } = brand;

  return (
    <a
      className={`social-icon ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={name}
      style={{ "--brand": brand.bg, "--brand-ink": brand.ink }}
    >
      <Icon aria-hidden="true" />
      <span className="social-icon-tip" aria-hidden="true">
        {name}
      </span>
    </a>
  );
}