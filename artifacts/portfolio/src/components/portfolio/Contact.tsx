import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Send, Loader2 } from "lucide-react";

// ─── Formspree setup ────────────────────────────────────────────────────────
// 1. Go to https://formspree.io and sign up (free)
// 2. Create a new form → set email to Soubhagyaraha24@gmail.com
// 3. Replace the ID below with your form ID (looks like "xpwzabcd")
const FORMSPREE_ID = "xreojwbd";
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
// ────────────────────────────────────────────────────────────────────────────

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-28 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="text-sm text-primary font-medium tracking-widest uppercase mb-3">Contact</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Let's Talk</h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Whether you have a project in mind, a question, or just want to connect — I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-foreground font-semibold text-lg mb-2">Reach me directly</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                I'm currently open to internship, full-time, and freelance opportunities in ML Engineering and Software Engineering. Response time is typically within 48 hours.
              </p>
            </div>

            <a
              href="mailto:Soubhagyaraha24@gmail.com"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:border-primary/60 group-hover:bg-primary/10 group-hover:shadow-[0_0_14px_rgba(37,99,235,0.18)] transition-all duration-300">
                <Mail className="w-4 h-4 group-hover:text-primary transition-colors" />
              </div>
              Soubhagyaraha24@gmail.com
            </a>

            <div className="flex gap-3">
              <a
                href="https://github.com/S-Raha23"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/8 hover:shadow-[0_0_14px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/soubhagya-raha-78b25b285/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/8 hover:shadow-[0_0_14px_rgba(37,99,235,0.15)] transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {status === "success" ? (
              <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold mb-2">Message sent</h3>
                <p className="text-muted-foreground text-sm">Thanks for reaching out. I'll get back to you within 48 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-xs text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-7 rounded-2xl border border-border bg-card space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me what's on your mind..."
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-destructive">
                    Something went wrong. Please try emailing me directly at Soubhagyaraha24@gmail.com
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {status === "submitting" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
