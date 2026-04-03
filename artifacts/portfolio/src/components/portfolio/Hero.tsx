import { motion } from "framer-motion";

export function Hero() {
  const codeSnippet = `
class Engineer {
public:
    void build() {
        while(true) {
            solve(complex_problems);
            optimize(systems);
        }
    }
};`.trim();

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#0a0a0f] pt-20">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            STATUS: ONLINE
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight"
            >
              I build systems <br/> that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">think</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-muted-foreground font-light max-w-xl mx-auto lg:mx-0"
            >
              ML at scale. Algorithms at depth. I bridge the gap between theoretical models and production-ready infrastructure.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-4 justify-center lg:justify-start"
          >
            <a href="#projects" className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              View Architecture
            </a>
            <a href="#contact" className="px-6 py-3 rounded-md border border-white/10 hover:bg-white/5 transition-all font-mono text-sm">
              Init Contact
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex-1 w-full max-w-lg hidden md:block"
        >
          <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
             <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
             </div>
             <pre className="text-sm font-mono text-gray-300 overflow-x-auto p-2">
               <code>{codeSnippet}</code>
             </pre>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
