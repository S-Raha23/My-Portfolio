import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    type: "Experience",
    title: "Software Engineering Intern",
    org: "Tech Company (Internship)",
    period: "May 2024 – Aug 2024",
    responsibilities: [
      "Worked on the ML infrastructure team to improve how the company serves AI model predictions to millions of users",
      "Identified and fixed bottlenecks in the data pipeline that was slowing down model responses",
      "Wrote internal tooling to help engineers monitor model performance in real time",
    ],
    impact: "Reduced average response time by 15%, saving over $200,000 annually in cloud computing costs.",
  },
  {
    type: "Hackathon",
    title: "1st Place — Global ML Hackathon",
    org: "Organized by OpenAI & Partners",
    period: "October 2023",
    responsibilities: [
      "Led a team of 3 to build an AI assistant that could answer questions over large legal document collections",
      "Designed the system architecture and handled the ML components",
      "Presented and demoed to a panel of senior engineers and investors",
    ],
    impact: "Won 1st place out of 200+ teams. Judges noted the system's accuracy and ability to scale.",
  },
  {
    type: "Open Source",
    title: "Contributor — PyTorch Lightning",
    org: "Open Source Community",
    period: "2022 – Present",
    responsibilities: [
      "Identified a performance gap in how certain AI training operations were handled",
      "Wrote optimized low-level code to speed up those operations",
      "Submitted code review, responded to feedback, and had changes accepted into the main codebase",
    ],
    impact: "Contribution merged into production, now used by thousands of ML engineers worldwide.",
  },
  {
    type: "Achievement",
    title: "ICPC Regional Finalist",
    org: "International Collegiate Programming Contest",
    period: "2021",
    responsibilities: [
      "Competed in one of the world's most prestigious programming competitions",
      "Solved complex algorithmic problems under strict time limits",
      "Specialized in graph problems and dynamic programming",
    ],
    impact: "Ranked top 10 out of 500+ teams across the region.",
  },
];

const TYPE_COLORS: Record<string, string> = {
  Experience: "bg-primary/15 text-primary border-primary/25",
  Hackathon: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "Open Source": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Achievement: "bg-violet-500/15 text-violet-400 border-violet-500/25",
};

export function Timeline() {
  return (
    <section id="timeline" className="py-28 bg-[#050508]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Experience</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">My Journey</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A timeline of the internships, competitions, and projects that have shaped how I work.
          </p>
        </motion.div>

        <div className="space-y-6">
          {EXPERIENCES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="p-7 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.035] transition-colors"
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLORS[item.type] ?? "bg-white/10 text-white border-white/15"}`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.period}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white leading-snug">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.org}</p>
                </div>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-2 mb-5">
                {item.responsibilities.map((r, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>

              {/* Impact */}
              <div className="pt-4 border-t border-white/6">
                <p className="text-sm text-white font-medium">
                  <span className="text-primary mr-1.5">Impact:</span>
                  {item.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
