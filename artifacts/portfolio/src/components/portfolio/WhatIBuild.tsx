import { motion } from "framer-motion";
import { Database, BrainCircuit, Terminal, Cpu } from "lucide-react";

const PILLARS = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "ML / AI Systems",
    desc: "Designing and deploying neural networks that scale. From PyTorch internals to tensor optimization.",
  },
  {
    icon: <Terminal className="w-8 h-8 text-primary" />,
    title: "Algorithmic Depth",
    desc: "Competitive programming veteran. Expert in C++, dynamic programming, and graph theory.",
  },
  {
    icon: <Database className="w-8 h-8 text-primary" />,
    title: "Infrastructure",
    desc: "Building distributed systems, key-value stores, and microservices that handle high throughput.",
  },
  {
    icon: <Cpu className="w-8 h-8 text-primary" />,
    title: "Low-Level Optimization",
    desc: "Memory management, cache-aware data structures, and squeezing every ounce of performance.",
  }
];

export function WhatIBuild() {
  return (
    <section id="about" className="py-32 relative bg-[#050508]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">The Architecture<br/><span className="text-muted-foreground">of My Work</span></h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="mb-6 p-4 rounded-xl bg-black/50 inline-block border border-white/5 group-hover:border-primary/50 transition-colors">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
