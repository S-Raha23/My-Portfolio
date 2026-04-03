import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronRight } from "lucide-react";

const PROJECTS = [
  {
    id: "nn-opt",
    title: "Aether: Neural Optimizer",
    type: "ML Systems",
    problem: "Training deep neural networks is memory-bound. Backpropagation stores intermediate activations, causing OOM errors on large batch sizes.",
    solution: "Built a custom gradient checkpointing engine in PyTorch that selectively recomputes activations, reducing memory footprint by 40% with only a 12% compute overhead.",
    impact: "Allowed training of 2B parameter models on single consumer-grade GPUs. Open-sourced and adopted by 3 research labs.",
    stack: ["PyTorch", "CUDA", "Python", "C++"],
  },
  {
    id: "cp-judge",
    title: "Onyx Judge",
    type: "DSA & Infrastructure",
    problem: "Existing auto-graders for competitive programming struggle with concurrent submissions and isolated execution without high latency.",
    solution: "Engineered a distributed code evaluation engine using Docker, seccomp, and cgroups. Orchestrated via Go and Redis message queues.",
    impact: "Evaluates 500+ submissions per minute with <50ms overhead per run. Zero security breaches during a 1,000-user university hackathon.",
    stack: ["Go", "C++", "Docker", "Redis", "gRPC"],
  },
  {
    id: "kv-store",
    title: "HelixKV",
    type: "Distributed Systems",
    problem: "High-throughput real-time leaderboards require sub-millisecond read/write latencies that traditional relational databases cannot sustain.",
    solution: "Implemented an in-memory distributed key-value store from scratch in C++. Used the Raft consensus algorithm for fault tolerance and a custom LSM-tree for persistence.",
    impact: "Achieved 120k QPS on a 3-node cluster. Reduced P99 latency by 65% compared to baseline Redis under heavy write loads.",
    stack: ["C++", "Raft", "TCP/IP", "Linux Epoll"],
  },
];

export function Projects() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);

  return (
    <section id="projects" className="py-32 relative bg-[#0a0a0f] border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex justify-between items-end"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Engineered <br/><span className="text-muted-foreground">Solutions</span></h2>
            <div className="w-20 h-1 bg-primary rounded-full"></div>
          </div>
          <div className="hidden md:block text-right font-mono text-sm text-muted-foreground">
            // SELECT_CASE_STUDY
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* List */}
          <div className="w-full lg:w-1/3 space-y-4">
            {PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveId(proj.id)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex items-center justify-between ${
                  activeId === proj.id 
                    ? "bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                    : "border-white/5 bg-transparent text-muted-foreground hover:bg-white/5"
                }`}
              >
                <div>
                  <div className="font-mono text-xs mb-1 opacity-70">{proj.type}</div>
                  <div className="font-semibold text-lg">{proj.title}</div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform ${activeId === proj.id ? "text-primary translate-x-1" : "opacity-0"}`} />
              </button>
            ))}
          </div>

          {/* Details */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              {PROJECTS.map((proj) => 
                proj.id === activeId ? (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm h-full flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="text-3xl font-bold text-white">{proj.title}</h3>
                      <div className="flex gap-3">
                        <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-6 flex-grow">
                      <div>
                        <h4 className="text-primary font-mono text-sm mb-2 uppercase tracking-wider">The Problem</h4>
                        <p className="text-muted-foreground leading-relaxed">{proj.problem}</p>
                      </div>
                      <div>
                        <h4 className="text-primary font-mono text-sm mb-2 uppercase tracking-wider">Architecture & Decisions</h4>
                        <p className="text-muted-foreground leading-relaxed">{proj.solution}</p>
                      </div>
                      <div>
                        <h4 className="text-primary font-mono text-sm mb-2 uppercase tracking-wider">Impact</h4>
                        <p className="text-white font-medium">{proj.impact}</p>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap gap-2">
                      {proj.stack.map(tech => (
                        <span key={tech} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
