import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteShell({
  children,
  showSitemap = false
}: {
  children: React.ReactNode;
  showSitemap?: boolean;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer showSitemap={showSitemap} />
    </>
  );
}
