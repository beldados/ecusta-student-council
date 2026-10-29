import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let telegramCount = "100+";
  let telegramLabel = "Members";

  let instagramCount = "500+";
  let instagramLabel = "Community";

  // 1. Fetch Telegram public preview
  try {
    const res = await fetch("https://t.me/EcustaAtlas", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/<div class="tgme_page_extra">([^<]+)<\/div>/);
      if (match && match[1]) {
        const text = match[1].trim();
        // Extract number, e.g. "64 subscribers" -> "64", "1 250 members" -> "1.2K"
        const cleanNumber = text.replace(/[^0-9]/g, "");
        if (cleanNumber) {
          const num = parseInt(cleanNumber, 10);
          if (num >= 1000) {
            telegramCount = `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
          } else {
            telegramCount = `${num}`;
          }
        }
        if (/subscriber/i.test(text)) {
          telegramLabel = "Subscribers";
        } else {
          telegramLabel = "Members";
        }
      }
    }
  } catch (error) {
    console.warn("Telegram scrape fallback used:", error instanceof Error ? error.message : error);
  }

  // 2. Fetch Instagram with graceful fallback
  try {
    const res = await fetch("https://www.instagram.com/ecusta.atlas/", {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const html = await res.text();
      const ogMatch =
        html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
        html.match(/<meta\s+content="([^"]+)"\s+property="og:description"/i);

      if (ogMatch && ogMatch[1]) {
        const content = ogMatch[1];
        const followerMatch = content.match(/([\d,kK.+-]+)\s*Followers/i);
        if (followerMatch && followerMatch[1]) {
          instagramCount = followerMatch[1].trim();
          instagramLabel = "Followers";
        }
      }
    }
  } catch (error) {
    console.warn("Instagram scrape fallback used:", error instanceof Error ? error.message : error);
  }

  return NextResponse.json(
    {
      success: true,
      telegram: {
        count: telegramCount,
        label: telegramLabel,
      },
      instagram: {
        count: instagramCount,
        label: instagramLabel,
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
