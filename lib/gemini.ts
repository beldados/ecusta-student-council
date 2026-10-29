export interface GeminiEvaluation {
  isWorthy: boolean;
  title?: string;
  summary?: string;
  category?: string;
  isUrgent?: boolean;
}

export async function evaluateTelegramPost(rawText: string): Promise<GeminiEvaluation> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_key_here") return { isWorthy: false };

  const prompt = `
  You are the Chief Editorial Gatekeeper for the ECUSTA Medical Student Council.
  Analyze this Telegram message from campus channels:
  "${rawText}"

  1. Is this an official student announcement, academic deadline, clinical hospital update, or assembly notice worthy of the university portal?
  2. If NO (it's a meme, casual chat, forward, greeting, or sticker), return: {"isWorthy": false}
  3. If YES:
     - Generate a crisp, professional 6-8 word headline.
     - Write a clean 2-sentence factual summary (remove emojis and hashtags).
     - Assign a category: "Academic" | "Clinical" | "Campus Life" | "Governance".
     - Set isUrgent to true if it involves immediate deadlines, schedule changes, or hospital ward emergencies; otherwise false.

  Return pure JSON matching:
  {"isWorthy": boolean, "title": string, "summary": string, "category": string, "isUrgent": boolean}
  `;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    );

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return replyText ? JSON.parse(replyText) : { isWorthy: false };
  } catch (error) {
    console.error("Gemini evaluation error:", error);
    return { isWorthy: false };
  }
}
