export type CouncilPosition =
  | "President"
  | "Executive Vice President"
  | "Executive Secretary"
  | "VP of Academics"
  | "VP of International Students"
  | "VP of Dormitory & Welfare"
  | "VP of Social Media"
  | "VP of Graphics & Design"
  | "VP of Events & Graphic Design"
  | "VP of Information Systems"
  | "VP of PR and Communication"
  | "Lead Developer"
  | "Devs Team Member"
  | "Medicine Department Representative"
  | "C-II Batch Representative"
  | "Intern Representative";

export interface CouncilMember {
  id: string;
  name: string;
  role: CouncilPosition | string;
  category?: string;
  department: string;
  batch: string;
  image: string;
  bio: string;
  quote?: {
    text: string;
    reference: string;
  };
  leadership?: Array<{
    title: string;
    organization: string;
    period?: string;
  }>;
  email: string | null;
  telegram: string | null;
  linkedin?: string | null;
  isPublished?: boolean;
}
