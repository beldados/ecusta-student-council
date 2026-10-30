import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Send, ShieldCheck, Terminal } from "lucide-react";
import initiativesDataRaw from "@/data/initiatives.json";
import { Initiative } from "@/types/initiative";
import LiveCommunityBox from "@/components/initiatives/LiveCommunityBox";

const initiatives = initiativesDataRaw as Initiative[];

export async function generateStaticParams() {
  return initiatives.map((i) => ({
    id: i.id,
  }));
}


export default async function InitiativeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initiative = initiatives.find(
    (i) => i.id.toLowerCase() === id.toLowerCase()
  );

  if (!initiative) {
    notFound();
  }

  const isAtlas = initiative.id === "ecusta-atlas";

  const primaryActionUrl =
    initiative.actionUrl ||
    initiative.href ||
    (initiative.id === "council-mentorship" || initiative.id === "mentorship" ? "/mentorship" : undefined);

  const primaryActionLabel =
    initiative.actionLabel ||
    (isAtlas
      ? "Launch @EcustaAtlasBot"
      : initiative.id === "council-mentorship" || initiative.id === "mentorship"
      ? "Explore Mentorship Cohort"
      : "Launch Initiative");

  const isPrimaryExternal = Boolean(
    primaryActionUrl &&
      (primaryActionUrl.startsWith("http://") || primaryActionUrl.startsWith("https://"))
  );

  return (
    <div className="flex flex-col max-w-6xl mx-auto px-4 sm:px-6 mt-8 mb-24 relative z-10">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link
          href="/#initiatives"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Initiatives</span>
        </Link>
      </div>

      {/* 12-Column Responsive Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-2">
        {/* LEFT COLUMN: Editorial Story & Manifesto (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-10">
          {/* Header block */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                {initiative.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{initiative.status || "Active Initiative"}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
              {initiative.title}
            </h1>

            {initiative.stats && (
              <p className="text-sm sm:text-base font-semibold text-[#D4AF37] mt-3">
                {initiative.stats}
              </p>
            )}
          </div>

          {/* High-Impact Opening Quote */}
          {initiative.quote && (
            <blockquote className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121D33] border-l-4 border-[#D4AF37] border border-slate-200 dark:border-[#1E2D4D] shadow-sm text-lg sm:text-xl font-medium italic text-text-primary leading-relaxed">
              &ldquo;{initiative.quote}&rdquo;
            </blockquote>
          )}

          {/* Full Narrative & Story */}
          {initiative.story && initiative.story.length > 0 && (
            <div className="space-y-5 text-base sm:text-lg text-text-secondary leading-relaxed">
              {initiative.story.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Core Architectural Pillars */}
          {initiative.pillars && initiative.pillars.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-border">
              <div>
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                  Core Pillars & Capabilities
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Key offerings built to empower the student body across their academic lifecycle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initiative.pillars.map((pillar) => (
                  <div
                    key={pillar.number}
                    className="p-5 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] flex flex-col justify-between hover:border-[#D4AF37]/50 transition-colors shadow-sm"
                  >
                    <div>
                      <span className="font-mono text-2xl font-black text-[#D4AF37] block mb-2">
                        {pillar.number}
                      </span>
                      <h3 className="text-base font-bold text-text-primary mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vision & Belief Callout Box */}
          {initiative.vision && (
            <div className="p-7 sm:p-8 rounded-2xl bg-surface-hover/80 border border-brand/25 relative overflow-hidden">
              <div className="text-xs uppercase tracking-wider font-bold text-brand mb-2">
                {initiative.vision.motto}
              </div>
              <p className="text-base sm:text-lg text-text-primary font-medium leading-relaxed italic">
                &ldquo;{initiative.vision.statement}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Visuals, Tools, Bot Terminal & Actions (Sticky, col-span-5) */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Visual Showcase Box: Logo emblem in clean dark panel */}
            {initiative.image && (
              <div className="relative w-full aspect-video sm:aspect-[16/10] bg-black rounded-2xl overflow-hidden p-6 flex items-center justify-center border border-slate-800 shadow-md">
                <Image
                  src={initiative.image}
                  alt={initiative.title}
                  fill
                  priority
                  className="object-contain p-6"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            )}

            {/* Live Community Card */}
            {isAtlas && (
              <LiveCommunityBox
                telegramUrl={initiative.socials?.telegram || "https://t.me/EcustaAtlas"}
                instagramUrl={initiative.socials?.instagram || "https://www.instagram.com/ecusta.atlas"}
              />
            )}

            {/* Interactive Bot Terminal (if commands exist) */}
            {initiative.commands && initiative.commands.length > 0 && (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg text-slate-200">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1 ml-2">
                      <Terminal size={13} className="text-emerald-400" />
                      <span>bot-commands</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Telegram API
                  </span>
                </div>

                <div className="space-y-2">
                  {initiative.commands.map((cmd) => (
                    <div
                      key={cmd.command}
                      className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-col gap-0.5 font-mono text-xs hover:border-emerald-500/40 transition-colors"
                    >
                      <span className="font-bold text-emerald-400">{cmd.command}</span>
                      <span className="text-[11px] text-slate-300 font-sans">
                        {cmd.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary & Secondary Community Actions */}
            <div className="space-y-3">
              {primaryActionUrl && (
                isPrimaryExternal ? (
                  <a
                    href={primaryActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] group cursor-pointer"
                  >
                    <Send size={16} />
                    <span>{primaryActionLabel}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <Link
                    href={primaryActionUrl}
                    className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] group cursor-pointer"
                  >
                    <span>{primaryActionLabel}</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )
              )}

              {/* Secondary Links for Atlas */}
              {isAtlas && (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={initiative.channelUrl || "https://t.me/EcustaAtlas"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover text-text-primary text-xs font-semibold transition-colors"
                  >
                    <Send size={13} className="text-[#0088cc]" />
                    <span>Join Channel</span>
                  </a>

                  <a
                    href={initiative.socials?.instagram || "https://www.instagram.com/ecusta.atlas"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface border border-border hover:bg-surface-hover text-text-primary text-xs font-semibold transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" className="text-[#e1306c]">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </div>
              )}
            </div>

            {/* Attribution Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
                  Initiative Governance
                </div>
                <div className="text-xs font-bold text-text-primary">
                  {initiative.architect ||
                    (initiative.lead ? `Led by ${initiative.lead}` : "ECUSTA Student Council")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
