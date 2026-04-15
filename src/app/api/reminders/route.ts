import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
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
  footageDeadline: string;
  reminderSentAt?: string;
};

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const bookingsFilePath = path.join(process.cwd(), "bookings.json");

async function readBookings(): Promise<Booking[]> {
  try {
    const data = await fs.readFile(bookingsFilePath, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeBookings(bookings: Booking[]) {
  await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), "utf8");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDisplayDate(dateInput: string): string {
  const date = new Date(dateInput);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

async function sendFootageReminderEmail(booking: Booking) {
  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Skipping reminder email.");
    return;
  }

  const from = process.env.BOOKING_FROM_EMAIL;
  if (!from) {
    console.warn("BOOKING_FROM_EMAIL is missing. Skipping reminder email.");
    return;
  }

  const guideLink = process.env.FILMING_GUIDE_URL || "YOUR_GUIDE_LINK_HERE";
  const formattedSlot = formatDisplayDate(booking.slot);

  const result = await resend.emails.send({
    from,
    to: [booking.email],
    subject: "Reminder: send your gameplay footage",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hi ${escapeHtml(booking.name)},</p>

        <p>
          Quick reminder to send your gameplay footage for your session on
          <strong>${escapeHtml(formattedSlot)}</strong>.
        </p>

        <p>
          If you’d like me to review it ahead of time and come prepared with specific feedback,
          please send <strong>1 full game</strong> by replying to this email with your YouTube link.
        </p>

        <p>
          Need help filming?<br />
          <a href="${escapeHtml(guideLink)}">Filming Guide</a>
        </p>

        <p style="margin-top: 24px;">
          Coach AJ<br />
          The Pickleball Helpline
        </p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.REMINDER_SECRET || secret !== process.env.REMINDER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bookings = await readBookings();
    const now = Date.now();

    const reminderWindowStart = now + 47 * 60 * 60 * 1000;
    const reminderWindowEnd = now + 49 * 60 * 60 * 1000;

    let sentCount = 0;

    for (const booking of bookings) {
      const slotTime = new Date(booking.slot).getTime();
      const hasFootage = Boolean(booking.footageLink && booking.footageLink.trim());
      const alreadySent = Boolean(booking.reminderSentAt);

      const shouldSend =
        slotTime >= reminderWindowStart &&
        slotTime <= reminderWindowEnd &&
        !hasFootage &&
        !alreadySent;

      if (!shouldSend) continue;

      await sendFootageReminderEmail(booking);
      booking.reminderSentAt = new Date().toISOString();
      sentCount += 1;
    }

    await writeBookings(bookings);

    return NextResponse.json({
      ok: true,
      sentCount,
    });
  } catch (error) {
    console.error("Reminder run failed:", error);
    return NextResponse.json(
      { error: "Reminder run failed" },
      { status: 500 }
    );
  }
}