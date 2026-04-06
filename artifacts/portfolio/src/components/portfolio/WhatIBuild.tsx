import { motion } from "framer-motion";
import { BrainCircuit, Code2, Database, Cpu } from "lucide-react";

const PILLARS = [
  {
    icon: BrainCircuit,
    title: "Machine Learning & AI",
    desc: "I design and deploy ML models that work at scale — from training neural networks to serving real-time predictions in production environments.",
  },
  {
    icon: Code2,
    title: "Algorithms & Problem Solving",
    desc: "Strong foundation in data structures and algorithms through competitive programming. I write efficient, correct code under constraints.",
  },
  {
    icon: Database,
    title: "Backend Systems",
    desc: "I build reliable backend services and APIs — distributed systems, databases, and infrastructure that handle real-world load.",
  },
  {
    icon: Cpu,
    title: "Performance Engineering",
    desc: "I optimize software for speed — profiling bottlenecks, reducing memory usage, and getting more done with fewer resources.",
  },
];

export function WhatIBuild() {
  return (
    <section id="about" className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">About Me</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">What I Do</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            I combine deep technical knowledge with practical engineering to build software that is both intelligent and reliable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-2xl border border-border bg-card hover:bg-card/80 transition-colors"
              >
                <div className="mb-5 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
