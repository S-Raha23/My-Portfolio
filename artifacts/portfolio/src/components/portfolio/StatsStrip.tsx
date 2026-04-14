import { motion } from "framer-motion";

const STATS = [
  { value: "1st Place", label: "Global ML Hackathon · 200+ teams" },
  { value: "120k", label: "ops/sec · Key-Value Store" },
  { value: "40%", label: "memory reduction · NN Optimizer" },
  { value: "500+", label: "submissions/min · Code Judge" },
  { value: "Top 10", label: "ICPC Regional · 500+ teams" },
];

export function StatsStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 border-y border-border/40 bg-background/40 backdrop-blur-sm py-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-center gap-3"
            >
              {i > 0 && (
                <span className="hidden sm:block w-px h-6 bg-border/50" />
              )}
              <div className="text-center sm:text-left">
                <span className="font-mono text-lg font-bold text-primary">{stat.value}</span>
                <span className="ml-2 text-xs text-muted-foreground">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
