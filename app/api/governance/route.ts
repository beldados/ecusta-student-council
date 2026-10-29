import { NextResponse } from "next/server";
import governanceRaw from "@/data/governance.json";
import { GovernanceDocument } from "@/types/governance";

export async function GET() {
  try {
    const documents = (governanceRaw as GovernanceDocument[]) || [];

    return NextResponse.json({
      success: true,
      total: documents.length,
      documents,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/governance:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load governance documents" },
      { status: 500 }
    );
  }
}
