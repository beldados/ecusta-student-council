"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import eventsRaw from "@/data/events.json";
import { CampusEvent } from "@/types/event";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarDays,
  History,
  ArrowRight,
  Camera,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

// ── Utility: derive today's YYYY-MM-DD without timezone offset issues ──────────
function getTodayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Month/Day badge helper ──────────────────────────────────────────────────────
function parseDateBadge(iso: string) {
  // Treat date as local midnight to avoid UTC off-by-one
  const [year, month, day] = iso.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

// ── Monogram fallback for missing cover images ─────────────────────────────────
function EventMonogram({ title, category }: { title: string; category: string }) {
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const palette: Record<string, string> = {
    Academic: "from-blue-900/80 to-blue-700/60",
    Assembly: "from-indigo-900/80 to-indigo-600/60",
    Clinical: "from-emerald-900/80 to-teal-700/60",
    "Social & Welfare": "from-purple-900/80 to-pink-700/60",
  };
  const grad = palette[category] ?? "from-slate-800/80 to-slate-600/60";

  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${grad} rounded-t-2xl`}
    >
      <span className="text-5xl font-black text-white/30 select-none">{initials}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Detail Modal (full story + gallery + lightbox)
// ══════════════════════════════════════════════════════════════════════════════
interface ModalProps {
  event: CampusEvent;
  onClose: () => void;
}

function EventDetailModal({ event, onClose }: ModalProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const badge = parseDateBadge(event.date);

  // Filter out any photo that duplicates the coverImage (including photo-1 in same folder)
  const remainingPhotos = (event.gallery || []).filter((src) => {
    if (src === event.coverImage) return false;
    const coverDir = event.coverImage.substring(0, event.coverImage.lastIndexOf("/"));
    const srcDir = src.substring(0, src.lastIndexOf("/"));
    if (coverDir === srcDir && /\/photo-1\.[a-z]+$/i.test(src)) {
      return false;
    }
    return true;
  });

  // Unique photos for lightbox viewer: cover + remaining
  const allModalPhotos = [event.coverImage, ...remainingPhotos];

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevPhoto = () =>
    setLightboxIdx((i) => (i === null ? null : (i - 1 + allModalPhotos.length) % allModalPhotos.length));
  const nextPhoto = () =>
    setLightboxIdx((i) => (i === null ? null : (i + 1) % allModalPhotos.length));

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIdx !== null) { closeLightbox(); } else { onClose(); }
      }
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "ArrowRight") nextPhoto();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lightboxIdx, onClose, allModalPhotos.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const categoryColor: Record<string, string> = {
    Academic: "bg-[#1B2A4A] text-[#D4AF37] border-[#D4AF37]/30",
    Assembly: "bg-indigo-950/60 text-indigo-300 border-indigo-500/30",
    Clinical: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    "Social & Welfare": "bg-purple-950/60 text-purple-300 border-purple-500/30",
  };
  const catCls = categoryColor[event.category] ?? "bg-surface text-text-secondary border-border";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={event.title}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] rounded-2xl shadow-2xl flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-all backdrop-blur-md shadow-lg border border-white/10 cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Cover Image */}
          <div
            onClick={() => openLightbox(0)}
            className="relative w-full h-52 sm:h-64 shrink-0 overflow-hidden rounded-t-2xl bg-surface-hover cursor-zoom-in group"
          >
            <Image
              src={event.coverImage}
              alt={`${event.title} cover`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 768px"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <EventMonogram title={event.title} category={event.category} />

            {/* Category + date overlay */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border ${catCls}`}>
                {event.category}
              </span>
              <span className="text-[11px] font-semibold bg-black/60 text-white px-2.5 py-1 rounded-md backdrop-blur-sm">
                {badge.full}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-1">
                {event.title}
              </h2>
              <p className="text-sm text-text-secondary">{event.organizer}</p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-brand shrink-0" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-brand shrink-0" />
                {event.venue}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {event.description}
            </p>

            {/* Featured Speakers */}
            {event.speakers.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={15} className="text-brand" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Featured Speakers
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.speakers.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#1B2A4A]/40 text-[#D4AF37]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery Grid (remaining photos only, no duplicate of cover banner) */}
            {remainingPhotos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera size={15} className="text-brand" />
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    Event Gallery
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {remainingPhotos.map((src, idx) => {
                    const lightboxIndex = allModalPhotos.indexOf(src);
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => openLightbox(lightboxIndex >= 0 ? lightboxIndex : 1)}
                        aria-label={`View photo ${idx + 1}`}
                        className="relative aspect-video rounded-xl overflow-hidden border border-slate-800/80 hover:opacity-90 transition-opacity cursor-pointer group"
                      >
                        <Image
                          src={src}
                          alt={`${event.title} gallery photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 360px"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                        {/* Subtle expand icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                          <Maximize2 size={18} className="text-white drop-shadow" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox */}
      {lightboxIdx !== null && allModalPhotos[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center animate-in fade-in-0 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Close lightbox"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {allModalPhotos.length > 1 && (
            <button
              onClick={prevPhoto}
              aria-label="Previous photo"
              className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 cursor-pointer"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <div className="relative w-full max-w-4xl max-h-[85vh] aspect-video mx-16">
            <Image
              src={allModalPhotos[lightboxIdx]}
              alt={`Photo ${lightboxIdx + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>

          {/* Next */}
          {allModalPhotos.length > 1 && (
            <button
              onClick={nextPhoto}
              aria-label="Next photo"
              className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 cursor-pointer"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Counter */}
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-white/70 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
            {lightboxIdx + 1} / {allModalPhotos.length}
          </span>
        </div>
      )}
    </>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// Event Card
// ══════════════════════════════════════════════════════════════════════════════
function EventCard({ event, onClick }: { event: CampusEvent; onClick: () => void }) {
  const badge = parseDateBadge(event.date);

  const categoryColor: Record<string, string> = {
    Academic: "bg-[#1B2A4A] text-[#D4AF37] border-[#D4AF37]/30",
    Assembly: "bg-indigo-950/60 text-indigo-300 border-indigo-500/30",
    Clinical: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    "Social & Welfare": "bg-purple-950/60 text-purple-300 border-purple-500/30",
  };
  const catCls = categoryColor[event.category] ?? "bg-surface text-text-secondary border-border";

  return (
    <article className="group flex flex-col rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm hover:shadow-lg overflow-hidden">
      {/* Cover Banner */}
      <div className="relative w-full h-44 bg-surface-hover overflow-hidden shrink-0">
        <Image
          src={event.coverImage}
          alt={`${event.title} cover`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Monogram always rendered behind the image as fallback */}
        <EventMonogram title={event.title} category={event.category} />

        {/* Date Badge */}
        <div className="absolute top-3 left-3 flex flex-col items-center justify-center w-12 h-14 rounded-xl border border-[#D4AF37]/30 bg-[#1B2A4A]/80 backdrop-blur-sm shadow-md">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase leading-none tracking-wide">
            {badge.month}
          </span>
          <span className="text-xl font-black text-white leading-none mt-0.5">
            {badge.day}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category badge */}
        <span className={`self-start text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border mb-3 ${catCls}`}>
          {event.category}
        </span>

        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
          {event.summary}
        </p>

        {/* Venue + Time */}
        <div className="flex flex-col gap-1.5 text-xs text-text-secondary mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="text-[#D4AF37] shrink-0" />
            {event.venue}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#D4AF37] shrink-0" />
            {event.time}
          </span>
        </div>

        {/* Speaker Pills */}
        {event.speakers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.speakers.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#D4AF37]/20 bg-[#1B2A4A]/40 text-[#D4AF37]"
              >
                {s}
              </span>
            ))}
            {event.speakers.length > 3 && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-border bg-surface-hover text-text-secondary">
                +{event.speakers.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#C5A028] transition-colors group/btn cursor-pointer"
          >
            <span>Read Full Story &amp; View Gallery</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Events Page
// ══════════════════════════════════════════════════════════════════════════════
export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<CampusEvent[]>(
    (eventsRaw as CampusEvent[]) || []
  );
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  // Client-side ISO date comparison (matches API logic)
  const [today, setToday] = useState("2026-10-01");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(getTodayISO());

    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.events)) {
          setAllEvents(data.events);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch events from /api/events:", err);
      });
  }, []);

  const upcomingEvents = allEvents
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const pastEvents = allEvents
    .filter((e) => e.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  const activeEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <>
      <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-8 mb-24 px-4 sm:px-6 relative z-10">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
            <Calendar size={15} />
            <span>Council Events &amp; Assembly Calendar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-3xl">
            Campus Events &amp; Assembly Calendar
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 max-w-2xl mx-auto mt-4 text-left">
            Stay informed on official student assemblies, academic workshops, clinical symposiums,
            and council engagement sessions.
          </p>

          {/* Tab Navigation */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 border-b border-border mt-8">
            <button
              type="button"
              id="tab-upcoming"
              onClick={() => setActiveTab("upcoming")}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-text-secondary hover:text-text-primary border-b-2 border-transparent"
              }`}
            >
              <CalendarDays size={16} />
              <span>Upcoming Events</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === "upcoming"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "bg-surface-hover text-text-secondary"
                }`}
              >
                {upcomingEvents.length}
              </span>
            </button>

            <button
              type="button"
              id="tab-past"
              onClick={() => setActiveTab("past")}
              className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "past"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-text-secondary hover:text-text-primary border-b-2 border-transparent"
              }`}
            >
              <History size={16} />
              <span>Past Events Archive</span>
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === "past"
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "bg-surface-hover text-text-secondary"
                }`}
              >
                {pastEvents.length}
              </span>
            </button>
          </div>
        </section>

        {/* ── Events Grid or Empty State ────────────────────────────────── */}
        <section className="w-full">
          {activeEvents.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6 border border-brand/20">
                <CalendarDays size={32} strokeWidth={1.75} />
              </div>

              <div className="inline-block px-3 py-1 bg-surface-hover border border-border text-text-secondary text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
                Official Council Calendar
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-3">
                {activeTab === "upcoming"
                  ? "No Upcoming Events Scheduled"
                  : "No Past Events Recorded"}
              </h2>

              <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                {activeTab === "upcoming"
                  ? "No upcoming campus events scheduled at this time. Official notices and assembly registrations will be published here upon council announcement."
                  : "No archived event proceedings have been cataloged for the current academic session."}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/announcements"
                  className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center gap-1.5"
                >
                  <span>Read Council Announcements</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/contact"
                  className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all border border-slate-200 dark:border-[#1E2D4D] bg-white dark:bg-[#121D33] hover:bg-slate-100 dark:hover:bg-[#1E2D4D]/60 text-slate-900 dark:text-slate-200"
                >
                  Inquire with Secretariat
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}
