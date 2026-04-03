import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#050508] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="font-mono text-primary mb-4 text-sm tracking-wider">04. WHAT'S NEXT</div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Let's Build Something <br/> Exceptional.</h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            I'm currently open for new opportunities in ML Engineering and Backend Systems. 
            Whether you have a question, a project idea, or just want to discuss deep learning architectures, my inbox is open.
          </p>

          <a 
            href="mailto:hello@example.com" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(99,102,241,0.4)] mb-16"
          >
            <Mail className="w-5 h-5" />
            Initialize Connection
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>

          <div className="flex justify-center gap-8 border-t border-white/10 pt-12">
            <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
