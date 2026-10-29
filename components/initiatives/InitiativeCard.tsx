import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Initiative } from "@/types/initiative";

interface InitiativeCardProps {
  project?: Initiative;
  initiative?: Initiative;
}

export default function InitiativeCard({ project, initiative: directInitiative }: InitiativeCardProps) {
  const initiative: Initiative = directInitiative || project || ({} as Initiative);

  const tagline =
    initiative.tagline ||
    initiative.summary ||
    initiative.description ||
    "Advancing student life, academic excellence, and community initiatives across ECUSTA.";

  const statusColor =
    initiative.status === "Active"
      ? "bg-emerald-500"
      : initiative.status === "In Development"
      ? "bg-[#D4AF37]"
      : "bg-[#1B2A4A]";

  const targetHref =
    initiative.id === "council-mentorship" || initiative.id === "mentorship"
      ? "/mentorship"
      : initiative.actionUrl && initiative.actionUrl.startsWith("/")
      ? initiative.actionUrl
      : `/initiatives/${initiative.id}`;

  return (
    <Link
      href={targetHref}
      className="group flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm hover:shadow-md h-full min-h-[190px]"
    >
      <div>
        {/* Compact top bar: Category badge + Status indicator dot */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2D4D]/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E2D4D]">
            {initiative.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusColor}`} />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {initiative.status || "Active"}
            </span>
          </div>
        </div>

        {/* Bold Title */}
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-[#D4AF37] dark:group-hover:text-[#D4AF37] transition-colors mb-2">
          {initiative.title}
        </h3>

        {/* Clean 1-sentence tagline */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {tagline}
        </p>
      </div>

      {/* Bottom row: Lead / Stats pill + subtle "Explore Initiative →" link */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1E2D4D]/60 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-full truncate max-w-[60%]">
          {initiative.stats || initiative.lead || "Council Project"}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform shrink-0">
          <span>Explore Initiative</span>
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
