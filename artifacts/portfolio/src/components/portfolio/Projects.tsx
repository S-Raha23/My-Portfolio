import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronRight } from "lucide-react";

const PROJECTS = [
  {
    id: "nn-opt",
    category: "Machine Learning",
    title: "Neural Network Training Optimizer",
    problem: "Training large AI models requires enormous amounts of memory, making it impossible to run on standard hardware. Teams were either buying expensive cloud compute or being limited in what models they could train.",
    approach: "Built a system that selectively saves and recomputes intermediate data during training. This reduces memory usage significantly without slowing down training by much.",
    impact: "Reduced memory usage by 40%, allowing models 2x as large to be trained on the same hardware. Adopted by three university research labs.",
    stack: ["Python", "PyTorch", "CUDA", "C++"],
  },
  {
    id: "cp-judge",
    category: "Backend Systems",
    title: "Automated Code Evaluation Platform",
    problem: "Online coding competitions need to run submitted code safely and quickly — hundreds of submissions per minute, from untrusted sources, with millisecond-accurate timing.",
    approach: "Built a distributed evaluation system that runs each submission in an isolated container with strict resource limits. Uses a message queue to handle high submission volume reliably.",
    impact: "Evaluates 500+ submissions per minute. Successfully ran a 1,000-person university hackathon with zero security issues.",
    stack: ["Go", "Docker", "Redis", "C++"],
  },
  {
    id: "kv-store",
    category: "Distributed Systems",
    title: "High-Performance Key-Value Store",
    problem: "Real-time applications like leaderboards need to read and write data extremely fast — often faster than traditional databases can provide.",
    approach: "Built an in-memory database from scratch in C++, with built-in replication across multiple servers so data is never lost even if a machine goes down.",
    impact: "Handles 120,000 operations per second on a 3-server setup. 65% faster than comparable off-the-shelf solutions under heavy load.",
    stack: ["C++", "TCP/IP", "Raft Consensus", "Linux"],
  },
  {
    id: "rec-engine",
    category: "Machine Learning",
    title: "Real-Time Recommendation Engine",
    problem: "Most recommendation systems are batch-processed — they update once a day. This means users see outdated suggestions even after their preferences clearly change.",
    approach: "Built a streaming ML pipeline that updates user preference models in real time as new interactions come in, serving fresh recommendations within seconds.",
    impact: "Reduced recommendation staleness from 24 hours to under 30 seconds. Improved click-through rate by 18% in A/B testing.",
    stack: ["Python", "Apache Kafka", "Redis", "PostgreSQL"],
  },
];

export function Projects() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const active = PROJECTS.find((p) => p.id === activeId)!;

  return (
    <section id="projects" className="py-28 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Projects</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Things I've Built</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A selection of projects that demonstrate how I approach real problems — with clear thinking and solid engineering.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar selector */}
          <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-2">
            {PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveId(proj.id)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center justify-between group ${
                  activeId === proj.id
                    ? "bg-primary/10 border-primary/40 text-white"
                    : "border-white/8 text-muted-foreground hover:bg-white/4 hover:text-white"
                }`}
              >
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{proj.category}</div>
                  <div className="font-medium text-sm leading-snug">{proj.title}</div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${
                    activeId === proj.id ? "text-primary translate-x-0.5" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="h-full p-8 rounded-2xl border border-white/8 bg-white/[0.02]"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs text-primary font-medium tracking-wider uppercase">{active.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-1">{active.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                      aria-label="Live demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">The Problem</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{active.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">My Approach</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{active.approach}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Result</h4>
                    <p className="text-white text-sm leading-relaxed font-medium">{active.impact}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/8 flex flex-wrap gap-2">
                  {active.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-md bg-white/4 border border-white/8 text-xs text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
