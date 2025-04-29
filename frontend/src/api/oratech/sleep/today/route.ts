import { NextResponse } from "next/server";

export async function GET() {
  // For now: MOCK Sleep Data (until real OraTech API is ready)
  const mockSleepData = {
    date: new Date().toISOString().split("T")[0],
    sleepScore: Math.floor(Math.random() * (95 - 65 + 1)) + 65,
    startTime: "22:30",
    endTime: "06:15",
    durationMinutes: 465,
    stages: {
      light: 240,
      deep: 150,
      rem: 75,
    },
    disturbances: 1,
    insights: ["Good recovery night.", "Keep consistent bedtime."]
  };

  return NextResponse.json(mockSleepData);
}
