import Link from "next/link";
import { virtues } from "@/data/virtues";
import { icons } from "lucide-react";
import InitiativesGrid from "@/components/initiatives/InitiativesGrid";
import FAQ from "@/components/home/FAQ";
import announcementsRaw from "@/data/announcements.json";
import { Announcement } from "@/types/announcement";

export default function Home() {
  const announcements = (announcementsRaw as Announcement[]) || [];
  const topAnnouncements = [...announcements]
    .sort((a, b) => {
      const aPinned = Boolean(a.pinned);
      const bPinned = Boolean(b.pinned);
      if (aPinned !== bPinned) return aPinned ? -1 : 1;
      return (b.date || "").localeCompare(a.date || "");
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col">

      {/* ── 1. Hero Masthead ─────────────────────────────────────────── */}
      <section className="relative bg-[#0F1B33] dark:bg-[#050B14] text-white overflow-hidden">
        {/* Decorative gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9B1B30] via-[#D4AF37] to-[#9B1B30]" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center z-10">
          {/* Kicker */}
          <p className="ivy-crest-title text-[#D4AF37] text-[11px] sm:text-xs tracking-[0.3em] mb-6">
            Official Student Government · ECUSTA School of Medicine
          </p>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-4xl mx-auto">
            Empowering Students to{" "}
            <span className="text-[#D4AF37]">Shape Our Medical Future</span>
          </h1>

          {/* Pull-quote subline */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed border-l-2 border-[#D4AF37]/70 pl-4 text-left mb-10">
            The ECUSTA Student Council represents the student body, driving
            academic excellence, fostering community, and advocating for every
            student at the institution.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="#initiatives"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#D4AF37] hover:bg-white text-[#0F1B33] text-xs font-bold uppercase tracking-[0.1em] border-2 border-[#D4AF37] rounded-xs shadow-md transition-all duration-200"
            >
              Explore Initiatives
            </Link>
            <Link
              href="/council"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent hover:bg-white/10 text-white text-xs font-bold uppercase tracking-[0.1em] border-2 border-white/30 hover:border-white/60 rounded-xs transition-all duration-200"
            >
              Meet the Council
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Our Virtues ───────────────────────────────────────────── */}
      <section className="bg-[#FAF8F5] dark:bg-[#0A0A0A] border-b border-stone-200 dark:border-stone-800 py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {virtues.map((virtue) => {
            const Icon = icons[virtue.iconName as keyof typeof icons] || icons.Circle;
            return (
              <div key={virtue.title} className="flex items-center gap-2 group">
                <Icon
                  size={17}
                  className="text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 group-hover:text-[#9B1B30] dark:group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide">
                  {virtue.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 3. Initiatives ───────────────────────────────────────────── */}
      <section id="initiatives" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <InitiativesGrid />
      </section>

      {/* ── 4. Notices + Gateway ─────────────────────────────────────── */}
      <section className="bg-[#FAF8F5] dark:bg-[#050B14] border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="mb-10">
            <p className="ivy-crest-title text-[11px] tracking-[0.25em] text-[#9B1B30] dark:text-[#D4AF37] mb-2">
              Official Notices
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A] dark:text-white">
              Announcements &amp; Gateway
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Announcements */}
            <div className="lg:col-span-2 ivy-card rounded-xs p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-bold text-[#1B2A4A] dark:text-white uppercase tracking-wide">
                  Latest Announcements
                </h3>
                <Link
                  href="/announcements"
                  className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider hover:underline"
                >
                  View All →
                </Link>
              </div>

              {topAnnouncements.length === 0 ? (
                <div className="py-4 text-sm text-stone-500 dark:text-stone-400 italic font-serif">
                  No active notices. Official council updates will appear here.
                </div>
              ) : (
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {topAnnouncements.map((a) => (
                    <Link
                      key={a.id}
                      href="/announcements"
                      className="py-3 flex items-start justify-between gap-3 group block hover:bg-[#FAF8F5] dark:hover:bg-stone-900 -mx-1 px-1 rounded-xs transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                            {a.category}
                          </span>
                          <span className="text-[10px] text-stone-400">{a.date}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-stone-800 dark:text-white group-hover:text-[#9B1B30] dark:group-hover:text-[#D4AF37] transition-colors line-clamp-1 font-serif">
                          {a.title}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
                          {a.summary}
                        </p>
                      </div>
                      <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-sm mt-0.5">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Gateway links */}
            <div className="flex flex-col gap-3">
              {[
                {
                  href: "/documents/ECUSTA_Constitution.pdf",
                  download: true,
                  icon: "🏛️",
                  label: "Council Constitution",
                  sublabel: "Official governance document",
                  accent: true,
                },
                {
                  href: "/council",
                  download: false,
                  icon: "👥",
                  label: "Council Directory",
                  sublabel: "Meet your representatives",
                  accent: false,
                },
                {
                  href: "https://ecu.edu.et",
                  download: false,
                  icon: "🎓",
                  label: "Main University Site",
                  sublabel: "ecu.edu.et",
                  accent: false,
                  external: true,
                },
              ].map(({ href, download, icon, label, sublabel, accent, external }) => {
                const cls = `ivy-card rounded-xs p-4 flex items-center justify-between gap-3 group transition-all ${
                  accent
                    ? "bg-[#1B2A4A] dark:bg-[#1B2A4A] border-[#D4AF37]/40 text-white hover:bg-[#0F1B33]"
                    : "hover:border-t-[#9B1B30]"
                }`;
                const inner = (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${accent ? "text-white" : "text-[#1B2A4A] dark:text-white"}`}>
                          {label}
                        </p>
                        <p className={`text-[11px] ${accent ? "text-[#D4AF37]" : "text-stone-500 dark:text-stone-400"}`}>
                          {sublabel}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${accent ? "text-[#D4AF37]" : "text-[#D4AF37]"}`}>
                      →
                    </span>
                  </>
                );

                if (download) {
                  return (
                    <a key={href} href={href} download className={cls}>
                      {inner}
                    </a>
                  );
                }
                if (external) {
                  return (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {inner}
                    </a>
                  );
                }
                return (
                  <Link key={href} href={href} className={cls}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FAQ ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="mb-10">
          <p className="ivy-crest-title text-[11px] tracking-[0.25em] text-[#9B1B30] dark:text-[#D4AF37] mb-2">
            Student Queries
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B2A4A] dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>
        <FAQ />
      </section>

    </div>
  );
}
