import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import FeedbackForm from "@/components/forms/FeedbackForm";

export default function ContactPage() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto space-y-12 mt-8 mb-24 px-4 sm:px-6 relative z-10">
      {/* Header */}
      <section className="flex flex-col items-center justify-center text-center py-10 border-b border-border">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 text-brand text-xs sm:text-sm font-semibold mb-4 border border-brand/20">
          <MessageSquare size={15} />
          <span>Student Voice & Secretariat Desk</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-text-primary leading-[1.15] max-w-3xl">
          Student Feedback & Direct Council Inquiry
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 max-w-2xl mx-auto mt-4 text-left">
          Submit curriculum inquiries, hospital attachment feedback, facility concerns, or council petitions. Submissions can be submitted with identity or 100% anonymously.
        </p>
      </section>

      {/* Main Grid: Form + Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Feedback Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Submit Council Inquiry or Feedback
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 mb-8">
              Every message is routed directly to the Council Secretariat and reviewed in executive assembly.
            </p>

            <FeedbackForm />
          </div>
        </div>

        {/* Right Column: Secretariat Channels & Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Institutional Integrity Box */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
                Council Confidentiality Guarantee
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The ECUSTA Student Council operates under strict non-retaliation and confidentiality statutes. Anonymous inquiries are processed without IP logging or student identifier tracking.
            </p>
            <div className="text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
              Constitution Article 14 • Student Voice & Petitions
            </div>
          </div>

          {/* Direct Secretariat Contacts */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] transition-all duration-200 hover:border-[#D4AF37]/60 dark:hover:border-[#D4AF37]/50 hover:-translate-y-0.5 shadow-sm space-y-5">
            <h3 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Direct Communication Channels
            </h3>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <Mail size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text-primary">Official Secretariat Email</div>
                <div className="text-text-secondary font-mono text-xs mt-0.5">
                  secretariat.sc@ecusta.edu.et
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <MapPin size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text-primary">Campus Secretariat Office</div>
                <div className="text-text-secondary text-xs mt-0.5">
                  ECUSTA Main Medical Campus, Student Center Building, Office 204
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <MessageSquare size={18} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-text-primary">Telegram Confidential Enquiry Desk</div>
                <div className="text-text-secondary text-xs mt-0.5">
                  Direct inquiries and petition submissions via{" "}
                  <Link
                    href="https://t.me/EcustaEnquiryBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] font-semibold hover:underline"
                  >
                    @EcustaEnquiryBot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
