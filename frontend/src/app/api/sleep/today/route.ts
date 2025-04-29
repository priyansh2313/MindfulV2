import { getSleepDataFromOraTech } from "@/services/oratechService";
import { NextResponse } from "next/server";

export async function GET() {
  const sleepData = await getSleepDataFromOraTech();
  return NextResponse.json(sleepData);
}
