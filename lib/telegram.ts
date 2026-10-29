export interface SecretariatAlertPayload {
  category: string;
  submitter: string;
  message: string;
  source: "Website" | "Telegram";
}

/**
 * Sends a Telegram message via the Bot API
 */
export async function sendMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: object
) {
  const token = process.env.ENQUIRY_BOT_TOKEN;
  if (!token) {
    console.warn("[Telegram Dispatcher] ENQUIRY_BOT_TOKEN is not defined.");
    return { ok: false, description: "ENQUIRY_BOT_TOKEN not configured" };
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // If markdown parsing failed due to unexpected characters, fallback to plain text
    if (!res.ok && data?.description?.includes("can't parse entities")) {
      delete payload.parse_mode;
      const retryRes = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      return await retryRes.json();
    }

    return data;
  } catch (error) {
    console.error("[Telegram Dispatcher] Error sending message:", error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Acknowledges an incoming Telegram callback query
 */
export async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const token = process.env.ENQUIRY_BOT_TOKEN;
  if (!token) return { ok: false };

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
        }),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("[Telegram Dispatcher] Error answering callback query:", error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Formats an inquiry alert and sends it to the Private Council Secretariat Group
 */
export async function sendSecretariatAlert(payload: SecretariatAlertPayload) {
  const secretariatChatId = process.env.SECRETARIAT_CHAT_ID || "-1004339772011";

  const alertText = [
    `🚨 *New Council Secretariat Inquiry*`,
    ``,
    `📍 *Source:* ${payload.source}`,
    `📂 *Category:* ${payload.category}`,
    `👤 *Submitter:* ${payload.submitter}`,
    ``,
    `💬 *Message:*`,
    payload.message,
  ].join("\n");

  return await sendMessage(secretariatChatId, alertText);
}
