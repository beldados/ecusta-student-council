"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import mentorshipDataRaw from "@/data/mentorship.json";
import { Mentor, MentorshipData, Cohort } from "@/types/mentorship";
import {
  Clock,
  Search,
  Sparkles,
} from "lucide-react";

const mentorshipData = mentorshipDataRaw as MentorshipData;

const defaultCohorts: Cohort[] = [
  {
    id: "G1",
    name: "Generation 1 (PC → ITM)",
    cycle: "Academic Cycle 2026/2027",
    mentorBatch: "PC 1 & PC 2",
    menteeTarget: "ITM Students",
    status: "Active",
    summary: "15 Pre-Clinical mentors guiding ITM students through foundational medical sciences.",
  },
  {
    id: "G2",
    name: "Generation 2 (ITM → Freshmen)",
    cycle: "Academic Cycle 2026/2027",
    mentorBatch: "ITM",
    menteeTarget: "Freshmen",
    status: "Recruiting",
    summary: "Generation 2 mentor applications opening soon for ITM students.",
  },
];

const cohorts: Cohort[] =
  mentorshipData.cohorts && mentorshipData.cohorts.length > 0
    ? mentorshipData.cohorts
    : defaultCohorts;

// Fallback monogram avatar with institutional initials
function FallbackAvatar({ name }: { name: string }) {
  const initials = (name || "M")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-text-secondary dark:text-slate-200 text-3xl font-bold tracking-widest border-b border-border select-none">
      {initials || "M"}
    </div>
  );
}

// Mentor Card Component
function MentorCard({ mentor }: { mentor: Mentor }) {
  const [imageError, setImageError] = useState(false);

  const batchDisplay = mentor.batch || mentor.mentorBatch || "PC 1";
  const scheduleText = mentor.availability
    ? `${mentor.availability.startTime} – ${mentor.availability.endTime} • ${mentor.availability.frequency}`
    : mentor.availableTime || "Twice a week";

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121D33] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm hover:shadow-xl group">
      {/* Portrait photo container */}
      <div className="relative w-full aspect-[4/5] sm:h-72 overflow-hidden rounded-t-2xl bg-[#0F1B33]">
        {!imageError && mentor.image ? (
          <Image
            src={mentor.image}
            alt={mentor.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <FallbackAvatar name={mentor.name} />
        )}

        {/* Batch Badge */}
        <div className="absolute top-3 right-3 text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-[#D4AF37] text-[#0F1B33] shadow-md">
          {batchDisplay}
        </div>
      </div>

      {/* Content Block */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Mentor Name */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-[#D4AF37] transition-colors">
            {mentor.name}
          </h3>
        </div>

        {/* Student quote/advice */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-[#D4AF37]/80 pl-3 my-3 flex-1">
          &ldquo;{mentor.quote}&rdquo;
        </p>

        {/* Schedule Pill with Clock Icon */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-surface-hover px-3 py-2 rounded-lg border border-border">
            <Clock size={14} className="text-[#D4AF37] shrink-0" />
            <span className="truncate">{scheduleText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorshipPage() {
  const [activeCohortId, setActiveCohortId] = useState<string>("G1");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeMentors: Mentor[] = useMemo(() => {
    const list = Array.isArray(mentorshipData.mentors) ? mentorshipData.mentors : [];
    return list.filter((m) => m.isPublished !== false);
  }, []);

  const activeCohort =
    cohorts.find((c) => c.id === activeCohortId) || cohorts[0];

  // Mentors within active cohort
  const cohortMentors = useMemo(() => {
    return activeMentors.filter(
      (m) => (m.cohortId || m.generation || "G1") === activeCohortId
    );
  }, [activeMentors, activeCohortId]);

  // Derive batch counts and filter pills for active cohort
  const batchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cohortMentors.forEach((m) => {
      const b = m.batch || m.mentorBatch || "Other";
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [cohortMentors]);

  const batchFilterTabs = useMemo(() => {
    if (cohortMentors.length === 0) return [];
    const uniqueBatches = Object.keys(batchCounts).sort();
    return [
      { id: "all", label: `All Mentors (${cohortMentors.length})` },
      ...uniqueBatches.map((b) => ({
        id: b,
        label: `Batch ${b} (${batchCounts[b]})`,
      })),
    ];
  }, [cohortMentors.length, batchCounts]);

  // Filtered mentors based on active batch tab and search query
  const filteredMentors = useMemo(() => {
    if (cohortMentors.length === 0) return [];
    return cohortMentors.filter((mentor) => {
      const mentorBatch = mentor.batch || mentor.mentorBatch || "";
      const matchesBatch =
        selectedBatch === "all" ||
        mentorBatch === selectedBatch ||
        mentorBatch.toLowerCase().replace(/\s+/g, "") ===
          selectedBatch.toLowerCase().replace(/\s+/g, "");

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        mentor.name.toLowerCase().includes(query) ||
        mentorBatch.toLowerCase().includes(query) ||
        mentor.menteeTarget.toLowerCase().includes(query) ||
        mentor.quote.toLowerCase().includes(query);

      return matchesBatch && matchesSearch;
    });
  }, [cohortMentors, selectedBatch, searchQuery]);

  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-8 mb-24 relative z-10 px-4 sm:px-6">
      {/* 1. Header Hero (Clean, uncluttered, no floating metrics badge) */}
      <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-4xl mx-auto">
          {mentorshipData.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 max-w-3xl mx-auto mt-4 text-left">
          {mentorshipData.description}
        </p>

        {/* Sleek Cohort Switcher Tabs: Directly below page description */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 border-b border-border">
          {cohorts.map((cohort) => {
            const isActive = activeCohortId === cohort.id;
            const isCohortActive = cohort.status === "Active";

            return (
              <button
                key={cohort.id}
                type="button"
                onClick={() => {
                  setActiveCohortId(cohort.id);
                  setSelectedBatch("all");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2.5 pb-3 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                    : "text-text-secondary hover:text-text-primary border-b-2 border-transparent"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCohortActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                <span>{cohort.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Cohort Summary Banner: 1-line narrative */}
        <div className="mt-4 px-5 py-2 rounded-full bg-surface border border-border text-xs sm:text-sm text-text-secondary max-w-2xl mx-auto flex items-center justify-center gap-2 text-center">
          <span className="font-bold text-text-primary uppercase tracking-wider">
            {activeCohort.id}:
          </span>
          <span>{activeCohort.summary}</span>
        </div>
      </section>

      {/* 2. Directory Section */}
      <section className="flex flex-col space-y-8">
        {cohortMentors.length === 0 ? (
          /* Dignified Notice for empty cohort (e.g. Generation 2) */
          <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <Sparkles size={32} strokeWidth={1.75} />
            </div>

            <div className="inline-block px-3 py-1 bg-surface-hover border border-border text-text-secondary text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              {activeCohort.name} • {activeCohort.cycle}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-3">
              {activeCohort.id === "G2"
                ? "Generation 2 mentor applications opening soon for ITM students."
                : "Cohort Roster Under Preparation"}
            </h2>

            <p className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
              {activeCohort.summary}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33]"
              >
                Inquire About Recruitment
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActiveCohortId("G1");
                  setSelectedBatch("all");
                }}
                className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all border border-slate-200 dark:border-[#1E2D4D] bg-white dark:bg-[#121D33] hover:bg-slate-100 dark:hover:bg-[#1E2D4D]/60 text-slate-900 dark:text-slate-200 cursor-pointer"
              >
                View Generation 1 Mentors ({activeMentors.length})
              </button>
            </div>
          </div>
        ) : (
          /* Populated State with Batch Filter Tabs, Search, and 15 Mentor Cards */
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Batch Filter Tabs: [ All Mentors (15) ], [ Batch PC 1 (12) ], [ Batch PC 2 (3) ] */}
              {batchFilterTabs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-1">
                  {batchFilterTabs.map((tab) => {
                    const isActive = selectedBatch === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedBatch(tab.id)}
                        className={`pb-2 px-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                            : "text-text-secondary hover:text-text-primary border-b-2 border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Quick Search */}
              <div className="relative w-full md:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder="Search mentors by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-surface border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs font-medium text-text-secondary px-1">
              <span>
                Showing <strong className="text-text-primary">{filteredMentors.length}</strong> of{" "}
                <strong className="text-text-primary">{cohortMentors.length}</strong> mentors in {activeCohort.id}
              </span>
              {selectedBatch !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedBatch("all")}
                  className="text-[#D4AF37] hover:underline font-semibold cursor-pointer"
                >
                  Reset to All Mentors
                </button>
              )}
            </div>

            {/* Mentor Cards: mobile peek carousel + responsive desktop grid */}
            {filteredMentors.length > 0 ? (
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
                {filteredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="w-[84vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col"
                  >
                    <MentorCard mentor={mentor} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-12 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center text-text-secondary mb-4">
                  <Search size={20} />
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-1">No Mentors Match Search</h4>
                <p className="text-sm text-text-secondary max-w-sm mb-6">
                  No mentors matched your current filter criteria. Try selecting another batch or clearing your search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBatch("all");
                    setSearchQuery("");
                  }}
                  className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] cursor-pointer"
                >
                  Show All Mentors
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
