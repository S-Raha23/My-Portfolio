import { motion } from "framer-motion";
import { Trophy, Medal, Star } from "lucide-react";

const HACKATHONS = [
  {
    position: "1st Place",
    icon: Trophy,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    name: "Global ML Hackathon",
    organizer: "OpenAI & Partners",
    date: "October 2023",
    problem:
      "Law firms deal with thousands of pages of legal documents and need to find relevant clauses, precedents, or risks quickly — a task that takes trained lawyers hours to do manually.",
    solution:
      "Built an AI assistant that reads, indexes, and answers precise questions over large legal document collections. Used a retrieval-augmented approach: the system finds the most relevant passages first, then generates a precise, cited answer.",
    stack: ["Python", "LangChain", "FAISS", "OpenAI API", "FastAPI"],
    outcome:
      "Won 1st place out of 200+ international teams. Judges praised the system's accuracy and cited the clean architecture as a standout among the finalists.",
  },
  {
    position: "Top 5",
    icon: Medal,
    color: "text-slate-300",
    bgColor: "bg-slate-500/10 border-slate-500/20",
    name: "Systems Design Sprint",
    organizer: "University Tech Festival",
    date: "March 2023",
    problem:
      "University campuses have dozens of real-time events, club activities, and announcements scattered across different platforms — students miss things they'd actually care about.",
    solution:
      "Built a unified event aggregation and personalization platform that pulls from all campus sources and learns each student's interests to surface relevant events first.",
    stack: ["Go", "PostgreSQL", "Redis", "React", "Docker"],
    outcome:
      "Finished in the top 5 out of 80 teams. The product was later piloted by the university student council for real event promotion.",
  },
  {
    position: "Finalist",
    icon: Star,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10 border-violet-500/20",
    name: "Climate AI Hackathon",
    organizer: "Tech for Good Foundation",
    date: "August 2022",
    problem:
      "Farmers in developing regions have no reliable way to predict local weather or crop disease risk — decisions are made on intuition with major financial consequences.",
    solution:
      "Built a low-data ML model that predicts crop disease risk from satellite imagery and basic weather inputs, accessible via a simple SMS interface requiring no smartphone.",
    stack: ["Python", "PyTorch", "Twilio API", "AWS Lambda", "Scikit-learn"],
    outcome:
      "Selected as a finalist from 150+ teams. The SMS interface approach was highlighted as genuinely addressing the accessibility gap in agri-tech solutions.",
  },
];

export function Hackathons() {
  return (
    <section id="hackathons" className="py-28 bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Hackathons</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Built Under Pressure</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Competitions where time is constrained but ambition isn't. Each one forced fast decisions on real problems.
          </p>
        </motion.div>

        <div className="space-y-6">
          {HACKATHONS.map((h, i) => {
            const Icon = h.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="p-7 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.035] transition-colors"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${h.bgColor}`}>
                      <Icon className={`w-5 h-5 ${h.color}`} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${h.color}`}>{h.position}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{h.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{h.name}</h3>
                      <p className="text-sm text-muted-foreground">{h.organizer}</p>
                    </div>
                  </div>
                </div>

                {/* Case study grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">The Problem</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{h.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">What We Built</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{h.solution}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/6">
                  <div className="flex flex-wrap gap-2">
                    {h.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-white/4 border border-white/8 text-xs text-gray-400 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-white/80 font-medium max-w-sm text-right">
                    {h.outcome}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
