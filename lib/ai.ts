export interface AIEvaluation {
  isWorthy: boolean;
  contentType: "EVENT" | "ANNOUNCEMENT";
  title?: string;
  summary?: string;
  category?: string;
  isUrgent?: boolean;
  // Event specific fields (extracted if contentType === "EVENT"):
  eventDate?: string; // "YYYY-MM-DD"
  eventTime?: string; // e.g. "09:00 AM - 12:00 PM"
  eventVenue?: string; // e.g. "ECUSTA Study Hall"
}

function getFallbackAnnouncement(rawText: string): AIEvaluation {
  const clean = rawText.replace(/#\w+/g, "").trim();
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);
  const title = (lines[0] || "Campus Announcement").slice(0, 90);
  const summary = (lines.slice(1).join(" ") || lines[0] || "Official notice from campus channels.").slice(0, 200);

  const lower = rawText.toLowerCase();
  const isUrgent =
    lower.includes("urgent") ||
    lower.includes("deadline") ||
    lower.includes("emergency");

  return {
    isWorthy: true,
    contentType: "ANNOUNCEMENT",
    title,
    summary,
    category: lower.includes("recruit") || lower.includes("apply")
      ? "Opportunity & Recruitment"
      : "Campus Life",
    isUrgent,
  };
}

export async function evaluateTelegramPost(rawText: string): Promise<AIEvaluation> {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.siliconflow.cn/v1";
  const model = process.env.AI_MODEL || "Qwen/Qwen2.5-7B-Instruct";

  if (!apiKey || apiKey === "your_key_here") {
    // 401 / Missing Key Fail-Safe: Fallback to approving as standard announcement
    console.warn("AI_API_KEY missing or placeholder. Using 401 fail-safe fallback approval.");
    return getFallbackAnnouncement(rawText);
  }

  const prompt = `
  You are the Chief Editorial Gatekeeper for the ECUSTA Medical Student Council.
  Analyze this Telegram message from campus channels:
  "${rawText}"

  1. Is this an official student announcement, academic deadline, clinical hospital update, recruitment call, event, workshop, or assembly notice worthy of the official university portal?
  2. If NO (it's a meme, casual chat, greeting, or sticker), return: {"isWorthy": false, "contentType": "ANNOUNCEMENT"}
  3. If YES:
     - If the post announces a workshop, tournament, assembly, or campus happening with a specific date and venue, set contentType to "EVENT" and extract:
       * eventDate: "YYYY-MM-DD"
       * eventTime: e.g. "09:00 AM - 12:00 PM"
       * eventVenue: e.g. "ECUSTA Study Hall"
     - Otherwise, set contentType to "ANNOUNCEMENT".
     - Generate a crisp, professional 6-8 word headline in English.
     - Write a clean 2-sentence factual summary.
     - Assign category: "Academic" | "Clinical" | "Opportunity & Recruitment" | "Campus Life" | "Assembly" | "Social & Welfare".
     - Set isUrgent to true if it involves immediate deadlines or critical schedule changes; otherwise false.

  Return ONLY valid JSON matching:
  {"isWorthy": boolean, "contentType": "EVENT" | "ANNOUNCEMENT", "title": string, "summary": string, "category": string, "isUrgent": boolean, "eventDate"?: string, "eventTime"?: string, "eventVenue"?: string}
  `;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an official university communications evaluator. Always output pure valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      console.warn(
        `SiliconFlow API returned status ${res.status}. Triggering 401/Fail-Safe fallback bypass.`
      );
      // Fail-Safe: Do NOT drop the post! Approve as standard announcement
      return getFallbackAnnouncement(rawText);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return getFallbackAnnouncement(rawText);
    }

    // Clean any markdown code ticks if returned
    const jsonStr = content
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(jsonStr);
    return {
      contentType: parsed.contentType === "EVENT" ? "EVENT" : "ANNOUNCEMENT",
      ...parsed,
    };
  } catch (error) {
    console.warn("AI Evaluation network/timeout error. Triggering Fail-Safe fallback bypass:", error);
    // Fail-Safe: Do NOT drop the post! Approve as standard announcement
    return getFallbackAnnouncement(rawText);
  }
}
