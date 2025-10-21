import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TrustBadges } from "@/components/TrustBadges";
import { ContactForm } from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[--border] sticky top-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[--brand-primary] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="IntakePal logo"
              >
                <path
                  d="M10 18c-3.5 0-6-2-6-6V6c0-4 2.5-6 6-6s6 2 6 6v6c0 4-2.5 6-6 6z"
                  fill="white"
                />
                <path
                  d="M7 12c1 1.5 4 1.5 5 0"
                  stroke="#0EA5A0"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="7.5" cy="9" r="1" fill="#0EA5A0" />
                <circle cx="12.5" cy="9" r="1" fill="#0EA5A0" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[--ink]">IntakePal</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <Link
              href="#features"
              className="text-[--muted-ink] hover:text-[--ink] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/new-patient"
              className="text-[--brand-primary] font-medium hover:underline"
            >
              Try Demo
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <Hero />
      <Features />
      <TrustBadges />
      <ContactForm />

      {/* Footer */}
      <footer className="border-t border-[--border] mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[--muted-ink]">
              &copy; 2025 IntakePal. HIPAA-compliant. BAA-backed.
            </p>
            <div className="flex items-center space-x-6 text-sm text-[--muted-ink]">
              <a href="#" className="hover:text-[--ink] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[--ink] transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-[--ink] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
