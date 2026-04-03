import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-white/10 py-4"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="font-mono text-sm tracking-tighter text-white font-bold">
          &gt; SYSTEM.INIT()
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-wider text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors">01. ABOUT</a>
          <a href="#projects" className="hover:text-primary transition-colors">02. PROJECTS</a>
          <a href="#timeline" className="hover:text-primary transition-colors">03. TIMELINE</a>
          <a href="#contact" className="hover:text-primary transition-colors">04. CONTACT</a>
        </div>
      </div>
    </motion.nav>
  );
}
