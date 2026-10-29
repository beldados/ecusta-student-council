export interface InitiativeSocials {
  telegram?: string | null;
  instagram?: string | null;
}

export interface InitiativePillar {
  number: string;
  title: string;
  description: string;
}

export interface InitiativeCommand {
  command: string;
  description: string;
}

export interface InitiativeVision {
  motto: string;
  statement: string;
}

export interface Initiative {
  id: string;
  title: string;
  category: string;
  status?: string;
  stats?: string;
  image?: string;
  tagline?: string;
  summary?: string;
  description?: string;
  lead?: string;
  architect?: string;
  actionUrl?: string;
  actionLabel?: string;
  channelUrl?: string;
  socials?: InitiativeSocials;
  quote?: string;
  story?: string[];
  pillars?: InitiativePillar[];
  vision?: InitiativeVision;
  commands?: InitiativeCommand[];
  href?: string;
}
