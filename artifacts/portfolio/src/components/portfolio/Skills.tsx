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
    skills: ["Docker", "Kubernetes", "PostgreSQL", "Redis", "Kafka", "gRPC", "REST APIs"],
  },
  {
    category: "Tools & Workflow",
    skills: ["Git", "Linux", "AWS", "CI/CD", "Vim", "Jupyter"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="py-28 bg-[#0a0a0f] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Technical Skills</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">What I Work With</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Tools and technologies I've used across real projects — grouped by what they're for.
          </p>
        </motion.div>

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
              <h3 className="text-sm font-semibold text-white mb-5 pb-3 border-b border-white/8">
                {group.category}
              </h3>
              <div className="flex flex-col gap-2">
                {group.skills.map((skill, j) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.06 + j * 0.04 }}
                    className="flex items-center gap-2.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors flex-shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
