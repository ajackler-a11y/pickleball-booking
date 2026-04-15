import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import fs from "fs/promises";
import path from "path";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in .env.local");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

async function sendBookingConfirmationEmail(booking: Booking) {
  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Skipping confirmation email.");
    return;
  }

  const from = process.env.BOOKING_FROM_EMAIL;

  if (!from) {
    console.warn("BOOKING_FROM_EMAIL is missing. Skipping confirmation email.");
    return;
  }

  const guideLink = process.env.FILMING_GUIDE_URL || "YOUR_GUIDE_LINK_HERE";
  const formattedSlot = formatDisplayDate(booking.slot);
  const formattedDeadline = formatDisplayDate(booking.footageDeadline);

  const result = await resend.emails.send({
    from,
    to: [booking.email],
    subject: "Your remote coaching session is booked",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="margin-bottom: 16px;">You’re booked 🎉</h1>

        <p>Hi ${escapeHtml(booking.name)},</p>

        <p>Your coaching session is confirmed for <strong>${escapeHtml(formattedSlot)}</strong>.</p>

        <p>
          Before we meet, please send <strong>1 full game of gameplay footage</strong> by
          <strong>${escapeHtml(formattedDeadline)}</strong> so I can review it ahead of time
          and come prepared with specific feedback.
        </p>

        <p><strong>To send it:</strong></p>
        <ol style="padding-left: 20px; margin-top: 8px; margin-bottom: 16px;">
          <li>Film one full game</li>
          <li>Upload it to YouTube</li>
          <li>Set it to <strong>Unlisted</strong></li>
          <li>Reply to this email with the link</li>
        </ol>

        <p>
          Need help filming?:<br />
          <a href="${escapeHtml(guideLink)}">Filming Guide</a>
        </p>

        <p style="margin-top: 24px;">
          Looking forward to it,<br />
          Coach AJ
        </p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature");
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Webhook received:", event.type);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const name = session.metadata?.name;
      const email = session.metadata?.email;
      const slot = session.metadata?.slot;
      const footageLink = session.metadata?.footageLink || "";

      if (!name || !email || !slot) {
        console.error("Missing booking metadata in Stripe session");
        return NextResponse.json(
          { error: "Missing booking metadata" },
          { status: 400 }
        );
      }

      const sessionStart = new Date(slot);

      if (Number.isNaN(sessionStart.getTime())) {
        console.error("Invalid slot date:", slot);
        return NextResponse.json(
          { error: "Invalid slot date" },
          { status: 400 }
        );
      }

      const footageDeadline = new Date(
        sessionStart.getTime() - 48 * 60 * 60 * 1000
      );

      const newBooking: Booking = {
  id: crypto.randomUUID(),
  name,
  email,
  slot,
  footageLink,
  stripeSessionId: session.id,
  createdAt: new Date().toISOString(),
  footageDeadline: footageDeadline.toISOString(),
};

try {
  const bookings = await readBookings();

  const alreadyExists = bookings.some(
    (booking) => booking.stripeSessionId === session.id
  );

  if (alreadyExists) {
    console.log("Booking already exists for session:", session.id);
    return NextResponse.json({ received: true });
  }

  bookings.push(newBooking);
  await writeBookings(bookings);
  console.log("Booking saved:", newBooking);
} catch (saveError) {
  console.error("Booking save failed:", saveError);
}

try {
  await sendBookingConfirmationEmail(newBooking);
  console.log("Confirmation email sent to:", newBooking.email);
} catch (emailError) {
  console.error("Confirmation email failed:", emailError);
}

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}