export interface GovernanceDocument {
  id: string;
  title: string;
  subtitle: string;
  category: "Constitution" | "Handbook" | "Charter" | "Regulation" | string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  version: string;
  effectiveDate: string;
  ratifiedBy: string;
}
