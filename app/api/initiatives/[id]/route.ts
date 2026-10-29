import { NextRequest, NextResponse } from "next/server";
import initiativesDataRaw from "@/data/initiatives.json";
import { Initiative } from "@/types/initiative";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const initiatives = initiativesDataRaw as Initiative[];
    const initiative = initiatives.find(
      (i) => i.id.toLowerCase() === id.toLowerCase()
    );

    if (!initiative) {
      return NextResponse.json(
        { error: "Initiative not found" },
        { status: 404 }
      );
    }

    let socialStats = null;
    if (initiative.id === "ecusta-atlas") {
      socialStats = {
        telegram: { count: "64", label: "Subscribers" },
        instagram: { count: "500+", label: "Community" },
      };
    }

    return NextResponse.json({
      ...initiative,
      socialStats,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/initiatives/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch initiative" },
      { status: 500 }
    );
  }
}
