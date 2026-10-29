export interface SocialLinks {
  telegram?: string | null;
  instagram?: string | null;
}

export interface StandingCommittee {
  id: string;
  name: string;
  acronym: string;
  logo: string;
  leadTitle: string;
  mandate: string;
  socials?: SocialLinks;
  gallery?: string[];
}

export interface StudentOrganization {
  id: string;
  name: string;
  acronym: string;
  type: "Medical Association" | "Humanitarian" | "Tech & Innovation" | "Student Society";
  logo: string;
  leadTitle: string;
  description: string;
  socials?: SocialLinks;
  gallery?: string[];
  committees?: StandingCommittee[];
}
