"use client";

import { useState } from "react";
import Image from "next/image";
import councilMembers from "@/data/council.json";
import { CouncilMember } from "@/types/council";
import { Mail, Send, Check, Award } from "lucide-react";

// Fallback Linkedin icon since it's missing in the current lucide-react package
function Linkedin({ size = 24, strokeWidth = 2, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

// The fallback monogram component
function FallbackAvatar({ name }: { name: string }) {
  const initials = (name || "CM")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full bg-surface-hover flex items-center justify-center text-text-secondary text-2xl font-bold tracking-widest border-b border-border">
      {initials || "CM"}
    </div>
  );
}

// Individual member card
function CouncilMemberCard({ member }: { member: CouncilMember }) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyEmail = () => {
    if (!member.email) return;
    navigator.clipboard.writeText(member.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const telegramUser = member.telegram?.replace(/^@/, "");

  const hasExtendedContent = Boolean(
    (member.bio && member.bio.length > 120) ||
    member.quote ||
    (member.leadership && member.leadership.length > 0)
  );

  return (
    <div className="flex flex-col justify-between h-full bg-white dark:bg-[#121D33] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm hover:shadow-md group">
      {/* Top Part: Image + Content */}
      <div className="flex flex-col">
        {/* Image container */}
        <div className="relative w-full aspect-square bg-[#0F1B33] overflow-hidden">
          {!imageError && member.image ? (
            <Image
              src={member.image}
              alt={member.name || "Council Member"}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <FallbackAvatar name={member.name || "Council Member"} />
          )}
        </div>

        {/* Content block */}
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-1">{member.name}</h2>
            <div className="inline-block text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 mb-2">
              {member.role}
            </div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              {member.department} • {member.batch}
            </p>
          </div>

          {/* Bio paragraph with line clamping */}
          {member.bio && (
            <p className={`text-sm text-slate-600 dark:text-slate-300 leading-relaxed ${hasExtendedContent && !isExpanded ? "line-clamp-3" : ""}`}>
              {member.bio}
            </p>
          )}

          {/* Read more / Show less toggle */}
          {hasExtendedContent && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-medium text-[#D4AF37] hover:text-[#C5A028] mt-1 inline-flex items-center gap-1 self-start cursor-pointer transition-colors"
            >
              {isExpanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}

          {/* Extended details (Quote & Leadership) revealed when expanded */}
          {isExpanded && (
            <div className="mt-4 space-y-4 animate-in fade-in-0 duration-200">
              {/* Guiding Quote / Scripture */}
              {member.quote && (
                <div className="p-3 rounded-lg bg-surface-hover/70 border-l-2 border-[#D4AF37] text-xs text-text-secondary">
                  <p className="italic mb-1">
                    &ldquo;{member.quote.text}&rdquo;
                  </p>
                  {member.quote.reference && (
                    <span className="text-[11px] font-semibold text-[#D4AF37] block text-right">
                      — {member.quote.reference}
                    </span>
                  )}
                </div>
              )}

              {/* Leadership & Experience List */}
              {member.leadership && member.leadership.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2.5">
                    <Award size={14} className="text-[#D4AF37] shrink-0" />
                    <span>Leadership &amp; Experience</span>
                  </div>
                  <ul className="space-y-2">
                    {member.leadership.map((item, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                        <div className="flex-1 leading-snug">
                          <span className="font-semibold text-text-primary">{item.title}</span>
                          {item.organization && (
                            <span className="text-text-secondary">, {item.organization}</span>
                          )}
                          {item.period && (
                            <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1.5 font-medium">
                              ({item.period})
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Links pinned to bottom */}
      <div className="p-5 sm:p-6 pt-0 mt-auto">
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          {member.email && (
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-hover hover:bg-[#D4AF37] hover:text-[#0F1B33] text-text-secondary transition-colors cursor-pointer"
              title={`Click to copy: ${member.email}`}
            >
              {copied ? <Check size={18} strokeWidth={2} /> : <Mail size={18} strokeWidth={2} />}
            </button>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-hover hover:bg-[#0077b5] hover:text-white text-text-secondary transition-colors"
              title={`Connect with ${member.name} on LinkedIn`}
            >
              <Linkedin size={18} strokeWidth={2} />
            </a>
          )}
          {telegramUser && (
            <a
              href={`https://t.me/${telegramUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-hover hover:bg-[#0088cc] hover:text-white text-text-secondary transition-colors"
              title={`Message ${member.name} on Telegram`}
            >
              <Send size={18} strokeWidth={2} className="ml-[-2px]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


export default function CouncilPage() {
  console.log("Total Council Members Loaded:", councilMembers.length);

  const members: CouncilMember[] = councilMembers as CouncilMember[];

  // Normalize category checks using .toLowerCase().trim()
  const getCategory = (member: CouncilMember): string => {
    if (member.category) {
      const normalizedCat = member.category.toLowerCase().trim();
      if (normalizedCat === "vp" || normalizedCat === "developer" || normalizedCat === "hospital_rep") {
        return normalizedCat;
      }
      if (
        normalizedCat.includes("vp") ||
        normalizedCat.includes("executive") ||
        normalizedCat.includes("president") ||
        normalizedCat.includes("secretary")
      ) {
        return "vp";
      }
      if (normalizedCat.includes("dev")) {
        return "developer";
      }
      if (normalizedCat.includes("hospital") || normalizedCat.includes("clinical")) {
        return "hospital_rep";
      }
      return normalizedCat;
    }

    // Fallback to role inference if category is missing or undefined
    const role = (member.role || "").toLowerCase().trim();
    if (
      role.includes("president") ||
      role.includes("vp") ||
      role.includes("secretary")
    ) {
      return "vp";
    }
    if (role.includes("developer") || role.includes("dev")) {
      return "developer";
    }
    if (
      role.includes("representative") ||
      role.includes("rep") ||
      role.includes("hospital") ||
      role.includes("clinical") ||
      role.includes("intern")
    ) {
      return "hospital_rep";
    }

    return "other";
  };

  const executives = members.filter((m) => getCategory(m) === "vp");
  const clinicalReps = members.filter((m) => getCategory(m) === "hospital_rep");
  const developers = members.filter((m) => getCategory(m) === "developer");
  const otherMembers = members.filter((m) => {
    const cat = getCategory(m);
    return cat !== "vp" && cat !== "developer" && cat !== "hospital_rep";
  });

  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-12 mb-24 px-4 sm:px-6 relative z-10">

      {/* Header */}
      <section className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary mb-4">
          Council Leadership
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 max-w-2xl mx-auto text-left">
          Meet the dedicated representatives working to serve the student body and drive academic excellence.
        </p>
      </section>

      {/* Directory Grid: Executives */}
      {executives.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-border pb-3">Executive boards &amp; VPs</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
            {executives.map((member) => (
              <div key={member.id} className="w-[84vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col">
                <CouncilMemberCard member={member} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Directory Grid: Clinical */}
      {clinicalReps.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-border pb-3">Clinical &amp; Hospital Representatives</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
            {clinicalReps.map((member) => (
              <div key={member.id} className="w-[84vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col">
                <CouncilMemberCard member={member} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Directory Grid: Developers */}
      {developers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-border pb-3">Development &amp; Digital Team</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
            {developers.map((member) => (
              <div key={member.id} className="w-[84vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col">
                <CouncilMemberCard member={member} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Directory Grid: Fallback / Council Representatives */}
      {otherMembers.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-border pb-3">Council Representatives</h2>
          <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 scrollbar-none">
            {otherMembers.map((member) => (
              <div key={member.id} className="w-[84vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none flex flex-col">
                <CouncilMemberCard member={member} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
