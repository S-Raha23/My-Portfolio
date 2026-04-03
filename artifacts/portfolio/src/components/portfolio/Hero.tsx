import { useEffect, useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// ─── Particle config ───────────────────────────────────────────────────────
const N = 85;
const REPEL_R = 140;
const REPEL_F = 3.8;
const CLICK_R = 220;
const CLICK_F = 9;
const MAX_SPEED = 6;
const IDLE_SPEED = 0.35;
const IDLE_DELAY = 2200; // ms

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  bvx: number; bvy: number; // base velocity (drift)
  r: number;   // radius
  hue: number; // 240–270 range
  alpha: number;
  maxAlpha: number;
}

interface Ripple { id: number; x: number; y: number }

// ─── Component ─────────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef(0);
  const particles  = useRef<Particle[]>([]);
  const mouse      = useRef({ x: -999, y: -999 });
  const impulse    = useRef<{ x: number; y: number } | null>(null);
  const isIdle     = useRef(false);
  const idleTimer  = useRef<ReturnType<typeof setTimeout>>();

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  // ── Orb motion values ───────────────────────────────────────────────────
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  // Primary orb — tight spring
  const px = useSpring(rawX, { stiffness: 85,  damping: 22, mass: 0.5 });
  const py = useSpring(rawY, { stiffness: 85,  damping: 22, mass: 0.5 });
  // Trail orb — heavy spring
  const tx = useSpring(rawX, { stiffness: 24,  damping: 14, mass: 1.6 });
  const ty = useSpring(rawY, { stiffness: 24,  damping: 14, mass: 1.6 });

  const pLeft  = useTransform(px, v => `${v * 100}%`);
  const pTop   = useTransform(py, v => `${v * 100}%`);
  const tLeft  = useTransform(tx, v => `${v * 100}%`);
  const tTop   = useTransform(ty, v => `${v * 100}%`);

  // Velocity-driven orb stretch
  const stretchX = useMotionValue(1);
  const stretchY = useMotionValue(1);
  const stretchR = useMotionValue(0);
  const sxS = useSpring(stretchX, { stiffness: 220, damping: 24 });
  const syS = useSpring(stretchY, { stiffness: 220, damping: 24 });
  const srS = useSpring(stretchR, { stiffness: 180, damping: 22 });

  // Click flash
  const orbOpacity = useMotionValue(0.92);
  const orbOpacityS = useSpring(orbOpacity, { stiffness: 300, damping: 18 });

  // ── Particle init ────────────────────────────────────────────────────────
  const initParticles = useCallback((w: number, h: number) => {
    particles.current = Array.from({ length: N }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd   = Math.random() * 0.35 + 0.08;
      const hue   = 238 + Math.random() * 30; // indigo–violet
      const maxA  = Math.random() * 0.45 + 0.15;
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd,
        bvx: Math.cos(angle) * spd, bvy: Math.sin(angle) * spd,
        r: Math.random() * 2.2 + 0.7,
        hue,
        alpha: maxA * 0.4,
        maxAlpha: maxA,
      };
    });
  }, []);

  // ── Render loop ──────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width: W, height: H } = canvas;
    ctx.clearRect(0, 0, W, H);

    const mx = mouse.current.x;
    const my = mouse.current.y;
    const imp = impulse.current;
    const idle = isIdle.current;
    const idleMul = idle ? 0.28 : 1;

    particles.current.forEach(p => {
      // Click impulse
      if (imp) {
        const dx = p.x - imp.x, dy = p.y - imp.y;
        const d  = Math.hypot(dx, dy);
        if (d < CLICK_R && d > 0) {
          const f = ((CLICK_R - d) / CLICK_R) * CLICK_F;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }

      // Cursor repulsion
      if (!idle) {
        const dx = p.x - mx, dy = p.y - my;
        const d  = Math.hypot(dx, dy);
        if (d < REPEL_R && d > 0) {
          const f = ((REPEL_R - d) / REPEL_R) * REPEL_F;
          p.vx += (dx / d) * f * 0.065;
          p.vy += (dy / d) * f * 0.065;
        }
        // Opacity — brighter near cursor
        const prox = d < REPEL_R ? 1 - d / REPEL_R : 0;
        p.alpha += (Math.min(1, p.maxAlpha + prox * 0.55) - p.alpha) * 0.06;
      } else {
        p.alpha += (p.maxAlpha * 0.4 - p.alpha) * 0.04;
      }

      // Drift return
      p.vx += (p.bvx * idleMul - p.vx) * 0.018;
      p.vy += (p.bvy * idleMul - p.vy) * 0.018;

      // Speed cap
      const spd = Math.hypot(p.vx, p.vy);
      const cap = idle ? IDLE_SPEED : MAX_SPEED;
      if (spd > cap) { p.vx = p.vx / spd * cap; p.vy = p.vy / spd * cap; }

      p.x += p.vx; p.y += p.vy;

      // Wrap
      if (p.x < -8) p.x = W + 8; if (p.x > W + 8) p.x = -8;
      if (p.y < -8) p.y = H + 8; if (p.y > H + 8) p.y = -8;

      // Draw particle
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
      grd.addColorStop(0,   `hsla(${p.hue},80%,70%,${p.alpha})`);
      grd.addColorStop(0.4, `hsla(${p.hue},80%,60%,${p.alpha * 0.5})`);
      grd.addColorStop(1,   `hsla(${p.hue},80%,60%,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    });

    if (imp) impulse.current = null;
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  // ── Canvas resize ────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const resize = () => {
      const { width, height } = section.getBoundingClientRect();
      canvas.width  = width;
      canvas.height = height;
      if (!particles.current.length) initParticles(width, height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [loop, initParticles]);

  // ── Mouse move ───────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const prev = mouse.current;
    const vx = x - prev.x;
    const vy = y - prev.y;
    mouse.current = { x, y };

    rawX.set((e.clientX - left) / width);
    rawY.set((e.clientY - top)  / height);

    // Orb stretch — based on cursor velocity
    const spd = Math.hypot(vx, vy);
    if (spd > 1) {
      const s = Math.min(spd * 0.016, 0.38);
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      stretchX.set(1 + s * 1.5);
      stretchY.set(1 - s * 0.5);
      stretchR.set(angle);
    }

    // Reset idle
    isIdle.current = false;
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      isIdle.current = true;
      stretchX.set(1); stretchY.set(1); stretchR.set(0);
    }, IDLE_DELAY);
  }, [rawX, rawY, stretchX, stretchY, stretchR]);

  // ── Click ────────────────────────────────────────────────────────────────
  const handleClick = useCallback((e: MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const { left, top } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    impulse.current = { x, y };

    // Orb flash
    orbOpacity.set(1);
    setTimeout(() => orbOpacity.set(0.92), 140);

    // Ripple
    const id = rippleId.current++;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 900);
  }, [orbOpacity]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("click", handleClick);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("click", handleClick);
    };
  }, [handleMouseMove, handleClick]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center bg-[#0a0a0f] overflow-hidden cursor-none md:cursor-auto"
    >
      {/* Canvas particle layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map(rpl => (
          <motion.div
            key={rpl.id}
            className="absolute rounded-full pointer-events-none border border-primary/50"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 5 }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 320, height: 320, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.75, ease: [0.2, 0.8, 0.4, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Second ripple ring (delayed) */}
      <AnimatePresence>
        {ripples.map(rpl => (
          <motion.div
            key={`${rpl.id}-b`}
            className="absolute rounded-full pointer-events-none border border-violet-500/30"
            style={{ left: rpl.x, top: rpl.y, translateX: "-50%", translateY: "-50%", zIndex: 5 }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 220, height: 220, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.4, 1], delay: 0.08 }}
          />
        ))}
      </AnimatePresence>

      {/* Primary cursor orb — stretches with velocity */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-1"
        style={{
          width: 520,
          height: 520,
          left: pLeft,
          top: pTop,
          translateX: "-50%",
          translateY: "-50%",
          scaleX: sxS,
          scaleY: syS,
          rotate: srS,
          opacity: orbOpacityS,
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0.07) 42%, transparent 68%)",
        }}
      />

      {/* Trail orb */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-1"
        style={{
          width: 320,
          height: 320,
          left: tLeft,
          top: tTop,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 65%)",
        }}
      />

      {/* Ambient static pulse */}
      <motion.div
        className="absolute pointer-events-none rounded-full z-0"
        style={{
          width: 700,
          height: 700,
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 62%)",
        }}
        animate={{ scale: [1, 1.09, 1], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_72%_72%_at_50%_50%,#000_18%,transparent_100%)]" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center select-none">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-primary font-semibold tracking-[0.22em] uppercase mb-7"
        >
          AI / ML · Systems Engineering · Problem Solving
        </motion.p>

        {/* Name — hover glow */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-7xl md:text-[6.5rem] font-bold tracking-tight text-white mb-7 leading-none cursor-default"
          whileHover={{
            textShadow: [
              "0 0 0px rgba(99,102,241,0)",
              "0 0 40px rgba(99,102,241,0.55), 0 0 80px rgba(139,92,246,0.25)",
            ],
            transition: { duration: 0.3 },
          }}
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
          {/* Primary CTA — pulsing glow + hover lift */}
          <motion.a
            href="#projects"
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm relative overflow-hidden"
            whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(99,102,241,0.55)" }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(99,102,241,0)",
                "0 0 16px rgba(99,102,241,0.35)",
                "0 0 0px rgba(99,102,241,0)",
              ],
            }}
            transition={{
              boxShadow: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            See My Work
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-white/12 text-white/80 font-medium text-sm"
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,1)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Get in Touch
          </motion.a>
        </motion.div>

        {/* Click hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-8 text-[11px] text-muted-foreground/40 tracking-widest uppercase"
        >
          Click anywhere to interact
        </motion.p>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground/50 tracking-[0.22em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/35 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
