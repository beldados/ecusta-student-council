"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import announcementsRaw from "@/data/announcements.json";
import { Announcement } from "@/types/announcement";
import {
  Bell,
  Search,
  Calendar,
  CalendarDays,
  ArrowRight,
  FileText,
  Pin,
  X,
  ExternalLink,
} from "lucide-react";

export default function AnnouncementsPage() {
  const [allAnnouncements, setAllAnnouncements] = useState<Announcement[]>(
    (announcementsRaw as Announcement[]) || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.announcements)) {
          setAllAnnouncements(data.announcements);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch announcements from /api/announcements:", err);
      });
  }, []);

  // Automatically derive category filter pills dynamically
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allAnnouncements.forEach((a) => {
      if (a.category) cats.add(a.category.trim());
    });
    return ["All", ...Array.from(cats)];
  }, [allAnnouncements]);

  // Filtered and sorted announcements: Pinned first, then newest date
  const filteredAnnouncements = useMemo(() => {
    let list = [...allAnnouncements];

    if (selectedCategory !== "All") {
      const lower = selectedCategory.toLowerCase();
      list = list.filter((a) => a.category && a.category.toLowerCase().trim() === lower);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title?.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q) ||
          a.content?.toLowerCase().includes(q) ||
          a.organizer?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const aPinned = Boolean(a.pinned);
      const bPinned = Boolean(b.pinned);
      if (aPinned !== bPinned) return aPinned ? -1 : 1;
      return (b.date || "").localeCompare(a.date || "");
    });

    return list;
  }, [allAnnouncements, selectedCategory, searchQuery]);

  return (
    <>
      <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-8 mb-24 px-4 sm:px-6 relative z-10">
        {/* Header */}
        <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
            <Bell size={15} />
            <span>Council Secretariat Bulletins</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-3xl">
            Official Council Bulletins &amp; Notices
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 max-w-2xl mx-auto mt-4 text-left">
            Verified notices and session updates from the Student Council Secretariat.
          </p>

          {/* Action Link to Events */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-xs sm:text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <CalendarDays size={14} className="text-[#D4AF37]" />
              <span>Looking for Assembly Dates? View Events Calendar</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* If populated: Filter & Search Bar */}
        {allAnnouncements.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                const count =
                  category === "All"
                    ? allAnnouncements.length
                    : allAnnouncements.filter(
                        (a) => a.category?.toLowerCase() === category.toLowerCase()
                      ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#D4AF37] text-[#0F1B33] font-semibold shadow-sm"
                        : "bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2846] font-medium"
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                placeholder="Search bulletins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-surface border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
        )}

        {/* Announcements Listing or Clean Institutional Empty State */}
        <section className="w-full">
          {allAnnouncements.length === 0 ? (
            /* Clean, compact institutional notice when empty */
            <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto mb-6 border border-[#D4AF37]/20">
                <FileText size={32} strokeWidth={1.75} />
              </div>

              <div className="inline-block text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-surface-hover border border-border text-text-secondary mb-4">
                Council Secretariat Gazette
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                No Active Bulletins at this Time
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                Official council memos, session minutes, and academic updates will be published here upon release by the Secretariat.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center gap-1.5"
                >
                  <span>Inquire with Secretariat</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            /* Empty state when filtering/searching */
            <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-10 text-center max-w-md mx-auto shadow-sm">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                No bulletins matched your current filter criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            /* Populated Bulletins Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Category badge, Pinned indicator, and Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border ${
                            announcement.category?.toLowerCase().includes("opportunity") ||
                            announcement.category?.toLowerCase().includes("recruitment")
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                          }`}
                        >
                          {announcement.category}
                        </span>
                        {announcement.pinned && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                            <Pin size={11} className="rotate-45" />
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Calendar size={13} className="text-[#D4AF37]" />
                        <span>{announcement.date}</span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
                      {announcement.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                      {announcement.summary}
                    </p>
                  </div>

                  {/* Bottom Row: Source tag (organizer) + Reader modal action */}
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                    <span className="truncate max-w-[60%] font-medium">
                      Source: {announcement.organizer || "Council Secretariat"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveAnnouncement(announcement)}
                      className="text-[#D4AF37] hover:text-[#C5A028] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Read Full Notice</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Reader Modal for Full Notice Content */}
      {activeAnnouncement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={activeAnnouncement.title}
          onClick={() => setActiveAnnouncement(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] shadow-2xl flex flex-col gap-5 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveAnnouncement(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1E2D4D] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border ${
                    activeAnnouncement.category?.toLowerCase().includes("opportunity") ||
                    activeAnnouncement.category?.toLowerCase().includes("recruitment")
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
                  }`}
                >
                  {activeAnnouncement.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activeAnnouncement.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                {activeAnnouncement.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Issued by {activeAnnouncement.organizer || "Council Secretariat"}
              </p>
            </div>

            {/* Optional Flyer Image */}
            {activeAnnouncement.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D4D]">
                <Image
                  src={activeAnnouncement.image}
                  alt={activeAnnouncement.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            {/* Summary Callout */}
            {activeAnnouncement.summary && (
              <div className="p-3.5 rounded-xl bg-surface-hover/80 border-l-2 border-[#D4AF37] text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {activeAnnouncement.summary}
              </div>
            )}

            {/* Full Content */}
            <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {activeAnnouncement.content}
            </div>

            {/* Action / Attachment Link if provided */}
            {activeAnnouncement.actionUrl && (
              <div className="pt-4 border-t border-border flex items-center justify-end">
                <a
                  href={activeAnnouncement.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center gap-1.5"
                >
                  <span>{activeAnnouncement.actionLabel || "View Attachment"}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
