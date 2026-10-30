import { Announcement } from "@/types/announcement";
import { CampusEvent } from "@/types/event";
import { evaluateTelegramPost } from "@/lib/ai";

export const MONITORED_CHANNELS = [
  { handle: "ecustanotice", source: "University Notice Board", category: "Administration" },
  { handle: "EcustaAtlas", source: "Student Council / Atlas", category: "Campus Governance" },
  /* =========================================================================
     TEMPORARILY PAUSED: Pending formal written consent from EMSA-ECUSTA.
     To restore when approved, simply uncomment these lines:
  { handle: "emsa_ecusta", source: "EMSA-ECUSTA", category: "Medical Association" },
  { handle: "scome_ecusta", source: "EMSA SCOME", category: "Medical Education" },
  { handle: "scoph_ecusta", source: "EMSA SCOPH", category: "Public Health" },
  { handle: "Scoreecusta", source: "EMSA SCORE", category: "Research Exchange" },
  { handle: "SCORP_ECUSTA", source: "EMSA SCORP", category: "Human Rights & Peace" },
  { handle: "scora_ecusta", source: "EMSA SCORA", category: "Reproductive Health" },
  { handle: "scope_ecusta", source: "EMSA SCOPE", category: "Professional Exchange" },
     ========================================================================= */
];

const OFFICIAL_KEYWORD_REGEX =
  /(?:#announcement|#announcements|#event|#workshop|\b(?:notice|announcement|exam|schedule|assembly|registration|attention|workshop|tournament|conference|seminar)\b)/i;

function cleanHtmlText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "$2")
    .replace(/<[^>]+>/g, "")
    .replace(/&#33;/g, "!")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractApplicationLink(rawHtmlOrText: string): string | null {
  const formMatch = rawHtmlOrText.match(
    /https?:\/\/(?:forms\.gle\/[a-zA-Z0-9_\-]+|docs\.google\.com\/forms\/[^\s"'<]+)/i
  );
  if (formMatch) return formMatch[0];

  const applyMatch = rawHtmlOrText.match(
    /https?:\/\/[^\s"'<]+(?:form|apply|register|survey)[^\s"'<]*/i
  );
  if (applyMatch) return applyMatch[0];

  const tgApplyMatch = rawHtmlOrText.match(
    /https?:\/\/t\.me\/[a-zA-Z0-9_]+(?:bot|_bot|apply|register)/i
  );
  if (tgApplyMatch) return tgApplyMatch[0];

  return null;
}

function mapEventCategory(cat?: string): CampusEvent["category"] {
  if (!cat) return "Assembly";
  const lower = cat.toLowerCase();
  if (lower.includes("academic") || lower.includes("education")) return "Academic";
  if (lower.includes("clinical") || lower.includes("hospital") || lower.includes("health"))
    return "Clinical";
  if (lower.includes("social") || lower.includes("welfare") || lower.includes("sports"))
    return "Social & Welfare";
  return "Assembly";
}

// In-memory feed cache with 10-minute TTL
let cachedFeed: { announcements: Announcement[]; events: CampusEvent[] } | null = null;
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 600 * 1000;

export async function scrapeCampusFeed(): Promise<{
  announcements: Announcement[];
  events: CampusEvent[];
}> {
  // During build / prerendering, return empty to prevent worker heap exhaustion and hanging promises
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return { announcements: [], events: [] };
  }

  const nowTime = Date.now();
  if (cachedFeed && nowTime - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedFeed;
  }

  const scrapedAnnouncements: Announcement[] = [];
  const scrapedEvents: CampusEvent[] = [];

  const channelResults = await Promise.allSettled(
    MONITORED_CHANNELS.map(async (channel) => {
      try {
        const res = await fetch(`https://t.me/s/${channel.handle}`, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(5000), // 5-second timeout safeguard
        });

        console.log(`Checking channel: @${channel.handle} - Status: ${res.status}`);

        if (!res.ok) return [];

        const html = await res.text();
        const messageRegex =
          /<div class="tgme_widget_message\b[^"]*"[^>]*data-post="([^"]+)"[\s\S]*?(?=<div class="tgme_widget_message\b|<div class="tme_messages_more|<\/body>|$)/g;

        const matches = [...html.matchAll(messageRegex)];
        if (!matches.length) return [];

        // Scan latest 5 messages
        const lastFive = matches.slice(-5);
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

        for (const match of lastFive) {
          const block = match[0];
          const dataPost = match[1];
          const postId = dataPost.includes("/") ? dataPost.split("/")[1] : dataPost;

          const timeMatch = block.match(/<time[^>]*datetime="([^"]+)"/);
          if (!timeMatch) continue;
          const timeStr = timeMatch[1];
          const postDate = new Date(timeStr);

          if (isNaN(postDate.getTime()) || nowTime - postDate.getTime() > SEVEN_DAYS_MS) {
            continue;
          }

          const textMatch = block.match(
            /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/
          );
          if (!textMatch) continue;

          const rawText = cleanHtmlText(textMatch[1]);
          if (rawText.length < 40) continue;

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
          const hasOfficialKeyword = OFFICIAL_KEYWORD_REGEX.test(rawText);

          if (!isInstantApproval && !hasOfficialKeyword) {
            continue;
          }

          const photoMatch = block.match(/background-image:url\('([^']+)'\)/);
          const photoUrl = photoMatch ? photoMatch[1] : null;
          const formattedDate = timeStr.includes("T")
            ? timeStr.split("T")[0]
            : timeStr || new Date().toISOString().split("T")[0];

          // Clean the text (strip hashtags)
          const cleanDisplayContent = rawText.replace(/#\w+/g, "").trim() || rawText;
          const lines = cleanDisplayContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
          const directTgUrl = `https://t.me/${channel.handle}/${postId}`;
          const appLink = extractApplicationLink(textMatch[1]) || extractApplicationLink(rawText);

          // Line 1 → Title. Remaining lines → Summary.
          let title = (lines[0] || `${channel.source} Notice`).slice(0, 90);
          let summary = (lines.slice(1).join(" ") || lines[0] || "").slice(0, 200);

          // Route:
          // If isEventTag → Set contentType: "EVENT". Otherwise → Set contentType: "ANNOUNCEMENT".
          let contentType: "EVENT" | "ANNOUNCEMENT" = isEventTag ? "EVENT" : "ANNOUNCEMENT";

          // If isRecruitmentTag → Set category to "Opportunity & Recruitment"
          let assignedCategory = isRecruitmentTag
            ? "Opportunity & Recruitment"
            : channel.category || "Announcements";

          let isUrgent =
            lowerText.includes("urgent") ||
            lowerText.includes("deadline") ||
            lowerText.includes("emergency");

          let eventDate = formattedDate;
          let eventTime = "TBD";
          let eventVenue = "ECUSTA Campus";

          if (isInstantApproval) {
            // INSTANT APPROVAL (Zero AI Delay): APPROVE IMMEDIATELY WITHOUT CALLING SILICONFLOW!
            console.log(
              `🎯 Instant Tag-First approval (Zero AI delay) for @${channel.handle}! ` +
              `[event=${isEventTag}, announcement=${isAnnouncementTag}, recruitment=${isRecruitmentTag}]`
            );
          } else {
            // Official keyword post without tag: evaluate routing via SiliconFlow AI
            console.log(`🔍 Evaluating content routing for @${channel.handle} via SiliconFlow AI...`);
            const evaluation = await evaluateTelegramPost(rawText);

            if (evaluation && evaluation.isWorthy) {
              contentType = evaluation.contentType === "EVENT" ? "EVENT" : "ANNOUNCEMENT";
              if (evaluation.title) title = evaluation.title.slice(0, 90);
              if (evaluation.summary) summary = evaluation.summary.slice(0, 200);
              if (evaluation.category) assignedCategory = evaluation.category;
              if (typeof evaluation.isUrgent === "boolean") isUrgent = evaluation.isUrgent;

              if (evaluation.eventDate) eventDate = evaluation.eventDate;
              if (evaluation.eventTime) eventTime = evaluation.eventTime;
              if (evaluation.eventVenue) eventVenue = evaluation.eventVenue;
            } else {
              // Not worthy
              continue;
            }
          }

          // Route to Events vs Announcements
          if (contentType === "EVENT") {
            scrapedEvents.push({
              id: `${channel.handle}-${postId}`,
              title,
              category: mapEventCategory(assignedCategory),
              date: eventDate,
              time: eventTime,
              venue: eventVenue,
              organizer: channel.source,
              speakers: [],
              coverImage: photoUrl || "/images/hero-bg.jpg",
              gallery: photoUrl ? [photoUrl] : [],
              summary,
              description: cleanDisplayContent,
            });
          } else {
            scrapedAnnouncements.push({
              id: `${channel.handle}-${postId}`,
              title,
              summary,
              category: assignedCategory,
              organizer: channel.source,
              date: formattedDate,
              content: cleanDisplayContent,
              image: photoUrl,
              isUrgent,
              source: channel.source,
              telegramPostUrl: directTgUrl,
              actionUrl: appLink || directTgUrl,
              actionLabel: appLink ? "Apply / Register Now ↗" : "View on Telegram ↗",
              pinned: false,
            });
          }
        }
      } catch (err) {
        console.warn(`[Telegram Feed] Error scraping ${channel.handle}:`, err);
      }
    })
  );

  await Promise.allSettled(channelResults);

  cachedFeed = {
    announcements: scrapedAnnouncements,
    events: scrapedEvents,
  };
  lastFetchTimestamp = nowTime;

  return cachedFeed;
}
