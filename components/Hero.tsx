"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";
import Link from "next/link";
import { Mic, Phone } from "lucide-react";
import { VoiceChatbot } from "@/components/VoiceChatbot";

export function Hero() {
  const [isChatOpen, setIsChatOpen] = useState(false);

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

        {/* Prominent Voice Demo CTA */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          {/* Primary Voice CTAs - Side by Side */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            {/* Call Live Voice Assistant */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-[--brand-primary] to-[--brand-accent] hover:opacity-90 shadow-lg"
            >
              <a href="tel:+19788295886">
                <Phone className="w-5 h-5 mr-2" />
                Call Allie Now
              </a>
            </Button>

            {/* Text Demo */}
            <Button
              onClick={() => setIsChatOpen(true)}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-[--brand-primary] text-[--brand-primary] hover:bg-[--brand-primary] hover:text-white shadow-md"
            >
              <Mic className="w-5 h-5 mr-2" />
              Try Text Demo
            </Button>
          </div>

          {/* Phone Number Display */}
          <p className="text-sm text-[--muted-ink] font-medium">
            📞 <a href="tel:+19788295886" className="text-[--brand-primary] hover:underline">+1 (978) 829-5886</a> • Available 24/7
          </p>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/new-patient">{COPY.hero.ctaPrimary}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
              <Link href="#features">{COPY.hero.ctaSecondary}</Link>
            </Button>
          </div>

          {/* Voice Demo Tagline */}
          <p className="text-xs text-[--muted-ink] mt-2">
            🎤 Experience our AI voice assistant • No download required
          </p>
        </motion.div>
      </motion.div>

      {/* Voice Chatbot Modal */}
      <VoiceChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </section>
  );
}
