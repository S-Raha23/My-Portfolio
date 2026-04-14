import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, ChevronRight, X, Server, Brain, Eye, MessageSquare, Database, Layers } from "lucide-react";

// ── Domain filter config ─────────────────────────────────────────────────────
const DOMAINS = [
  {
    id: "Backend Systems",
    label: "Backend Systems",
    icon: Server,
    color: "text-blue-400",
    activeBg: "bg-blue-500/12",
    activeBorder: "border-blue-500/40",
    activeText: "text-blue-300",
    hoverBg: "hover:bg-blue-500/8",
    hoverBorder: "hover:border-blue-500/30",
    hoverText: "hover:text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
  },
  {
    id: "Machine Learning",
    label: "Machine Learning",
    icon: Brain,
    color: "text-teal-400",
    activeBg: "bg-teal-500/12",
    activeBorder: "border-teal-500/40",
    activeText: "text-teal-300",
    hoverBg: "hover:bg-teal-500/8",
    hoverBorder: "hover:border-teal-500/30",
    hoverText: "hover:text-teal-400",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.15)]",
  },
  {
    id: "Computer Vision",
    label: "Computer Vision",
    icon: Eye,
    color: "text-violet-400",
    activeBg: "bg-violet-500/12",
    activeBorder: "border-violet-500/40",
    activeText: "text-violet-300",
    hoverBg: "hover:bg-violet-500/8",
    hoverBorder: "hover:border-violet-500/30",
    hoverText: "hover:text-violet-400",
    glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]",
  },
  {
    id: "NLP",
    label: "NLP",
    icon: MessageSquare,
    color: "text-emerald-400",
    activeBg: "bg-emerald-500/12",
    activeBorder: "border-emerald-500/40",
    activeText: "text-emerald-300",
    hoverBg: "hover:bg-emerald-500/8",
    hoverBorder: "hover:border-emerald-500/30",
    hoverText: "hover:text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
  },
  {
    id: "Distributed Systems",
    label: "Distributed",
    icon: Database,
    color: "text-orange-400",
    activeBg: "bg-orange-500/12",
    activeBorder: "border-orange-500/40",
    activeText: "text-orange-300",
    hoverBg: "hover:bg-orange-500/8",
    hoverBorder: "hover:border-orange-500/30",
    hoverText: "hover:text-orange-400",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]",
  },
  {
    id: "Full Stack",
    label: "Full Stack",
    icon: Layers,
    color: "text-pink-400",
    activeBg: "bg-pink-500/12",
    activeBorder: "border-pink-500/40",
    activeText: "text-pink-300",
    hoverBg: "hover:bg-pink-500/8",
    hoverBorder: "hover:border-pink-500/30",
    hoverText: "hover:text-pink-400",
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.15)]",
  },
] as const;

type DomainId = typeof DOMAINS[number]["id"];

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — add new projects by copying any entry below and filling the fields.
// Fields:
//   id          — unique slug (no spaces)
//   category    — display label shown on the card
//   domain      — must match one of the DomainId values above for filtering
//   title       — project name
//   tagline     — one-line summary
//   complexity  — 1 | 2 | 3  (shown as filled dots)
//   problem     — what problem you were solving
//   approach    — how you solved it
//   impact      — measurable outcome / result
//   stack       — array of tech used (should overlap with PROJECT_SKILLS in Skills.tsx)
//   github      — repo URL
//   demo        — live URL or null
// ─────────────────────────────────────────────────────────────────────────────
export const PROJECTS = [
  // ── Computer Vision ────────────────────────────────────────────────────────
  {
    id: "deepfake-detection",
    category: "Computer Vision",
    domain: "Computer Vision" as DomainId,
    title: "Deepfake Video Detection Model",
    tagline: "96% accuracy on DFDC & FaceForensics++ using multi-modal deep learning",
    complexity: 3,
    problem:
      "Deepfake videos are increasingly indistinguishable from real footage, posing serious threats to multimedia security. Existing detectors fail to generalise across different generation methods and struggle under adversarial inputs.",
    approach:
      "Designed a multi-modal deep learning model combining EfficientNet + CBAM attention. Fused three parallel streams — RGB frames, FFT frequency maps, and motion residuals — to capture spatial, frequency, and temporal artefacts simultaneously. Trained with Adam optimiser on large-scale video pipelines.",
    impact:
      "Achieved 96% accuracy on DFDC, FaceForensics++, and Celeb-DF benchmarks. The multi-stream fusion significantly improved robustness to unseen deepfake generation techniques.",
    stack: ["Python", "PyTorch", "TensorFlow", "OpenCV", "NumPy"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
  {
    id: "camera-calibration",
    category: "Computer Vision",
    domain: "Computer Vision" as DomainId,
    title: "Camera Calibration & Pose Detection",
    tagline: "Real-time 3D pose estimation with <1% orientation error using OpenCV",
    complexity: 3,
    problem:
      "Accurate 3D localisation from a single camera is critical for robotics and spatially-aware systems, but standard calibration pipelines suffer from high reprojection error and poor real-time performance.",
    approach:
      "Developed a full calibration pipeline using checkerboard patterns and OpenCV pose estimation. Extracted high-resolution frames for sub-pixel accuracy. Applied ArUco marker detection with the solvePnP algorithm for real-time camera position and orientation estimation.",
    impact:
      "Achieved <2% reprojection error overall, reducing it by over 30% vs baseline. Real-time orientation estimation runs with less than 1% error — applicable to robotics and AR environments.",
    stack: ["Python", "OpenCV", "NumPy"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
  // ── NLP ────────────────────────────────────────────────────────────────────
  {
    id: "cp-chatbot",
    category: "NLP",
    domain: "NLP" as DomainId,
    title: "AI Chatbot for Competitive Programming",
    tagline: "Semantic code search and context-aware debugging using BERT-based LLMs",
    complexity: 3,
    problem:
      "Competitive programmers waste hours searching for relevant problems, editorial explanations, and debugging help across scattered sources. There was no unified intelligent assistant for the Codeforces ecosystem.",
    approach:
      "Built a BeautifulSoup + Selenium scraping pipeline to extract and structure Codeforces content into a fast-retrieval JSON knowledge base. Integrated Sentence-BERT with CodeBERT to enable semantic search and natural-language code generation. Added a custom module to locate logical errors and generate context-aware debugging suggestions.",
    impact:
      "Delivered at Google Developer's Club, IIT Kanpur. Enables semantic search over thousands of problems and generates debugging hints matched to the user's specific code context.",
    stack: ["Python", "BeautifulSoup", "Selenium", "Sentence-BERT", "CodeBERT"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
  // ── Machine Learning ───────────────────────────────────────────────────────
  {
    id: "robotic-arm-ml",
    category: "Machine Learning",
    domain: "Machine Learning" as DomainId,
    title: "ML-Based Robotic Arm End-Effector Prediction",
    tagline: "Predicting 3D end-effector position of a 6-DOF arm from joint angles",
    complexity: 2,
    problem:
      "Solving forward kinematics analytically for a 6-DOF robotic arm is computationally expensive and brittle under noisy sensor inputs. A data-driven approach could learn the nonlinear joint-to-Cartesian mapping more efficiently.",
    approach:
      "Built a Random Forest regression model in Python with scikit-learn, trained on preprocessed joint-angle datasets. Fine-tuned hyperparameters and validated predictions against analytical forward kinematics to verify accuracy across the full workspace.",
    impact:
      "Model accurately predicts (x, y, z) end-effector positions across the 3D workspace. True vs predicted trajectory plots confirmed strong generalisation with minimal deviation from analytical solutions.",
    stack: ["Python", "Scikit-learn", "NumPy", "Pandas", "Matplotlib", "MATLAB"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
  // ── Full Stack ─────────────────────────────────────────────────────────────
  {
    id: "online-judge",
    category: "Full Stack",
    domain: "Full Stack" as DomainId,
    title: "Online Judge Web Application",
    tagline: "Scalable code evaluation platform with sandboxed C/C++ execution",
    complexity: 3,
    problem:
      "Building a reliable online judge requires safely executing untrusted code at scale — with strict resource limits, accurate verdicts, and low latency — while keeping the architecture maintainable and extensible.",
    approach:
      "Built the full platform with React + Vite on the frontend and Node.js + Express on the backend. Designed secure, sandboxed code execution pipelines for C/C++ with input/output matching. Architected a modular system for language selection and live verdict delivery using interface-driven, object-oriented design.",
    impact:
      "Platform supports real-time code submission and evaluation with live verdicts. Modular architecture makes adding new languages straightforward without touching core execution logic.",
    stack: ["ReactJS", "Node.js", "Express", "C++", "JavaScript"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
  // ── Backend Systems ────────────────────────────────────────────────────────
  {
    id: "student-db",
    category: "Backend Systems",
    domain: "Backend Systems" as DomainId,
    title: "Student Database Management System",
    tagline: "Relational backend for student-professor-course data with automated reporting",
    complexity: 2,
    problem:
      "Academic institutions manage complex relationships between students, professors, and courses. Manual data handling leads to redundancy, integrity violations, and slow report generation.",
    approach:
      "Designed normalised SQL schemas with proper foreign key constraints to maintain referential integrity. Built a Python-MySQL backend to automate data insertion, complex queries, and academic report generation. Documented and tested all workflows in Jupyter Notebook.",
    impact:
      "Eliminated data redundancy through normalisation. Automated report generation reduced query time to near-zero latency. Full workflow documented and reproducible via Jupyter.",
    stack: ["Python", "SQL", "Jupyter"],
    github: "https://github.com/S-Raha23",
    demo: null,
  },
];

interface Props {
  activeSkill: string | null;
  onClearSkill: () => void;
}

export function Projects({ activeSkill, onClearSkill }: Props) {
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null);
  const [activeId, setActiveId] = useState(PROJECTS[0].id);

  const filtered = PROJECTS.filter((p) => {
    const domainMatch = activeDomain ? p.domain === activeDomain : true;
    const skillMatch  = activeSkill  ? p.stack.some((s) => s.toLowerCase() === activeSkill.toLowerCase()) : true;
    return domainMatch && skillMatch;
  });

  useEffect(() => {
    if (filtered.length > 0 && !filtered.find((p) => p.id === activeId)) {
      setActiveId(filtered[0].id);
    }
  }, [activeDomain, activeSkill]);

  const active = filtered.find((p) => p.id === activeId) ?? filtered[0];
  const toggleDomain = (id: DomainId) => setActiveDomain((prev) => (prev === id ? null : id));

  return (
    <section id="projects" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Work</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Problems I've Solved</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Every project here started with a constraint someone said couldn't be solved efficiently. Here's how I thought through it.
          </p>
        </motion.div>

        {/* Domain filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          {DOMAINS.map((d, i) => {
            const Icon = d.icon;
            const isActive = activeDomain === d.id;
            const count = PROJECTS.filter((p) => p.domain === d.id).length;
            return (
              <motion.button
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleDomain(d.id)}
                className={[
                  "group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium",
                  "transition-all duration-200 select-none outline-none cursor-pointer",
                  isActive
                    ? `${d.activeBg} ${d.activeBorder} ${d.activeText} ${d.glow}`
                    : `bg-card border-border text-muted-foreground ${d.hoverBg} ${d.hoverBorder} ${d.hoverText}`,
                ].join(" ")}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span>{d.label}</span>
                <span className={[
                  "ml-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded-md transition-colors duration-200",
                  isActive ? "bg-white/10 text-current" : "bg-muted text-muted-foreground/70",
                ].join(" ")}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Active filters row */}
        <AnimatePresence>
          {(activeDomain || activeSkill) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-muted-foreground">Filtered by:</span>
              {activeDomain && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs text-primary font-medium">
                  {activeDomain}
                  <button onClick={() => setActiveDomain(null)} className="hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {activeSkill && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs text-primary font-medium">
                  {activeSkill}
                  <button onClick={onClearSkill} className="hover:text-foreground transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <span className="text-xs text-muted-foreground">— {filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
              <button
                onClick={() => { setActiveDomain(null); onClearSkill(); }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-muted-foreground mb-3">No projects match the current filters.</p>
            <button
              onClick={() => { setActiveDomain(null); onClearSkill(); }}
              className="text-sm text-primary hover:underline underline-offset-2"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar — fixed height, scrollable */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div
                className="relative flex flex-col gap-2 overflow-y-auto pr-1"
                style={{ maxHeight: "600px", scrollbarWidth: "none" }}
              >
                <AnimatePresence mode="popLayout">
                {filtered.map((proj) => {
                  const domain = DOMAINS.find((d) => d.id === proj.domain);
                  return (
                    <motion.button
                      key={proj.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.22 }}
                      onClick={() => setActiveId(proj.id)}
                      className={[
                        "w-full text-left px-5 py-4 rounded-xl border transition-all flex items-start justify-between group",
                        activeId === proj.id
                          ? "bg-primary/10 border-primary/40 text-foreground shadow-[0_0_16px_rgba(37,99,235,0.12)]"
                          : "border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:border-primary/20",
                      ].join(" ")}
                    >
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${domain?.color ?? "text-muted-foreground"}`}>
                          {proj.category}
                        </div>
                        <div className="font-medium text-sm leading-snug">{proj.title}</div>
                        <div className="text-xs text-muted-foreground/60 mt-1 line-clamp-2">{proj.tagline}</div>
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <span className="text-[9px] font-mono text-muted-foreground/50 uppercase tracking-widest">Complexity</span>
                          <div className="flex gap-0.5">
                            {[1,2,3].map(n => (
                              <div key={n} className={`w-3 h-1 rounded-full transition-colors ${n <= proj.complexity ? "bg-primary" : "bg-border"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-2 mt-1 transition-transform ${activeId === proj.id ? "text-primary translate-x-0.5" : "opacity-0"}`} />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              </div>
              {/* Fade mask — hints there's more to scroll */}
              <div className="pointer-events-none h-8 -mt-8 bg-gradient-to-t from-background to-transparent rounded-b-xl" />
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
                    className="p-8 rounded-2xl border border-border bg-card"
                  >
                    <div className="mb-6">
                      <span className="text-xs text-primary font-mono font-semibold tracking-widest uppercase">{active.category}</span>
                      <h3 className="text-2xl font-bold text-foreground mt-1 mb-1">{active.title}</h3>
                      <p className="text-sm text-muted-foreground">{active.tagline}</p>
                    </div>
                    <div className="space-y-5 mb-8">
                      <div className="p-4 rounded-xl bg-muted/40 border border-border">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">The Problem</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{active.problem}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/40 border border-border">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">My Approach</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{active.approach}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/[0.06] border border-primary/20">
                        <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Result</h4>
                        <p className="text-foreground text-sm leading-relaxed font-medium">{active.impact}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-border">
                      <div className="flex flex-wrap gap-2">
                        {active.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md bg-muted border border-border text-xs text-muted-foreground font-mono hover:border-primary/40 hover:text-primary hover:bg-primary/8 transition-all duration-200 cursor-default"
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
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/40 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/8 hover:shadow-[0_0_12px_rgba(37,99,235,0.15)] transition-all duration-200 font-medium"
                        >
                          <Github className="w-3.5 h-3.5" /> View Code
                        </a>
                        {active.demo && (
                          <a
                            href={active.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/80 hover:shadow-[0_0_18px_rgba(37,99,235,0.4)] transition-all duration-200 font-medium"
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

          </motion.div>
        )}
      </div>
    </section>
  );
}
