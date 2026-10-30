import type { Metadata } from "next";
import InitiativesGrid from "@/components/initiatives/InitiativesGrid";

export const metadata: Metadata = {
  title: "Council Initiatives",
  description: "Official initiatives and programmes of the ECUSTA Student Council.",
};

export default function InitiativesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
      <InitiativesGrid />
    </div>
  );
}
