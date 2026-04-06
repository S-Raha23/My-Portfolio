/**
 * Hero — Transparent section so GlobalBackground shows through fully.
 * No local canvas or orbs — those live in GlobalBackground now.
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (!hasInteracted) setHasInteracted(true);
    };
    window.addEventListener("mousemove", handler, { once: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [hasInteracted]);

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Dot grid — hero-specific layer */}
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_68%_68%_at_50%_50%,#000_10%,transparent_100%)] opacity-60 dark:opacity-100"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.08) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Tag line */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] text-primary font-semibold tracking-[0.28em] uppercase mb-8"
        >
          AI / ML · Systems Engineering · Problem Solving
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[5.5rem] md:text-[7.5rem] font-bold tracking-tight text-foreground leading-[0.9] mb-10 cursor-default"
          whileHover={{
            textShadow: "0 0 52px rgba(99,102,241,0.55), 0 0 100px rgba(139,92,246,0.22)",
            transition: { duration: 0.28 },
          }}
        >
          Soubhagya
          <br />
          <span className="text-primary">Raha</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-12"
        >
          I solve hard problems by building intelligent systems — combining
          machine learning, algorithms, and reliable infrastructure into
          software that works at scale.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.a
            href="#projects"
            className="px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm tracking-wide"
            whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(99,102,241,0.55)" }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(99,102,241,0)",
                "0 0 22px rgba(99,102,241,0.38)",
                "0 0 0px rgba(99,102,241,0)",
              ],
            }}
            transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          >
            See My Work
          </motion.a>

          <motion.a
            href="#contact"
            className="px-7 py-3.5 rounded-lg border border-border text-muted-foreground font-medium text-sm tracking-wide"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(99,102,241,0.06)", borderColor: "rgba(99,102,241,0.4)", color: "var(--color-foreground)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>

      {/* ── Discovery cue ── */}
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

      {/* ── Scroll indicator ── */}
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
