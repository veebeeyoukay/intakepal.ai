"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "BAA-backed security",
  },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "PHI stays protected",
  },
  {
    icon: Eye,
    title: "WCAG 2.2 AA",
    description: "Fully accessible",
  },
  {
    icon: FileCheck,
    title: "Audit Trail",
    description: "Complete transparency",
  },
];

export function TrustBadges() {
  return (
    <section className="bg-[--surface-alt] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-center text-sm font-medium text-[--muted-ink] mb-8">
          Trusted by healthcare providers
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="flex flex-col items-center text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-[--brand-primary]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[--brand-primary]" />
                </div>
                <h4 className="font-semibold text-sm text-[--ink]">
                  {badge.title}
                </h4>
                <p className="text-xs text-[--muted-ink]">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
