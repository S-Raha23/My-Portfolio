import { useState, useCallback } from "react";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { WhatIBuild } from "@/components/portfolio/WhatIBuild";
import { Projects } from "@/components/portfolio/Projects";
import { Hackathons } from "@/components/portfolio/Hackathons";
import { Timeline } from "@/components/portfolio/Timeline";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";

export default function Portfolio() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const handleSkillClick = useCallback((skill: string) => {
    setActiveSkill((prev) => (prev === skill ? null : skill));
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const handleClearSkill = useCallback(() => setActiveSkill(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Nav />
      <main>
        <Hero />
        <WhatIBuild />
        <Projects activeSkill={activeSkill} onClearSkill={handleClearSkill} />
        <Hackathons />
        <Timeline />
        <Skills activeSkill={activeSkill} onSkillClick={handleSkillClick} />
        <Contact />
      </main>
      <footer className="py-8 text-center border-t border-border bg-background/80">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Soubhagya. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
