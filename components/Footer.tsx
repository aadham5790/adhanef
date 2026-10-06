import Link from "next/link";
import { navItems } from "@/lib/site";

export function Footer({ showSitemap = false }: { showSitemap?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-social">
          <a href="https://twitter.com/adhanef" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <use href="/assets/images/social-icons.svg#icon-twitter" />
            </svg>
          </a>
          <a href="https://www.instagram.com/adhanef/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="/assets/images/social-icons.svg#icon-instagram" />
            </svg>
          </a>
          <a href="https://www.youtube.com/channel/UC0Gry0ePJKHM3d2Ajj8yj8w" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="/assets/images/social-icons.svg#icon-youtube" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@adhanef" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <use href="/assets/images/social-icons.svg#icon-tiktok" />
            </svg>
          </a>
          <a href="https://web.facebook.com/adhanefmv/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <use href="/assets/images/social-icons.svg#icon-facebook" />
            </svg>
          </a>
        </div>
        <div className="footer-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          {showSitemap ? <Link href="/sitemap.xml">Sitemap</Link> : null}
        </div>
        <p className="footer-copy">&copy; {year} Ady Hanef. Technology · Creativity · Ideas.</p>
      </div>
    </footer>
  );
}
