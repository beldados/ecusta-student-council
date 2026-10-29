"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
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

interface SocialStats {
  telegram?: { count: string; label: string };
  instagram?: { count: string; label: string };
}

export default function LiveCommunityBox({
  telegramUrl = "https://t.me/EcustaAtlas",
  instagramUrl = "https://www.instagram.com/ecusta.atlas",
}: {
  telegramUrl?: string;
  instagramUrl?: string;
}) {
  const [stats, setStats] = useState<SocialStats | null>({
    telegram: { count: "64", label: "Subscribers" },
    instagram: { count: "500+", label: "Community" },
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/social-stats")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live social stats:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121D33] border border-slate-200 dark:border-[#1E2D4D] shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-bold text-text-secondary">
          Live Community Stats
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Synced</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1B33] hover:border-[#0088cc]/50 border border-slate-200 dark:border-[#1E2D4D] transition-colors flex flex-col gap-1 group"
        >
          <div className="flex items-center gap-1.5 text-xs text-text-secondary group-hover:text-[#0088cc] transition-colors">
            <Send size={13} className="text-[#0088cc]" />
            <span>Telegram</span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {stats?.telegram?.count || "64"}
          </div>
          <div className="text-[11px] text-text-secondary">
            {stats?.telegram?.label || "Subscribers"}
          </div>
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-slate-50 dark:bg-[#0F1B33] hover:border-[#e1306c]/50 border border-slate-200 dark:border-[#1E2D4D] transition-colors flex flex-col gap-1 group"
        >
          <div className="flex items-center gap-1.5 text-xs text-text-secondary group-hover:text-[#e1306c] transition-colors">
            <InstagramIcon size={13} className="text-[#e1306c]" />
            <span>Instagram</span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {stats?.instagram?.count || "500+"}
          </div>
          <div className="text-[11px] text-text-secondary">
            {stats?.instagram?.label || "Community"}
          </div>
        </a>
      </div>
    </div>
  );
}
