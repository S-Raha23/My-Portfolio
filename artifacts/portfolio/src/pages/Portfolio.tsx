import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { WhatIBuild } from "@/components/portfolio/WhatIBuild";
import { Projects } from "@/components/portfolio/Projects";
import { Timeline } from "@/components/portfolio/Timeline";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";

export default function Portfolio() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen text-foreground">
      <Nav />
      <main>
        <Hero />
        <WhatIBuild />
        <Projects />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <footer className="py-8 text-center border-t border-white/5 bg-[#050508]">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Soubhagya. Built with care.
        </p>
      </footer>
    </div>
  );
}
