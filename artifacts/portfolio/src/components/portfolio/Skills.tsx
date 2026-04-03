import { motion } from "framer-motion";

const SKILL_GROUPS = [
  {
    category: "Programming",
    skills: ["C++", "Python", "Go", "TypeScript", "Rust"],
  },
  {
    category: "AI / Machine Learning",
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "HuggingFace", "ONNX", "CUDA"],
  },
  {
    category: "Backend & Infrastructure",
    skills: ["Docker", "Kubernetes", "PostgreSQL", "Redis", "Kafka", "gRPC"],
  },
  {
    category: "Tools & Workflow",
    skills: ["Git", "Linux", "AWS", "CI/CD", "Apache Kafka", "Jupyter"],
  },
];

// All skills that appear in at least one project — clicking these scrolls to and filters projects
const PROJECT_SKILLS = new Set([
  "Python", "PyTorch", "CUDA", "C++", "Go", "Docker", "Redis",
  "TCP/IP", "Linux", "Apache Kafka", "PostgreSQL", "ONNX", "HuggingFace",
]);

interface Props {
  activeSkill: string | null;
  onSkillClick: (skill: string) => void;
}

export function Skills({ activeSkill, onSkillClick }: Props) {
  return (
    <section id="skills" className="py-28 bg-[#0a0a0f] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Technical Skills</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What I Work With</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Technologies I use across real projects, grouped by purpose.
          </p>
        </motion.div>

        {/* Interactive hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-xs text-muted-foreground/60 mb-12"
        >
          Click a highlighted skill to filter projects that use it
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_GROUPS.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col"
            >
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-5 pb-3 border-b border-white/8">
                {group.category}
              </h3>
              <div className="flex flex-col gap-2.5">
                {group.skills.map((skill, j) => {
                  const isLinked = PROJECT_SKILLS.has(skill);
                  const isActive = activeSkill === skill;
                  return (
                    <motion.button
                      key={skill}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.06 + j * 0.04 }}
                      onClick={() => isLinked && onSkillClick(skill)}
                      disabled={!isLinked}
                      className={`flex items-center gap-2.5 text-left w-full rounded-lg px-2 py-1.5 transition-all ${
                        isLinked
                          ? isActive
                            ? "bg-primary/15 text-white cursor-pointer"
                            : "hover:bg-white/5 text-muted-foreground hover:text-white cursor-pointer"
                          : "text-muted-foreground/50 cursor-default"
                      }`}
                      title={isLinked ? `Filter projects using ${skill}` : undefined}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                          isActive
                            ? "bg-primary"
                            : isLinked
                            ? "bg-primary/50"
                            : "bg-white/15"
                        }`}
                      />
                      <span className="text-sm">{skill}</span>
                      {isLinked && !isActive && (
                        <span className="ml-auto text-[9px] text-primary/40 font-mono">→</span>
                      )}
                      {isActive && (
                        <span className="ml-auto text-[9px] text-primary font-bold">✓</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
