import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {authOptions} from "../../../api/auth/[...nextauth]/route"; 
import { PrismaClient } from "@prisma/client"; 

const prisma = new PrismaClient();
export async function POST(req) {
  try {
  
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { seatIds } = await req.json();
    if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json({ error: "Invalid seat selection" }, { status: 400 });
    }

    
    const seats = await prisma.seat.findMany({
      where: { id: { in: seatIds }, isBooked: false },
    });

    if (seats.length !== seatIds.length) {
      return NextResponse.json({ error: "Some seats are already booked" }, { status: 400 });
    }

    console.log(session.user.id )

    await prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: { isBooked: true,   userId: session.user.id  },
    });

    return NextResponse.json({ message: "Seats booked successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic'
