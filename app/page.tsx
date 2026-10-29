import Link from "next/link";
import { virtues } from "@/data/virtues";
import { icons } from "lucide-react";
import InitiativesGrid from "@/components/initiatives/InitiativesGrid";
import FAQ from "@/components/home/FAQ";
import MedicalBackground from "@/components/ui/MedicalBackground";
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
    .slice(0, 2);
  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-12 sm:space-y-16 py-4 px-4 sm:px-6 relative z-10">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-4xl mx-auto text-center space-y-6">
        <MedicalBackground />


        {/* Headline: Crisp, Authoritative Typography in both Light & Dark */}
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
          Empowering Students to Shape Our Medical Future
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 text-left">
          The ECUSTA Student Council represents the student body, driving academic excellence, and fostering community engagement.
        </p>

        {/* Action Buttons: Clean Rectangular Radius */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center max-w-sm sm:max-w-none mx-auto pt-2">
          <Link
            href="#initiatives"
            className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] flex items-center justify-center"
          >
            Explore Initiatives
          </Link>
          <Link
            href="/council"
            className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] hover:bg-slate-100 dark:hover:bg-[#1E2D4D]/60 text-slate-900 dark:text-slate-200 flex items-center justify-center"
          >
            Meet Council
          </Link>
        </div>
      </section>

      {/* Subtle Section Divider */}
      <div className="w-full border-t border-slate-200 dark:border-[#1E2D4D]/80" />

      {/* 2. Council Initiatives with Editorial Split Header */}
      <section id="initiatives" className="flex flex-col w-full">
        <InitiativesGrid />
      </section>

      {/* Subtle Section Divider */}
      <div className="w-full border-t border-slate-200 dark:border-[#1E2D4D]/80" />

      {/* 3. Our Virtues (Slim compact row) */}
      <section className="flex flex-col items-center justify-center w-full py-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">
          Our Virtues
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 py-3">
          {virtues.map((virtue) => {
            const Icon = icons[virtue.iconName as keyof typeof icons] || icons.Circle;
            return (
              <div key={virtue.title} className="flex items-center gap-2 group">
                <Icon size={18} className="text-[#D4AF37] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#D4AF37] dark:group-hover:text-white transition-colors">
                  {virtue.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subtle Section Divider */}
      <div className="w-full border-t border-slate-200 dark:border-[#1E2D4D]/80" />

      {/* 4. Official Notices & Gateway */}
      <section className="flex flex-col w-full">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Official Notices &amp; Gateway
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Announcements block */}
          <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] flex flex-col justify-between p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1E2D4D]">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Latest Announcements</h3>
              <Link href="/announcements" className="text-xs font-semibold text-[#D4AF37] hover:underline">
                View All
              </Link>
            </div>
            
            {topAnnouncements.length === 0 ? (
              <div className="py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0F1B33] flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200 dark:border-[#1E2D4D]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">No Active Notices</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight line-clamp-2">
                    Official council updates, session minutes, and event notices will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#1E2D4D]/60 py-1">
                {topAnnouncements.map((a) => (
                  <Link
                    key={a.id}
                    href="/announcements"
                    className="py-2.5 flex items-start justify-between gap-3 group block"
                  >
                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37]">
                          {a.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {a.date}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {a.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                        {a.summary}
                      </p>
                    </div>
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-xs font-semibold mt-1">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Side Gateway links */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
            <Link
              href="/documents/ECUSTA_Constitution.pdf"
              download
              className="rounded-xl bg-[#1B2A4A] dark:bg-[#1B2A4A] border border-[#1E2D4D] text-white px-4 py-2.5 hover:bg-[#1B2A4A]/80 transition-colors flex items-center justify-between gap-3 group text-xs font-semibold shadow-sm"
            >
              <div className="flex items-center gap-2 truncate">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span className="truncate">Council Constitution</span>
              </div>
              <svg className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>

            <Link
              href="/council"
              className="rounded-xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] hover:border-slate-300 dark:hover:border-slate-700 px-4 py-2.5 transition-colors flex items-center justify-between gap-3 group text-xs font-semibold text-slate-900 dark:text-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-2 truncate">
                <svg className="text-[#D4AF37] shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="truncate">Council Directory</span>
              </div>
              <svg className="text-[#D4AF37] shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <FAQ />

    </div>
  );
}
