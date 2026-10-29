import Link from "next/link";
import Image from "next/image";
import governanceDataRaw from "@/data/governance.json";
import { GovernanceDocument } from "@/types/governance";
import {
  FileText,
  Download,
  Shield,
  Award,
  Users,
  Compass,
  CheckCircle2,
} from "lucide-react";

const governanceDocuments = governanceDataRaw as GovernanceDocument[];

export default function AboutPage() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-20 mt-8 mb-24 px-4 sm:px-6 relative z-10">
      {/* 1. Hero / Institutional Overview */}
      <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
        {/* Official University Crest */}
        <div className="mb-6 p-2 rounded-full bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] shadow-md inline-flex items-center justify-center">
          <Image
            src="/images/ecusta-crest.png"
            alt="ECUSTA Official Crest"
            width={72}
            height={72}
            className="rounded-full object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-4xl mx-auto">
          About the <span className="text-[#D4AF37]">ECUSTA Student Council</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto mt-5 pl-3 border-l-2 border-[#D4AF37]/80 text-left">
          The supreme representative body of medical students at the Ethiopian Catholic University of St. Thomas Aquinas (ECUSTA). We advance academic excellence, protect student welfare, and foster compassionate clinicians.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/council"
            className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] inline-flex items-center gap-2"
          >
            <Users size={16} />
            <span>Meet the Council</span>
          </Link>
          <Link
            href="#documents"
            className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all border border-slate-200 dark:border-[#1E2D4D] bg-white dark:bg-[#121D33] hover:bg-slate-100 dark:hover:bg-[#1E2D4D]/60 text-slate-900 dark:text-slate-200 inline-flex items-center gap-2"
          >
            <FileText size={16} />
            <span>Official Documents</span>
          </Link>
        </div>
      </section>

      {/* 2. Council Mission & Core Mandate */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-5">
              <Compass size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Our Mission</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              To faithfully represent the academic, spiritual, and clinical aspirations of all medical students, bridging dialogue between students, faculty leadership, and hospital administration.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border/60 text-xs font-semibold text-[#D4AF37]">
            Accountable Student Representation
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-5">
              <Award size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Academic Excellence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pioneering peer mentorship, preclinical resource sharing, exam preparation workshops, and ward readiness seminars designed to prepare students for national licensing and clinical practice.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border/60 text-xs font-semibold text-[#D4AF37]">
            Evidence-Based Medical Education
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-5">
              <Shield size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Student Welfare</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Safeguarding mental well-being, residential accommodation standards, anonymous grievance reporting, and financial solidarity initiatives across all study batches.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-border/60 text-xs font-semibold text-[#D4AF37]">
            Compassionate Care for Caregivers
          </div>
        </div>
      </section>

      {/* 3. Official Documents */}
      <section id="documents" className="flex flex-col space-y-6 scroll-mt-24">
        <div className="border-b border-border pb-4 space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Official Documents
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80">
            Constitution, bylaws, student codes, and institutional charters governing council operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governanceDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-xs group"
            >
              <div>
                {/* Header Row: Document Badge + File Size */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {doc.category}
                  </span>
                  <span className="text-xs font-medium text-text-secondary">
                    {doc.fileType} • {doc.fileSize}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-[#D4AF37] transition-colors">
                      {doc.title}
                    </h3>
                    <div className="text-xs text-text-secondary font-medium mt-0.5">
                      {doc.subtitle}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              {/* Download Action Button */}
              <div className="pt-5 mt-6 border-t border-border">
                <a
                  href={doc.fileUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download {doc.fileType} ({doc.fileSize})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Institutional Pillars Callout */}
      <section className="rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] p-8 sm:p-12">
        <div className="max-w-3xl">
          <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
            Democratically Elected • Transparently Governed
          </h3>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
            The Council operates under regular annual general assemblies where every medical batch from preclinical introductory terms through final clinical clerkships exercises voting franchise and direct oversight over all student welfare allocations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-text-primary">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
              <span>Full Batch Proportional Representation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
              <span>Regular Open General Assemblies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
              <span>Dedicated Clinical Ward Transition Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
              <span>Audited Welfare Solidarity Protocols</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
