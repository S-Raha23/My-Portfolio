/**
 * Hero — Left content + right Three.js character (peeks in and waves).
 */
import { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Download } from "lucide-react";

// Lazy-load Three.js so it doesn't block initial paint
const HeroCharacter = lazy(() =>
  import("./HeroCharacter").then((m) => ({ default: m.HeroCharacter }))
);

const TYPEWRITER_LINES = [
  "AI Engineer building production-ready systems",
  "Systems Engineer designing for scale and failure",
  "Backend Engineer focused on performance and reliability",
  "ML Systems builder from training to deployment",
  "Solving complex problems with structured thinking",
  "Engineering systems that hold under real load"
];

function useTypewriter(lines: string[], speed = 48, pause = 1800) {
  const [lineIdx, setLineIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = lines[lineIdx];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setLineIdx((i) => (i + 1) % lines.length);
    }
  }, [displayed, deleting, lineIdx, lines, speed, pause]);

  return displayed;
}

export function Hero() {
  const [hasInteracted, setHasInteracted] = useState(false);
  // Detect if device can handle WebGL (skip on low-end/mobile)
  const [supportsWebGL, setSupportsWebGL] = useState(false);
  const typed = useTypewriter(TYPEWRITER_LINES);

  useEffect(() => {
    const handler = () => { if (!hasInteracted) setHasInteracted(true); };
    window.addEventListener("mousemove", handler, { once: true });
    // Check WebGL support + screen size
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) setSupportsWebGL(true); // show on all screens with WebGL
    } catch { /* no WebGL */ }
    return () => window.removeEventListener("mousemove", handler);
  }, [hasInteracted]);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_68%_68%_at_50%_50%,#000_10%,transparent_100%)] opacity-60 dark:opacity-100"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.07) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8">

        {/* ── Left: main content ── */}
        <div className="text-center lg:text-left max-w-xl w-full flex-shrink-0">

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold tracking-widest uppercase">
              Available for opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[4.5rem] md:text-[6rem] font-bold tracking-tight text-foreground leading-[0.9] mb-6 cursor-default"
            whileHover={{
              textShadow: "0 0 52px rgba(37,99,235,0.45), 0 0 100px rgba(20,184,166,0.15)",
              transition: { duration: 0.28 },
            }}
          >
            Soubhagya
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-8 mb-6 flex items-center lg:justify-start justify-center"
          >
            <span className="font-mono text-base md:text-lg text-primary font-medium">
              {typed}<span className="animate-pulse">|</span>
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10"
          >
            ML engineer and systems builder. I turn hard constraints into
            working software — fast, correct, and built to scale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center lg:justify-start justify-center gap-3 flex-wrap"
          >
            <motion.a
              href="#projects"
              className="px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm tracking-wide"
              whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(37,99,235,0.45)" }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 0px rgba(37,99,235,0)", "0 0 22px rgba(37,99,235,0.32)", "0 0 0px rgba(37,99,235,0)"] }}
              transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              See My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-7 py-3.5 rounded-lg border border-border text-muted-foreground font-medium text-sm tracking-wide"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(37,99,235,0.06)", borderColor: "rgba(37,99,235,0.35)", color: "var(--color-foreground)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="https://drive.google.com/file/d/1UpzPgPgO50NJPacrGg7PPIlIF1qoDbLv/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 rounded-lg border border-primary/40 text-primary font-medium text-sm tracking-wide hover:bg-primary/8 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </motion.a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center lg:justify-start justify-center gap-4 mt-8"
          >
            <a href="mailto:Soubhagyaraha24@gmail.com" aria-label="Email"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com/S-Raha23" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/soubhagya-raha-78b25b285/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* ── Right: 3D character (desktop + WebGL only) ── */}
        {supportsWebGL && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden lg:block flex-1 relative min-h-[520px]"
          >
            {/* Welcome bubble — top right, above the robot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.4, type: "spring", stiffness: 200, damping: 18 }}
              className="absolute top-4 left-4 z-10 max-w-[200px]"
            >
              <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl rounded-br-none px-4 py-3 shadow-xl">
                <p className="text-sm font-bold text-foreground">Hey, welcome! 👋</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  I'm Soubhagya — I build systems that solve real problems.
                </p>
                <div className="absolute -bottom-2 right-4 w-0 h-0
                  border-l-[10px] border-l-transparent
                  border-t-[10px] border-t-border" />
                <div className="absolute -bottom-[6px] right-[17px] w-0 h-0
                  border-l-[8px] border-l-transparent
                  border-t-[8px] border-t-card" />
              </div>
            </motion.div>
            <Suspense fallback={null}>
              <HeroCharacter className="w-full h-full" />
            </Suspense>
          </motion.div>
        )}

      </div>

      {/* Discovery cue */}
      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.65, 0.35, 0.65] }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
            transition={{ duration: 2.8, delay: 2, times: [0, 0.3, 0.65, 1], repeat: Infinity }}
          >
            <span className="text-[10px] text-primary/55 tracking-[0.3em] uppercase font-semibold">
              Move your cursor
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] text-muted-foreground/40 tracking-[0.28em] uppercase">Scroll</span>
          <div className="w-px h-7 bg-gradient-to-b from-muted-foreground/30 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
