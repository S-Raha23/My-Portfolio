import { motion } from "framer-motion";

const TIMELINE = [
  {
    year: "2024",
    title: "Software Engineering Intern",
    org: "Tech Giant Corp",
    desc: "Optimized ML inference pipelines for ad serving. Reduced latency by 15% saving $200k+ annually in compute costs."
  },
  {
    year: "2023",
    title: "1st Place - Global ML Hackathon",
    org: "OpenAI & Partners",
    desc: "Built a multi-modal RAG system over legal documents. Praised for architectural scalability and accuracy."
  },
  {
    year: "2022",
    title: "Open Source Contributor",
    org: "PyTorch Lightning",
    desc: "Implemented optimized CUDA kernels for specialized attention mechanisms, merged into main branch."
  },
  {
    year: "2021",
    title: "ICPC Regional Finalist",
    org: "Competitive Programming",
    desc: "Ranked top 10 among 500+ teams. Specialized in graph algorithms and dynamic programming."
  }
];

export function Timeline() {
  return (
    <section id="timeline" className="py-32 bg-[#050508]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Execution <br/><span className="text-muted-foreground">Log</span></h2>
          <div className="w-20 h-1 bg-primary rounded-full mx-auto"></div>
        </motion.div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0 md:left-1/2 md:-translate-x-px">
          {TIMELINE.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`mb-12 relative pl-8 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}
            >
              <div className="absolute top-0 left-[-41px] md:left-[-33px] w-4 h-4 rounded-full bg-black border-2 border-primary ring-4 ring-black" />
              
              <div className="font-mono text-primary text-sm mb-2">{item.year}</div>
              <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
              <div className="text-sm text-gray-400 mb-3">{item.org}</div>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
