import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

type Booking = {
  id: string;
  name: string;
  email: string;
  slot: string;
  footageLink?: string;
  stripeSessionId: string;
  createdAt: string;
};

const filePath = path.join(process.cwd(), "bookings.json");

export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf8");

    if (!file.trim()) {
      return NextResponse.json([]);
    }

    const bookings = JSON.parse(file) as Booking[];

    return NextResponse.json(bookings);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json([]);
    }

    console.error("Bookings GET error:", error);

    return NextResponse.json(
      { error: "Failed to load bookings." },
      { status: 500 }
    );
  }
}