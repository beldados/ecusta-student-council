"use client";

import { useState } from "react";
import initiativesDataRaw from "@/data/initiatives.json";
import { Initiative } from "@/types/initiative";
import InitiativeCard from "@/components/initiatives/InitiativeCard";

const initiatives = initiativesDataRaw as Initiative[];

export default function InitiativesGrid() {
  const [activeCategory, setActiveCategory] = useState<string>("All Causes");

  const categories = [
    "All Causes",
    ...Array.from(new Set(initiatives.map((i) => i.category).filter(Boolean))),
  ];

  const filteredInitiatives =
    activeCategory === "All Causes" || !activeCategory
      ? initiatives
      : initiatives.filter(
          (item) =>
            item.category?.toLowerCase().trim() ===
            activeCategory.toLowerCase().trim()
        );

  return (
    <div className="w-full">
      {/* Editorial Split-Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-[#1E2D4D]/80 pb-6 mb-8">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-slate-900 dark:text-white">
            Council Initiatives
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pl-3 border-l-2 border-[#D4AF37]/80">
            Digital systems, peer mentorship, and student welfare campaigns.
          </p>
        </div>
        
        {/* Filter Pills aligned to the right on desktop */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-3.5 py-1.5 text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#D4AF37] text-[#0F1B33] font-semibold shadow-sm"
                    : "bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A2846] font-medium"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredInitiatives.length === 0 ? (
        <p className="text-center text-slate-500 py-8">
          No initiatives found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredInitiatives.map((initiative) => (
            <div key={initiative.id} className="h-full flex flex-col">
              <InitiativeCard initiative={initiative} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
