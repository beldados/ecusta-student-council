export interface Announcement {
  id: string;               // e.g. "midterm-schedule-update"
  title: string;
  category: string;         // e.g. "Academic", "Clinical", "Campus Life", "Governance"
  organizer: string;        // e.g. "Council Secretariat", "VP of Academics"
  date: string;             // ISO: "YYYY-MM-DD"
  summary: string;          // 1-2 sentence preview
  content: string;          // Full official text
  image?: string | null;    // Optional flyer path
  pinned?: boolean;         // Pinned to top
  actionUrl?: string | null;
  actionLabel?: string | null;
  isUrgent?: boolean;
  source?: string;
  telegramPostUrl?: string;
}
