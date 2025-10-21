"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";
import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <p className="text-sm font-medium text-[--brand-primary]">
          IntakePal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[--ink] lg:text-5xl">
          {COPY.hero.title}
        </h1>
        <p className="mt-3 text-lg text-[--muted-ink]">
          {COPY.hero.subtitle}
        </p>

        <ul className="mt-8 space-y-3 text-left text-sm text-[--muted-ink] max-w-xl mx-auto">
          {COPY.hero.features.map((feature, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + idx * 0.05 }}
              className="flex items-start"
            >
              <span className="mr-2 text-[--brand-primary] font-bold">•</span>
              <span dangerouslySetInnerHTML={{ __html: feature }} />
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/new-patient">{COPY.hero.ctaPrimary}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="#features">{COPY.hero.ctaSecondary}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
