"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ChevronDown,
  Send,
  ArrowRight,
  BookOpen,
  Landmark,
} from "lucide-react";
import clubsData from "@/data/clubs.json";
import { StudentOrganization } from "@/types/organization";

const organizations = clubsData as StudentOrganization[];

function InstagramIcon({ size = 15, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function OrganizationCard({ org }: { org: StudentOrganization }) {
  const [committeesOpen, setCommitteesOpen] = useState(false);
  const committees = org.committees || [];
  const hasCommittees = committees.length > 0;

  return (
    <article className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 shadow-sm overflow-hidden flex flex-col">
      {/* EMSA Parent Card */}
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Logo: width={56} height={56} rounded-lg */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-sm">
              <Image
                src={org.logo}
                alt={org.name}
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
                  {org.type}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {org.acronym}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                {org.name}
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                Presiding Lead: <span className="text-slate-700 dark:text-slate-300 font-semibold">{org.leadTitle}</span>
              </p>
            </div>
          </div>

          {/* Direct Social Channels: Telegram & Instagram */}
          <div className="flex items-center gap-2.5">
            {org.socials?.telegram && (
              <a
                href={org.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#1E2D4D]/60 hover:bg-[#0088cc] hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4D] transition-colors shadow-xs"
              >
                <Send size={13} className="text-[#0088cc] group-hover:text-white" />
                <span>Telegram</span>
              </a>
            )}
            {org.socials?.instagram && (
              <a
                href={org.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-[#1E2D4D]/60 hover:bg-[#e1306c] hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4D] transition-colors shadow-xs"
              >
                <InstagramIcon size={14} className="text-[#e1306c]" />
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {org.description}
        </p>

        {/* Committee Drawer Toggle Button */}
        {hasCommittees && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCommitteesOpen((prev) => !prev)}
              aria-expanded={committeesOpen}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] cursor-pointer"
            >
              <span>Explore Standing Committees ({committees.length})</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  committeesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Standing Committees Drawer (2x3 or 3x2 grid) */}
      {hasCommittees && committeesOpen && (
        <div className="border-t border-slate-200 dark:border-[#1E2D4D] bg-slate-50/70 dark:bg-[#0F1B33]/60 p-6 sm:p-8 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Standing Committees Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official functional divisions responsible for specialized portfolio execution.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
              {org.acronym}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {committees.map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Committee Logo + Acronym badge + Lead */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shrink-0 shadow-xs">
                      <Image
                        src={comm.logo}
                        alt={comm.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1B2A4A] text-[#D4AF37] border border-[#D4AF37]/30">
                        {comm.acronym}
                      </span>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {comm.leadTitle}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug mb-1.5">
                    {comm.name}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {comm.mandate}
                  </p>
                </div>

                {/* Direct icon links for Telegram & Instagram */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#1E2D4D]/60 flex items-center justify-end gap-2 text-xs">
                  {comm.socials?.telegram && (
                    <a
                      href={comm.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#1E2D4D] text-slate-500 dark:text-slate-400 hover:text-[#0088cc] transition-colors"
                      title={`${comm.acronym} Telegram`}
                    >
                      <Send size={14} className="text-[#0088cc]" />
                    </a>
                  )}
                  {comm.socials?.instagram && (
                    <a
                      href={comm.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#1E2D4D] text-slate-500 dark:text-slate-400 hover:text-[#e1306c] transition-colors"
                      title={`${comm.acronym} Instagram`}
                    >
                      <InstagramIcon size={14} className="text-[#e1306c]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

export default function ClubsPage() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-8 mb-24 px-4 sm:px-6 relative z-10">
      {/* 1. Header */}
      <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
          <Users size={15} />
          <span>Campus Societies &amp; Chapters</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-3xl">
          Student Organizations &amp; Societies
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37] max-w-2xl mx-auto mt-4 text-left">
          Officially recognized medical chapters, student associations, and campus societies at ECUSTA.
        </p>
      </section>

      {/* 2. Institutional Partnership Notice */}
      <div className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-5 sm:p-6 shadow-sm flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-0.5 text-left">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#D4AF37] block">
            Official Council Collaboration
          </span>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Student Council officially collaborates with recognized medical chapters and campus societies to support student development and global health advocacy.
          </p>
        </div>
      </div>

      {/* =========================================================================
          OFFICIAL PARTNERSHIP VERIFICATION NOTICE
          Displayed while EMSA-ECUSTA formal consent is finalized.
          ========================================================================= */}
      <div className="py-20 text-center max-w-2xl mx-auto space-y-4 px-4 bg-white dark:bg-[#121D33] rounded-2xl border border-slate-200 dark:border-[#1E2D4D] shadow-sm my-8">
        <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
          <Landmark size={24} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
          Student Organizations &amp; Medical Chapters
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 text-left">
          Student Organizations &amp; Medical Chapters directory is currently undergoing annual partnership charter verification for the 2026/2027 academic term. Official profiles and Standing Committees will be published upon ratification.
        </p>
      </div>

      {/* =========================================================================
          UNCOMMENT BELOW WHEN EMSA-ECUSTA FORMALLY APPROVES:
      <div className="space-y-8">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>
          ========================================================================= */}

      {/* 4. Bottom Charter Callout */}
      <section className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-2xl text-left">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <BookOpen size={15} />
            <span>Charter Guidelines</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Want to charter a recognized student society?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Consult the VP of Student Affairs or download the Charter Guidelines to initiate council accreditation.
          </p>
        </div>

        <Link
          href="/contact"
          className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center gap-1.5 shrink-0"
        >
          <span>Consult Secretariat</span>
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
