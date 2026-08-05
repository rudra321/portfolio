"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useLenis } from "@/components/providers/LenisProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");
  const lenis = useLenis();
  const reducedMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which section is in view to expose aria-current on the matching link.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on Escape (restoring focus to the toggle) and trap
  // Tab inside the overlay while it is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      // Cycle order: overlay links, then the toggle (which is the close button).
      const focusables = [
        ...Array.from(
          overlayRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? []
        ),
        menuButtonRef.current,
      ].filter((el): el is HTMLElement => el !== null);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      const inTrap = active !== null && focusables.includes(active);

      if (e.shiftKey) {
        if (!inTrap || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inTrap || active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const scrollTo = (target: string | number) => {
    // Reduced motion: jump instead of animating the fallback scroll.
    const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
    if (lenis) {
      lenis.scrollTo(target);
    } else if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior });
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (mobileOpen) {
      // Same restore path as Escape — the overlay's links are unmounting.
      setMobileOpen(false);
      menuButtonRef.current?.focus();
    }
    scrollTo(href);
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-hairline bg-background/95"
            : "bg-transparent"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
            className="font-mono text-sm font-medium lowercase tracking-[0.02em] text-foreground"
          >
            rudra
            {/* Caret 1 of 3: blinks only while the page is unscrolled. */}
            {scrolled || reducedMotion ? (
              <span className="text-accent">_</span>
            ) : (
              <motion.span
                className="text-accent"
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.49, 0.5, 1],
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                _
              </motion.span>
            )}
          </a>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={activeHref === link.href ? "true" : undefined}
                  className={cn(
                    "font-mono text-[11px] lowercase tracking-[0.08em] transition-colors hover:text-foreground",
                    activeHref === link.href
                      ? "text-accent"
                      : "text-text-secondary"
                  )}
                >
                  {link.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-50 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X size={20} className="text-foreground" />
            ) : (
              <Menu size={20} className="text-foreground" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={overlayRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-6 bg-background px-12 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={activeHref === link.href ? "true" : undefined}
                className="font-sans text-[2.5rem] font-semibold lowercase leading-none tracking-[-0.03em] text-text-secondary transition-colors hover:text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.label.toLowerCase()}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
