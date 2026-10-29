export interface MentorAvailability {
  startTime: string;
  endTime: string;
  frequency: string;
}

export interface Cohort {
  id: string;
  name: string;
  cycle: string;
  mentorBatch: string;
  menteeTarget: string;
  status: "Active" | "Recruiting" | "Archived";
  summary: string;
}

export interface Mentor {
  id: string;
  name: string;
  batch: string; // e.g. "PC 1", "PC 2"
  menteeTarget: string; // e.g. "ITM Students"
  image: string; // "/images/mentors/name.jpg"
  quote: string;
  availability: MentorAvailability;
  status: "Active" | "Alumni" | "On Leave" | string;
  cohortId?: string; // e.g. "G1", "G2"
  generation?: string; // e.g. "G1", "G2"
  telegram?: string;
  email?: string;
  specialties?: string[];
  mentorBatch?: string; // backwards compatibility alias
  availableTime?: string; // backwards compatibility alias
}

export interface MentorshipData {
  title: string;
  stats: string;
  currentCycle: string;
  description: string;
  cohorts?: Cohort[];
  mentors: Mentor[];
}
