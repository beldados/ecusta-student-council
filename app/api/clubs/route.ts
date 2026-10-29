import { NextResponse } from "next/server";
import clubsRaw from "@/data/clubs.json";
import { StudentOrganization } from "@/types/organization";

export async function GET() {
  try {
    const organizations = (Array.isArray(clubsRaw) ? clubsRaw : []) as StudentOrganization[];

    return NextResponse.json({
      success: true,
      count: organizations.length,
      organizations,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/clubs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load student organizations" },
      { status: 500 }
    );
  }
}
