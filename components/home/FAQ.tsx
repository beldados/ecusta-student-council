"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import faqData from "@/data/faq.json";

export default function FAQ() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="flex flex-col w-full py-6 space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white text-left">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80 text-left">
          Everything you need to know about council governance, representation, and student initiatives.
        </p>
      </div>

      <div className="space-y-3 w-full">
        {faqData.map((item) => {
          const isOpen = activeId === item.id;
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-xl border transition-all duration-200 overflow-hidden shadow-xs",
                isOpen
                  ? "border-[#D4AF37]/50 dark:border-[#D4AF37]/40 bg-[#FAF8F5] dark:bg-[#121D33]"
                  : "border-slate-200 dark:border-[#1E2D4D] bg-white dark:bg-[#121D33] hover:border-slate-300 dark:hover:border-[#1E2D4D]/80"
              )}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors cursor-pointer gap-4"
                aria-expanded={isOpen}
              >
                <span
                  className={cn(
                    "font-semibold text-sm sm:text-base transition-colors",
                    isOpen
                      ? "text-[#D4AF37]"
                      : "text-slate-900 dark:text-white"
                  )}
                >
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200",
                    isOpen && "rotate-180 text-[#D4AF37]"
                  )}
                />
              </button>

              {isOpen && (
                <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
