import { motion } from "framer-motion";

const SKILL_CLUSTERS = [
  {
    category: "ML / AI Systems",
    skills: ["PyTorch", "TensorFlow", "CUDA", "TRT", "ONNX", "HuggingFace"]
  },
  {
    category: "Languages & Core",
    skills: ["C++ (C++17/20)", "Python", "Go", "Rust", "TypeScript"]
  },
  {
    category: "Infrastructure & Backend",
    skills: ["Docker", "Kubernetes", "gRPC", "Redis", "Kafka", "PostgreSQL"]
  },
  {
    category: "Algorithms",
    skills: ["Dynamic Programming", "Graph Theory", "Advanced Data Structures", "Optimization"]
  }
];

export function Skills() {
  return (
    <section className="py-32 bg-[#0a0a0f] border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Technical <br/><span className="text-muted-foreground">Capabilities</span></h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-8"></div>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              I don't just learn syntax; I learn paradigms. My stack is chosen based on system requirements—whether it needs low-level memory control, distributed scalability, or rapid ML prototyping.
            </p>
          </motion.div>

          <div className="space-y-8">
            {SKILL_CLUSTERS.map((cluster, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h4 className="font-mono text-sm text-white mb-4 border-b border-white/10 pb-2">{cluster.category}</h4>
                <div className="flex flex-wrap gap-2">
                  {cluster.skills.map((skill, j) => (
                    <motion.span 
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: j * 0.05 }}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-gray-300 text-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
