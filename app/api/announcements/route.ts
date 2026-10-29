import { NextRequest, NextResponse } from "next/server";
import announcementsRaw from "@/data/announcements.json";
import { Announcement } from "@/types/announcement";
import { scrapeCampusFeed } from "@/lib/telegram-feed";

// Tell Next.js this is a dynamic runtime route (NOT static prerendered)
export const dynamic = "force-dynamic";

/**
 * Instant Tag-First Matching & Approval Helper
 * Checks for all common tag variations case-insensitively with Zero AI Delay.
 */
export function evaluatePostTags(rawText: string) {
  const lowerText = rawText.toLowerCase();

  const isEventTag = lowerText.includes("#event") || lowerText.includes("#events");
  const isAnnouncementTag =
    lowerText.includes("#announcement") ||
    lowerText.includes("#announcements") ||
    lowerText.includes("#announcment") ||
    lowerText.includes("#notice");
  const isRecruitmentTag =
    lowerText.includes("#recruitment") ||
    lowerText.includes("#opportunity") ||
    lowerText.includes("#emsaecusta") ||
    lowerText.includes("apply now") ||
    lowerText.includes("join our team");

  const isInstantApproval = isEventTag || isAnnouncementTag || isRecruitmentTag;

  // Clean the text (strip hashtags)
  const cleanDisplayContent = rawText.replace(/#\w+/g, "").trim() || rawText;
  const lines = cleanDisplayContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  // Line 1 → Title. Remaining lines → Summary.
  const title = (lines[0] || "Campus Notice").slice(0, 90);
  const summary = (lines.slice(1).join(" ") || lines[0] || "").slice(0, 200);

  // Route:
  // If isEventTag → Set contentType: "EVENT". Otherwise → Set contentType: "ANNOUNCEMENT".
  const contentType: "EVENT" | "ANNOUNCEMENT" = isEventTag ? "EVENT" : "ANNOUNCEMENT";

  // If isRecruitmentTag → Set category to "Opportunity & Recruitment"
  const category = isRecruitmentTag ? "Opportunity & Recruitment" : "Announcements";

  return {
    isInstantApproval,
    isEventTag,
    isAnnouncementTag,
    isRecruitmentTag,
    contentType,
    category,
    title,
    summary,
    cleanContent: cleanDisplayContent,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");

    const rawList = (Array.isArray(announcementsRaw) ? announcementsRaw : []) as Announcement[];
    const { announcements: scrapedAnnouncements } = await scrapeCampusFeed();

    // Combine static and all worthy announcements (where contentType !== "EVENT")
    const combined = [...rawList, ...scrapedAnnouncements];

    // Smart Deduplication (NO REPETITION): Deduplicate by ID and cleaned title
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const uniqueAnnouncements = combined.filter((item) => {
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);

      // Clean title for comparison (ignore punctuation/spaces)
      const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 35);
      if (key && seenTitles.has(key)) {
        return false; // Skip duplicate!
      }
      if (key) {
        seenTitles.add(key);
      }
      return true;
    });

    // Sort by newest date first (pinned items prioritized if any)
    uniqueAnnouncements.sort((a, b) => {
      const aPinned = Boolean(a.pinned);
      const bPinned = Boolean(b.pinned);
      if (aPinned !== bPinned) {
        return aPinned ? -1 : 1;
      }
      return (b.date || "").localeCompare(a.date || "");
    });

    let filtered = uniqueAnnouncements;

    if (category && category.toLowerCase().trim() !== "all") {
      const lowerCat = category.toLowerCase().trim();
      filtered = filtered.filter(
        (a) => a.category && a.category.toLowerCase().trim() === lowerCat
      );
    }

    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        filtered = filtered.slice(0, limit);
      }
    }

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        announcements: filtered,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
        },
      }
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/announcements:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}
