import { NextRequest, NextResponse } from "next/server";
import initiativesDataRaw from "@/data/initiatives.json";
import { Initiative } from "@/types/initiative";

export async function GET(request: NextRequest) {
  try {
    const initiatives = initiativesDataRaw as Initiative[];
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");

    let filtered = initiatives;
    if (category && category.toLowerCase() !== "all" && category.toLowerCase() !== "all causes") {
      const lower = category.toLowerCase();
      filtered = filtered.filter((i) => i.category.toLowerCase().includes(lower));
    }

    return NextResponse.json(filtered);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/initiatives:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load initiatives" },
      { status: 500 }
    );
  }
}
