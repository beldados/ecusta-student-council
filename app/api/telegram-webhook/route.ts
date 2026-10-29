import { NextRequest, NextResponse } from "next/server";

/**
 * Helper to dispatch replies to Telegram users with Markdown parsing
 */
async function reply(
  chatId: string | number,
  text: string,
  replyMarkup?: object
) {
  const token = process.env.ENQUIRY_BOT_TOKEN;
  if (!token) {
    console.warn("[Telegram Webhook] ENQUIRY_BOT_TOKEN is not defined.");
    return;
  }

  const payload: Record<string, unknown> = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    disable_web_page_preview: true,
    link_preview_options: { is_disabled: true },
  };

  if (replyMarkup) {
    payload.reply_markup = replyMarkup;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // Fallback to plain text if special characters break Markdown parsing
    if (!res.ok && data?.description?.includes("can't parse entities")) {
      delete payload.parse_mode;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  } catch (error) {
    console.error("[Telegram Webhook] Error sending reply:", error);
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    bot: "@EcustaEnquiryBot",
    service: "ECUSTA Student Council Confidential Inquiry Webhook",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message || !message.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    // 1. /start
    if (text.startsWith("/start")) {
      const startText = [
        "👋 *Welcome to the ECUSTA Student Council Confidential Inquiry Desk* 🩺",
        "",
        "This official bot is maintained by the Council Secretariat to receive student inquiries, hospital ward concerns, and academic petitions.",
        "",
        "🔐 *Confidentiality:* Submissions can be filed anonymously with zero identity tracking.",
        "",
        "👉 Tap the button below to open our official inquiry portal:",
      ].join("\n");

      await reply(chatId, startText, {
        inline_keyboard: [
          [
            {
              text: "📝 Submit Council Inquiry",
              url: "https://ecusta-student-council.vercel.app/contact",
            },
          ],
        ],
      });
      return NextResponse.json({ ok: true });
    }

    // 2. /inquire
    if (text.startsWith("/inquire")) {
      const inquireText = [
        "📝 *How to Submit an Inquiry or Petition:*",
        "",
        "1. Visit our verified web portal: https://ecusta-student-council.vercel.app/contact",
        "2. Select your category (Academic, Hospital Attachments, Facilities, General).",
        "3. Toggle *Anonymous* if you wish to keep your identity private.",
        "4. Submit! Your petition lands directly on the Council Secretariat desk for executive assembly review.",
      ].join("\n");

      await reply(chatId, inquireText, {
        inline_keyboard: [
          [
            {
              text: "📝 Submit Council Inquiry",
              url: "https://ecusta-student-council.vercel.app/contact",
            },
          ],
        ],
      });
      return NextResponse.json({ ok: true });
    }

    // 3. /confidentiality
    if (text.startsWith("/confidentiality")) {
      const confidentialityText = [
        "🛡️ *Council Non-Retaliation & Confidentiality Policy*",
        "",
        "• All inquiries are reviewed exclusively by authorized executive officers.",
        "• Anonymous submissions do not collect name, student ID, or personal identifiers.",
        "• The council operates under strict student protection bylaws.",
      ].join("\n");

      await reply(chatId, confidentialityText);
      return NextResponse.json({ ok: true });
    }

    // 4. /contact
    if (text.startsWith("/contact")) {
      const contactText = [
        "📍 *Council Secretariat Office:* ECUSTA Main Campus, Student Center Building, Office 204",
        "🕒 *Executive Office Hours:* Monday – Friday • 10:00 AM – 04:00 PM",
        "📧 *Official Email:* secretariat.sc@ecusta.edu.et",
      ].join("\n");

      await reply(chatId, contactText);
      return NextResponse.json({ ok: true });
    }

    // 5. /help
    if (text.startsWith("/help")) {
      const helpText = [
        "📋 *ECUSTA Enquiry Bot Commands:*",
        "",
        "/start - Welcome & Portal Gateway",
        "/inquire - Step-by-step submission guide",
        "/confidentiality - Non-retaliation & anonymity policies",
        "/contact - Secretariat office location, hours & email",
        "",
        "👉 Portal: https://ecusta-student-council.vercel.app/contact",
      ].join("\n");

      await reply(chatId, helpText, {
        inline_keyboard: [
          [
            {
              text: "📝 Submit Council Inquiry",
              url: "https://ecusta-student-council.vercel.app/contact",
            },
          ],
        ],
      });
      return NextResponse.json({ ok: true });
    }

    // 6. Default (Any other text)
    const defaultText =
      "To submit an official inquiry or petition, please use our secure portal: https://ecusta-student-council.vercel.app/contact or type /help for commands.";

    await reply(chatId, defaultText, {
      inline_keyboard: [
        [
          {
            text: "📝 Submit Council Inquiry",
            url: "https://ecusta-student-council.vercel.app/contact",
          },
        ],
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Telegram Webhook] Error processing update:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to process Telegram webhook update" },
      { status: 500 }
    );
  }
}
