import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  const history: { date: string; sleepScore: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const formattedDate = day.toISOString().split("T")[0];

    history.push({
      date: formattedDate,
      sleepScore: Math.floor(Math.random() * (95 - 60 + 1)) + 60, // Random between 60-95
    });
  }

  return NextResponse.json(history);
}
