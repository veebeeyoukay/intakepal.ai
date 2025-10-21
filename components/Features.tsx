"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Database,
  Languages,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ClipboardList,
    title: "No More Clipboards",
    description:
      "Patients complete intake via voice, text, or web before arrival. Everything's ready when they walk in.",
  },
  {
    icon: CheckCircle2,
    title: "Real-Time Eligibility",
    description:
      "AI OCR extracts insurance details and verifies coverage instantly. No surprises at checkout.",
  },
  {
    icon: Database,
    title: "EHR Write-Back",
    description:
      "Demographics, consents, and history flow directly into your EHR. Zero re-keying required.",
  },
  {
    icon: Languages,
    title: "Spanish + Accessibility",
    description:
      "WCAG 2.2 AA compliant with full Spanish support. Everyone gets a friendly experience.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-[--ink]">
          Everything you need for seamless intake
        </h2>
        <p className="mt-3 text-lg text-[--muted-ink]">
          Capture once. Pre-fill everywhere.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[--brand-primary]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[--brand-primary]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[--ink]">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[--muted-ink] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
