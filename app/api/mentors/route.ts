import { NextRequest, NextResponse } from "next/server";
import mentorshipData from "@/data/mentorship.json";
import { MentorshipData, Mentor } from "@/types/mentorship";

export async function GET(request: NextRequest) {
  try {
    const data = mentorshipData as MentorshipData;
    const { searchParams } = request.nextUrl;
    const target = searchParams.get("target");
    const batch = searchParams.get("batch");
    const status = searchParams.get("status");
    const cohort = searchParams.get("cohort") || searchParams.get("cohortId") || searchParams.get("generation");

    const allMentors: Mentor[] = Array.isArray(data.mentors) ? data.mentors : [];
    let filteredMentors: Mentor[] = allMentors;

    if (cohort) {
      const lowerCohort = cohort.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (m) => (m.cohortId || m.generation || "g1").toLowerCase() === lowerCohort
      );
    }

    if (target) {
      const lowerTarget = target.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (m) => m.menteeTarget && m.menteeTarget.toLowerCase().includes(lowerTarget)
      );
    }

    if (batch) {
      const cleanBatch = batch.toLowerCase().replace(/\s+/g, "");
      filteredMentors = filteredMentors.filter(
        (m) =>
          (m.batch && m.batch.toLowerCase().replace(/\s+/g, "") === cleanBatch) ||
          (m.mentorBatch && m.mentorBatch.toLowerCase().replace(/\s+/g, "") === cleanBatch)
      );
    }

    if (status) {
      const lowerStatus = status.toLowerCase();
      filteredMentors = filteredMentors.filter(
        (m) => m.status && m.status.toLowerCase() === lowerStatus
      );
    }

    const program = {
      title: data.title,
      stats: data.stats,
      currentCycle: data.currentCycle,
      description: data.description,
    };

    return NextResponse.json({
      success: true,
      program,
      cohorts: data.cohorts || [],
      mentors: filteredMentors,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("Error in /api/mentors:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load mentorship data",
      },
      { status: 500 }
    );
  }
}
