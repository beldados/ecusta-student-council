"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  Lock,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

export default function FeedbackForm() {
  const [category, setCategory] = useState<string>("Academic");
  const [batch, setBatch] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  const categories = [
    "Academic",
    "Hospital Attachments",
    "Facilities",
    "General",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!category.trim()) {
      setErrorMsg("Please select a feedback category.");
      return;
    }

    if (!message.trim()) {
      setErrorMsg("Please write your message or inquiry.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          batch,
          fullName: isAnonymous ? "" : fullName,
          message,
          isAnonymous,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      // Reset form fields
      setMessage("");
      setBatch("");
      setFullName("");
      setIsAnonymous(false);

      // Trigger success confirmation
      setShowSuccessModal(true);
      setShowSuccessBanner(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span className="font-medium">
              Thank you! Your inquiry has been delivered directly to the Council Secretariat.
            </span>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-600/70 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-3 text-red-600 dark:text-red-400 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
            Select Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#0F1B33] border-[#D4AF37] shadow-sm"
                      : "bg-surface-hover text-text-secondary border-border hover:text-text-primary"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Anonymous Submission Toggle */}
        <div className="p-4 rounded-xl bg-surface-hover border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0">
              <Lock size={16} />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-text-primary">
                Anonymous Submission
              </div>
              <div className="text-[11px] text-text-secondary">
                Your identity will remain completely anonymous.
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]" />
          </label>
        </div>

        {/* Name & Batch Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Full Name {isAnonymous ? "(Hidden)" : "(Optional)"}
            </label>
            <input
              type="text"
              disabled={isAnonymous}
              value={isAnonymous ? "" : fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAnonymous ? "Anonymous Medical Student" : "e.g. Dawit Bekele"}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-colors ${
                isAnonymous
                  ? "bg-surface-hover border-border text-text-secondary cursor-not-allowed opacity-60"
                  : "bg-surface border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Student Batch / Year
            </label>
            <input
              type="text"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. PC 1, PC 2, Clinical I, ITM"
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-secondary text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors"
            />
          </div>
        </div>

        {/* Message Box */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
            Message / Inquiry / Petition <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Detail your inquiry, feedback, or suggestion clearly so the council secretariat can review it..."
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-secondary text-xs sm:text-sm focus:outline-none focus:border-brand transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* Submit to Secretariat Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-60 text-[#0F1B33] cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Submitting to Secretariat...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Submit to Secretariat</span>
            </>
          )}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-8 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] shadow-2xl text-center">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
              Inquiry Delivered
            </h3>

            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
              Thank you! Your inquiry has been delivered directly to the Council Secretariat.
            </p>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-6">
              Your submission has been securely ingested into the Secretariat docket for executive assembly review.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full text-xs sm:text-sm font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg shadow-sm transition-all bg-[#D4AF37] hover:bg-[#C5A028] text-[#0F1B33] cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
