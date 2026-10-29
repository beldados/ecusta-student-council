import { NextRequest, NextResponse } from "next/server";
import eventsData from "@/data/events.json";
import { CampusEvent } from "@/types/event";
import { scrapeCampusFeed } from "@/lib/telegram-feed";

// Dynamic runtime route for live Telegram events feed
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filter = searchParams.get("filter"); // "upcoming" | "past" | null

    const staticEvents = (Array.isArray(eventsData) ? eventsData : []) as CampusEvent[];
    const { events: scrapedEvents } = await scrapeCampusFeed();

    // Merge static events and dynamic events from Telegram (where contentType === "EVENT")
    const combined = [...staticEvents, ...scrapedEvents];

    // Deduplicate by ID and cleaned title
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const uniqueEvents = combined.filter((e) => {
      if (seenIds.has(e.id)) return false;
      seenIds.add(e.id);

      const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 35);
      if (key && seenTitles.has(key)) return false;
      if (key) seenTitles.add(key);
      return true;
    });

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const upcoming = uniqueEvents
      .filter((e) => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));

    const past = uniqueEvents
      .filter((e) => e.date < today)
      .sort((a, b) => b.date.localeCompare(a.date)); // Most recent past first

    if (filter === "upcoming") {
      return NextResponse.json({
        success: true,
        count: upcoming.length,
        events: upcoming,
      });
    }

    if (filter === "past") {
      return NextResponse.json({
        success: true,
        count: past.length,
        events: past,
      });
    }

    return NextResponse.json(
      {
        success: true,
        totalCount: uniqueEvents.length,
        upcomingCount: upcoming.length,
        pastCount: past.length,
        events: uniqueEvents,
        upcoming,
        past,
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
    console.error("Error in /api/events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load events" },
      { status: 500 }
    );
  }
}
