import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center justify-center bg-[#0a0a0f] overflow-hidden"
    >
      {/* Animated ambient orbs */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
          top: "30%",
          left: "60%",
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_30%,transparent_100%)]" />

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
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
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

      {/* Scroll indicator */}
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
