import { useState, useCallback } from "react";
import { GlobalBackground } from "@/components/portfolio/GlobalBackground";
import { Nav }        from "@/components/portfolio/Nav";
import { Hero }       from "@/components/portfolio/Hero";
import { WhatIBuild } from "@/components/portfolio/WhatIBuild";
import { Projects }   from "@/components/portfolio/Projects";
import { Hackathons } from "@/components/portfolio/Hackathons";
import { Timeline }   from "@/components/portfolio/Timeline";
import { Skills }     from "@/components/portfolio/Skills";
import { Contact }    from "@/components/portfolio/Contact";

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const handleSkillClick = useCallback((skill: string) => {
    setActiveSkill(prev => prev === skill ? null : skill);
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleClearSkill = useCallback(() => setActiveSkill(null), []);

  return (
    /*
     * Layout stack (z-index):
     *   0 — GlobalBackground canvas + orbs (fixed, behind everything)
     *   1 — Ripple rings (fixed, in GlobalBackground)
     *   50 — Nav (fixed)
     *   10 — Section content
     *
     * Hero is transparent → GlobalBackground shows through fully.
     * All other sections have a semi-transparent bg so the glow
     * bleeds in subtly while keeping text perfectly readable.
     */
    <div className="relative min-h-screen text-foreground transition-colors duration-500">
      {/* Global animated background — canvas + orbs + ripples */}
      <GlobalBackground />

      {/* Nav — fixed, always on top */}
      <Nav />

      <main className="relative z-10">
        {/* Hero — fully transparent, shows the canvas */}
        <Hero />

        {/*
         * All remaining sections live inside this wrapper.
         * bg-background/90 keeps text readable while letting
         * the global glow/particles bleed through subtly (~10%).
         */}
        <div className="relative bg-background/90 backdrop-blur-[2px]">
          <WhatIBuild />
          <Projects activeSkill={activeSkill} onClearSkill={handleClearSkill} />
          <Hackathons />
          <Timeline />
          <Skills activeSkill={activeSkill} onSkillClick={handleSkillClick} />
          <Contact />
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center border-t border-border/50 bg-background/92 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Soubhagya Raha. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
