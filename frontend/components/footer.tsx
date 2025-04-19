import CustomLink from "./custom-link";

interface FooterProps {
  isComingSoon: boolean;
  showLinks: boolean;
}

export default function Footer(Props: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { showLinks = true, isComingSoon } = Props;

  return (
    <footer className="border-t py-4 bg-background/95 backdrop-blur-sm">
      <div className="container">
        {/* Main footer content with fixed height */}
        <div className="h-12 flex items-center justify-between">
          {/* Logo and copyright - always visible */}
          <div className="flex items-center gap-4">
            <CustomLink
              isComingSoon={isComingSoon}
              href="/"
              className="flex items-center gap-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M17 3.34a10 10 0 1 1 -14.83 8.17" />
                <path d="M16 8a5 5 0 1 1 -7.5 4.33" />
              </svg>
              <span className="text-sm font-medium">Charis</span>
            </CustomLink>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              &copy; {currentYear} All rights reserved
            </span>
          </div>

          {/* Navigation links - horizontal scrolling on small screens */}
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            {showLinks && (
              <nav className="flex items-center gap-4 px-1">
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  Home
                </CustomLink>
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/prayers"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  Prayers
                </CustomLink>
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/about"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  About
                </CustomLink>
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/contact"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  Contact
                </CustomLink>
                <span className="hidden sm:inline-block text-muted-foreground/30">
                  |
                </span>
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors hidden sm:inline-block"
                >
                  Privacy
                </CustomLink>
                <CustomLink
                  isComingSoon={isComingSoon}
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap transition-colors hidden sm:inline-block"
                >
                  Terms
                </CustomLink>
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
