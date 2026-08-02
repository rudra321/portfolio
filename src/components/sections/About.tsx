"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/data/personal";
import { fadeInUp } from "@/lib/animations";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-32 md:py-44">
      {/* Ghost numeral - editorial marker, not eyebrow */}
      <span
        aria-hidden
        className="ghost-numeral pointer-events-none absolute -top-2 right-2 select-none text-[clamp(120px,28vw,360px)] md:right-10 md:top-6"
      >
        01
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.h2
          className="mb-14 font-serif text-3xl italic text-foreground md:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          About.
        </motion.h2>

        <div className="grid gap-16 lg:grid-cols-5">
          {/* Left - narrative */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl lg:text-[2.4rem] lg:leading-[1.15]">
              I lead the stack behind a healthcare platform used by
              <span className="font-serif italic text-accent"> 55,000+ patients</span>:
              a React Native app, an Express backend on Lambda,
              a Supabase database, and the boring glue that keeps
              all three in agreement.
            </p>

            <p className="mt-10 max-w-xl text-[20px] leading-[1.6] text-text-secondary">
              Before Raaz I worked on browser-side ML at GJ-Map,
              compiling C++ inference kernels to WebAssembly so an
              ONNX model could run on a government analyst&apos;s
              laptop without a server round-trip. Before that I built
              a real-time fraud dashboard at SuperPe that cut losses
              by half.
            </p>

            <p className="mt-6 max-w-xl text-[20px] leading-[1.6] text-text-secondary">
              Outside work I play Ultimate Frisbee. We won gold at the
              <span className="font-serif italic"> National Open Championship</span> in
              2025 and the National College Championship in 2023, a useful
              reminder that latency matters off-screen too.
            </p>
          </motion.div>

          {/* Right - bento, deliberately asymmetric */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Education - primary card */}
            <motion.div
              className="rounded-2xl border border-card-border bg-card-bg p-6 backdrop-blur-xl"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary/70">
                Education
              </p>
              <p className="mt-3 font-serif text-[26px] italic leading-tight">
                {PERSONAL.degree}
              </p>
              <p className="mt-1.5 text-base text-text-secondary">
                {PERSONAL.university}, {PERSONAL.campus}
              </p>
              <p className="text-sm text-text-secondary/55">
                Class of {PERSONAL.gradYear}
              </p>
            </motion.div>

            {/* Years + Location side by side, both visually substantial */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
              <motion.div
                className="col-span-1 flex flex-col justify-between rounded-2xl border border-accent/20 bg-accent/[0.05] p-5 sm:col-span-3"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent/90">
                  Shipping for
                </p>
                <p className="mt-2 font-serif text-[34px] italic leading-none text-foreground sm:text-[40px]">
                  3<span className="text-accent">+</span> yrs
                </p>
              </motion.div>

              <motion.div
                className="col-span-1 flex flex-col justify-between rounded-2xl border border-card-border bg-card-bg p-5 sm:col-span-2"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary/70">
                  Based in
                </p>
                <p className="mt-2 font-serif text-[22px] italic leading-tight text-foreground">
                  Bangalore
                </p>
                <p className="text-sm text-text-secondary/55">
                  India
                </p>
              </motion.div>
            </div>

            {/* Now reading */}
            <motion.div
              className="rounded-2xl border border-card-border bg-card-bg p-6 backdrop-blur-xl"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary/70">
                Now reading
              </p>
              <p className="mt-3 font-serif text-[22px] italic leading-snug text-foreground">
                Designing Data-Intensive Applications
              </p>
              <p className="mt-1.5 text-base text-text-secondary/70">
                by Martin Kleppmann
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
