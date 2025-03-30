
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // Ensure correct path to your Prisma client



const prisma = new PrismaClient();
export async function GET() {
  try {
    const seats = await prisma.seat.findMany();
    return NextResponse.json(seats, { status: 200 });
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export const dynamic = 'force-dynamic'
