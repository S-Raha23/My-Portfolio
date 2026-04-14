import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

const NAV_LINKS = [
  { label: "Home",       href: "#home" },
  { label: "About",      href: "#about" },
  { label: "Work",       href: "#projects" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Journey",    href: "#timeline" },
  { label: "Skills",     href: "#skills" },
  { label: "Contact",    href: "#contact" },
];

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2"     x2="12" y2="6"/>   <line x1="12" y1="18"    x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12"     x2="6" y2="12"/>   <line x1="18" y1="12"    x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/> <line x1="16.24" y1="7.76"  x2="19.07" y2="4.93"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { theme, toggle }       = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Show hint on first visit, hide after 4s or after user clicks the button
  useEffect(() => {
    // Clear old key so hint always shows on dev reload
    localStorage.removeItem("theme-hint-seen");
    const t = setTimeout(() => setShowHint(true), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem("theme-hint-seen", "1");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  const handleToggle = () => {
    toggle();
    setShowHint(false);
    localStorage.setItem("theme-hint-seen", "1");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/88 backdrop-blur-md border-b border-border/60 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo — full name, slightly larger */}
        <a
          href="#home"
          className="text-foreground font-bold text-lg tracking-tight hover:text-primary transition-colors duration-200"
        >
          SR.
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.button
              onClick={handleToggle}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/6 transition-colors duration-200"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* First-visit hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.9 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute top-12 right-0 z-50 w-52"
                >
                  <div className="bg-card border border-primary/30 rounded-xl px-4 py-3 shadow-[0_0_24px_rgba(37,99,235,0.18)]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
                      <p className="text-xs font-semibold text-foreground">
                        Try {isDark ? "Light" : "Dark"} Mode
                      </p>
                    </div>
                    
                    {/* Animated arrow pointing up */}
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 right-3 w-0 h-0
                        border-l-[6px] border-l-transparent
                        border-r-[6px] border-r-transparent
                        border-b-[8px] border-b-primary/30"
                    />
                    <div className="absolute -top-[5px] right-[13px] w-0 h-0
                      border-l-[5px] border-l-transparent
                      border-r-[5px] border-r-transparent
                      border-b-[7px] border-b-card" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-current transition-all origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-all origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden overflow-hidden bg-background/95 backdrop-blur-md border-t border-border/50 px-6 py-4 flex flex-col gap-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
