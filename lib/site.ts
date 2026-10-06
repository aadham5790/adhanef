export const SITE_NAME = "Ady Hanef";
export const SITE_TAGLINE = "Technology · Creativity · Ideas";
export const SITE_DESCRIPTION =
  "Maldivian creator and builder exploring technology, creativity, ideas, and the things shaping how we live and work.";

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}

export function mediaUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  return `/${path}`;
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" }
] as const;
