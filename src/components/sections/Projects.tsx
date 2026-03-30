"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import { PROJECTS } from "@/data/projects";
import { TiltCard } from "@/components/ui/TiltCard";
import { TextReveal } from "@/components/ui/TextReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { fadeInUp } from "@/lib/animations";

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <TextReveal
          text="Featured Projects"
          element="h2"
          className="mb-16 text-3xl font-bold tracking-tight md:text-4xl"
        />

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className={project.featured ? "md:col-span-2" : ""}
            >
              <TiltCard
                className={`group relative ${
                  project.featured ? "p-8 md:p-10" : "p-6"
                }`}
              >
                {/* Project number */}
                <span className="font-mono text-xs text-accent-cyan/60">
                  {String(PROJECTS.indexOf(project) + 1).padStart(2, "0")}
                </span>

                <h3
                  className={`mt-3 font-bold tracking-tight ${
                    project.featured
                      ? "text-2xl md:text-3xl"
                      : "text-xl"
                  }`}
                >
                  {project.title}
                </h3>

                <p
                  className={`mt-3 leading-relaxed text-text-secondary ${
                    project.featured ? "max-w-2xl text-base" : "text-sm"
                  }`}
                >
                  {project.description}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-6 flex items-center gap-4">
                  {project.githubUrl && (
                    <MagneticButton strength={0.2}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent-cyan"
                        aria-label={`${project.title} source code`}
                      >
                        <GithubIcon size={18} />
                        <span className="font-mono text-xs">Source</span>
                      </a>
                    </MagneticButton>
                  )}
                  {project.liveUrl && (
                    <MagneticButton strength={0.2}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent-cyan"
                        aria-label={`${project.title} live demo`}
                      >
                        <ExternalLink size={18} />
                        <span className="font-mono text-xs">Live</span>
                      </a>
                    </MagneticButton>
                  )}
                </div>

                {/* Hover gradient line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/0 to-transparent transition-all duration-500 group-hover:via-accent-cyan/40" />
              </TiltCard>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
