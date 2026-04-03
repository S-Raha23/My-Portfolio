import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.2 + 0.8,
  duration: Math.random() * 7 + 5,
  delay: Math.random() * 5,
  driftY: (Math.random() - 0.5) * 70,
  driftX: (Math.random() - 0.5) * 30,
}));

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // Primary orb — responsive, tight spring
  const springX = useSpring(rawX, { stiffness: 70, damping: 22, mass: 0.7 });
  const springY = useSpring(rawY, { stiffness: 70, damping: 22, mass: 0.7 });

  // Trail orb — slower, heavier spring
  const trailX = useSpring(rawX, { stiffness: 28, damping: 16, mass: 1.4 });
  const trailY = useSpring(rawY, { stiffness: 28, damping: 16, mass: 1.4 });

  // Convert 0–1 → percentage strings for left/top CSS
  const orbLeft = useTransform(springX, (v) => `${v * 100}%`);
  const orbTop = useTransform(springY, (v) => `${v * 100}%`);
  const trailLeft = useTransform(trailX, (v) => `${v * 100}%`);
  const trailTop = useTransform(trailY, (v) => `${v * 100}%`);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      rawX.set((e.clientX - left) / width);
      rawY.set((e.clientY - top) / height);
    },
    [rawX, rawY]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
    >
      {/* ── Cursor-following primary glow ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 560,
          height: 560,
          left: orbLeft,
          top: orbTop,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0.05) 45%, transparent 70%)",
        }}
      />

      {/* ── Trailing secondary orb (violet, slower) ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 300,
          height: 300,
          left: trailLeft,
          top: trailTop,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)",
        }}
      />

      {/* ── Static ambient pulse (always centred) ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 680,
          height: 680,
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background:
              p.id % 3 === 0
                ? "rgba(99,102,241,0.55)"
                : p.id % 3 === 1
                ? "rgba(139,92,246,0.5)"
                : "rgba(180,185,255,0.4)",
            boxShadow: `0 0 ${p.size * 4}px rgba(99,102,241,0.35)`,
          }}
          animate={{
            y: [0, p.driftY, 0],
            x: [0, p.driftX, 0],
            opacity: [0, 0.75, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-primary font-semibold tracking-[0.2em] uppercase mb-7"
        >
          AI / ML · Systems Engineering · Problem Solving
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-7xl md:text-[6.5rem] font-bold tracking-tight text-white mb-7 leading-none"
        >
          Soubhagya
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto mb-10"
        >
          I solve hard problems by building intelligent systems — combining machine
          learning, algorithms, and reliable infrastructure into software that works at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.4)]"
          >
            See My Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-white/12 text-white/80 font-medium text-sm hover:bg-white/5 hover:text-white transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
