"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Announcement } from "@/types/announcement";

export default function BroadcastBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    async function checkUrgentAnnouncement() {
      try {
        const res = await fetch("/api/announcements");
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.announcements)) {
          // Find the latest announcement with isUrgent === true or category === "Urgent"
          const urgent = data.announcements.find(
            (a: Announcement) => a.isUrgent === true || a.category?.toLowerCase() === "urgent"
          );

          if (urgent) {
            const dismissedId = sessionStorage.getItem("dismissed_broadcast_id");
            if (dismissedId === urgent.id) {
              setIsDismissed(true);
            } else {
              setAnnouncement(urgent);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching broadcast announcement:", error);
      }
    }

    checkUrgentAnnouncement();
  }, []);

  const dismiss = () => {
    if (announcement) {
      sessionStorage.setItem("dismissed_broadcast_id", announcement.id);
    }
    setIsDismissed(true);
  };

  if (isDismissed || !announcement) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full bg-[#9B1B30] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-md transition-all relative z-50"
    >
      {/* Left: Pulsing dot + 🚨 URGENT: + title */}
      <div className="flex items-center gap-2 truncate pr-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="font-bold tracking-wider text-amber-300 uppercase shrink-0">
          🚨 URGENT:
        </span>
        <span className="truncate">{announcement.title}</span>
      </div>

      {/* Right: Read Bulletin + Close */}
      <div className="flex items-center shrink-0">
        <Link
          href="/announcements"
          className="underline font-bold hover:text-amber-200 mr-4 transition-colors"
        >
          Read Bulletin →
        </Link>
        <button
          onClick={dismiss}
          type="button"
          aria-label="Dismiss broadcast"
          className="p-1 hover:bg-black/20 rounded transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
