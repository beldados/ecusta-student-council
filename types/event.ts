export interface CampusEvent {
  id: string;
  title: string;
  category: "Academic" | "Assembly" | "Clinical" | "Social & Welfare";
  date: string; // ISO date string YYYY-MM-DD
  time: string;
  venue: string;
  organizer: string;
  speakers: string[];
  coverImage: string;
  gallery: string[];
  summary: string;
  description: string;
}
