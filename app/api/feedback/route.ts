import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Feedback Request Body:", body);

    // Accept any variation of the message field
    const rawMessage = body.message || body.inquiry || body.petition || body.feedback || "";
    const category = body.category || "General";
    const fullName = body.fullName || body.name || "";
    const batch = body.batch || "";
    const isAnonymous = Boolean(body.isAnonymous);

    if (!rawMessage || String(rawMessage).trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please enter a message before submitting." },
        { status: 400 }
      );
    }

    // Use env vars or verified hardcoded fallbacks
    const botToken = process.env.ENQUIRY_BOT_TOKEN || "9003171475:AAFNQ6wP2BKfq2scP-tsPNouG8WRX2aztLE";
    const chatId = process.env.SECRETARIAT_CHAT_ID || "-1004339772011";

    const submitter = isAnonymous
      ? `Anonymous Student (${batch || "Batch Unspecified"})`
      : `${fullName || "Student"} (${batch || "Batch Unspecified"})`;

    const safeText = String(rawMessage)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const htmlMessage = `
<b>[NEW COUNCIL INQUIRY] (Via Website)</b>
───────────────────────────────
<b>Category:</b> ${category}
<b>Submitter:</b> ${submitter}
<b>Date:</b> ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}

<b>Message:</b>
${safeText}
───────────────────────────────
<i>Routed to Council Secretariat Desk</i>
    `.trim();

    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: "HTML",
      }),
    });

    const tgData = await tgRes.json();
    console.log("Telegram API result:", tgData);

    if (!tgRes.ok || !tgData.ok) {
      return NextResponse.json(
        { success: false, error: tgData.description || "Telegram delivery failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully delivered to the Council Secretariat.",
    });
  } catch (error) {
    console.error("Critical Feedback API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
