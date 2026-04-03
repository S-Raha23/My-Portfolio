import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronRight, X } from "lucide-react";

export const PROJECTS = [
  {
    id: "nn-opt",
    category: "Machine Learning",
    title: "Neural Network Training Optimizer",
    tagline: "Making large AI model training accessible on standard hardware",
    problem:
      "Training large AI models requires enormous amounts of memory, making it impossible to run on standard hardware. Teams were either buying expensive cloud compute or being severely limited in model size.",
    approach:
      "Built a system that intelligently decides which intermediate data to keep in memory and which to recompute on demand. This reduces peak memory usage without significantly slowing down training.",
    impact:
      "Reduced memory usage by 40%, allowing models twice as large to be trained on the same hardware. Adopted by three university research labs.",
    stack: ["Python", "PyTorch", "CUDA", "C++"],
    github: "https://github.com",
    demo: null,
  },
  {
    id: "cp-judge",
    category: "Backend Systems",
    title: "Automated Code Evaluation Platform",
    tagline: "Safe, fast grading for 500+ competitive programming submissions per minute",
    problem:
      "Coding competitions need to run submitted code safely — hundreds of times per minute, from untrusted sources, with millisecond-accurate timing and no interference between runs.",
    approach:
      "Built a distributed evaluation system that runs each submission in an isolated container with strict resource limits, connected via a message queue to handle traffic spikes without dropping submissions.",
    impact:
      "Handles 500+ submissions per minute with sub-50ms overhead. Ran a 1,000-person university hackathon with zero security incidents.",
    stack: ["Go", "Docker", "Redis", "C++"],
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: "kv-store",
    category: "Distributed Systems",
    title: "High-Performance Key-Value Store",
    tagline: "120,000 operations per second with built-in fault tolerance",
    problem:
      "Real-time applications like leaderboards need sub-millisecond read/write speeds that traditional relational databases cannot sustain under concurrent load.",
    approach:
      "Built an in-memory database from scratch in C++ with replication across multiple servers using a consensus algorithm, so data is never lost even if a machine goes down.",
    impact:
      "Achieves 120,000 operations/second on a 3-node cluster. 65% lower latency than comparable solutions under heavy write load.",
    stack: ["C++", "TCP/IP", "Raft Consensus", "Linux"],
    github: "https://github.com",
    demo: null,
  },
  {
    id: "rec-engine",
    category: "Machine Learning",
    title: "Real-Time Recommendation Engine",
    tagline: "From 24-hour stale suggestions to recommendations that update in seconds",
    problem:
      "Most recommendation systems run on a daily batch schedule — so even if a user's behavior changes, they keep seeing outdated suggestions for hours.",
    approach:
      "Built a streaming ML pipeline that continuously updates user preference models as new interactions arrive, serving refreshed recommendations within seconds rather than the next day.",
    impact:
      "Reduced recommendation staleness from 24 hours to under 30 seconds. Improved click-through rate by 18% in A/B testing.",
    stack: ["Python", "Apache Kafka", "Redis", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://example.com",
  },
];

interface Props {
  activeSkill: string | null;
  onClearSkill: () => void;
}

export function Projects({ activeSkill, onClearSkill }: Props) {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);

  const filtered = activeSkill
    ? PROJECTS.filter((p) =>
        p.stack.some((s) => s.toLowerCase() === activeSkill.toLowerCase())
      )
    : PROJECTS;

  // When skill filter changes, select first matching project
  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((p) => p.id === activeId)) {
      setActiveId(filtered[0].id);
    }
  }, [activeSkill]);

  const active = filtered.find((p) => p.id === activeId) ?? filtered[0];

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
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Work</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Problems I've Solved</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Each project starts with a real constraint. Here's how I thought through it.
          </p>
        </motion.div>

        {/* Skill filter banner */}
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center justify-between px-5 py-3 rounded-xl border border-primary/30 bg-primary/8"
            >
              <p className="text-sm text-white">
                Showing projects using{" "}
                <span className="font-semibold text-primary">{activeSkill}</span>
                {filtered.length === 0 && (
                  <span className="text-muted-foreground ml-2">— no direct matches, showing all</span>
                )}
              </p>
              <button
                onClick={onClearSkill}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No projects directly use <span className="text-white font-medium">{activeSkill}</span>. Try another skill or{" "}
            <button onClick={onClearSkill} className="text-primary underline underline-offset-2">clear the filter</button>.
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-2">
              {filtered.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setActiveId(proj.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-start justify-between group ${
                    activeId === proj.id
                      ? "bg-primary/10 border-primary/40 text-white"
                      : "border-white/8 text-muted-foreground hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">{proj.category}</div>
                    <div className="font-medium text-sm leading-snug">{proj.title}</div>
                    <div className="text-xs text-muted-foreground/60 mt-1 line-clamp-2">{proj.tagline}</div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 ml-2 mt-1 transition-transform ${
                      activeId === proj.id ? "text-primary translate-x-0.5" : "opacity-0"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="p-8 rounded-2xl border border-white/8 bg-white/[0.02]"
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <span className="text-xs text-primary font-semibold tracking-widest uppercase">{active.category}</span>
                      <h3 className="text-2xl font-bold text-white mt-1 mb-1">{active.title}</h3>
                      <p className="text-sm text-muted-foreground">{active.tagline}</p>
                    </div>

                    {/* Case study */}
                    <div className="space-y-5 mb-8">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">The Problem</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{active.problem}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">My Approach</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{active.approach}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/[0.04] border border-primary/15">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Result</h4>
                        <p className="text-white text-sm leading-relaxed font-medium">{active.impact}</p>
                      </div>
                    </div>

                    {/* Footer: stack + links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/8">
                      <div className="flex flex-wrap gap-2">
                        {active.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md bg-white/4 border border-white/8 text-xs text-gray-400 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={active.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-muted-foreground hover:text-white hover:border-white/20 transition-colors font-medium"
                        >
                          <Github className="w-3.5 h-3.5" /> View Code
                        </a>
                        {active.demo && (
                          <a
                            href={active.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs hover:bg-primary/90 transition-colors font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
