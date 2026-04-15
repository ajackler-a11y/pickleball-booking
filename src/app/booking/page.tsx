"use client";

import { useEffect, useState } from "react";

type BookingRecord = {
  id: string;
  name: string;
  email: string;
  slot: string;
  footageLink?: string;
  stripeSessionId: string;
  createdAt: string;
  footageDeadline?: string;
};

type TimeSlot = {
  value: string;
};

function formatDateHeading(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getNextOccurrences(dayOfWeek: number, count: number) {
  const now = new Date();
  const dates: Date[] = [];

  const first = new Date(now);
  const currentDay = first.getDay();
  let diff = dayOfWeek - currentDay;

  if (diff <= 0) {
    diff += 7;
  }

  first.setDate(first.getDate() + diff);
  first.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const nextDate = new Date(first);
    nextDate.setDate(first.getDate() + i * 7);
    dates.push(nextDate);
  }

  return dates;
}

function buildSlot(date: Date, hour: number) {
  const d = new Date(date);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export default function BookingPage() {
  const fridays = getNextOccurrences(5, 2);
  const sundays = getNextOccurrences(0, 2);

  const rawTimeSlots: TimeSlot[] = [
    ...fridays.flatMap((date) => [
      { value: buildSlot(date, 9) },
      { value: buildSlot(date, 10) },
    ]),
    ...sundays.flatMap((date) => [
      { value: buildSlot(date, 9) },
      { value: buildSlot(date, 10) },
      { value: buildSlot(date, 11) },
    ]),
  ];

  const now = new Date();
  const minBookableTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const timeSlots = rawTimeSlots.filter((slot) => {
    return new Date(slot.value) >= minBookableTime;
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [footageLink, setFootageLink] = useState("");
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadBookedSlots() {
      try {
        const res = await fetch("/api/bookings");
        const rawText = await res.text();
        const data = rawText ? JSON.parse(rawText) : [];

        const slots: string[] = Array.isArray(data)
          ? data.map((b: BookingRecord) => b.slot)
          : [];

        setBookedSlots(slots);
      } catch {
        setBookedSlots([]);
      }
    }

    loadBookedSlots();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");

    if (!selectedSlot || !name || !email) {
      setError("Please select a time and fill out your name and email.");
      return;
    }

    if (bookedSlots.includes(selectedSlot)) {
      setError("That time slot is no longer available.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slot: selectedSlot,
          name,
          email,
          footageLink,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        window.location.href = data.url;
      }, 300);
    } catch {
      setError("Failed to start checkout.");
      setIsSubmitting(false);
    }
  }

  const groupedSlots = timeSlots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const dayKey = new Date(slot.value).toDateString();
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(slot);
    return acc;
  }, {});

  const sortedGroupedSlots = Object.entries(groupedSlots).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "8px" }}>
       Book a Remote Coaching Session
      </h1>

      <p style={{ marginBottom: "16px", marginTop: "0px", fontSize: "14px", color: "#4b5563" }}>
        Sessions are booked at least 48 hours in advance so there’s time to review your footage.
      </p>

      <div style={{ marginTop: "20px", marginBottom: "30px" }}>
        {sortedGroupedSlots.length === 0 ? (
          <p>No available sessions in the next two weeks. New times open up regularly.</p>
        ) : (
          sortedGroupedSlots.map(([dayKey, slots]) => (
            <div key={dayKey} style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", marginBottom: "12px", fontWeight: 700 }}>
                {formatDateHeading(slots[0].value)}
              </h2>

              {slots.map((slot) => {
                const isBooked = bookedSlots.includes(slot.value);

                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => {
                      if (isBooked || isSubmitting) return;
                      setSelectedSlot(slot.value);
                      setError("");
                    }}
                    disabled={isBooked || isSubmitting}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      textAlign: "left",
                      marginBottom: "10px",
                      padding: "12px 20px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      cursor: isBooked || isSubmitting ? "not-allowed" : "pointer",
                      border: isBooked
                        ? "1px solid #d1d5db"
                        : selectedSlot === slot.value
                        ? "2px solid #2A7A6F"
                        : "1px solid #ccc",
                      background: isBooked
                        ? "#f3f4f6"
                        : selectedSlot === slot.value
                        ? "#E7F3F1"
                        : "white",
                      color: isBooked ? "#9ca3af" : "#111827",
                      fontWeight: selectedSlot === slot.value ? "700" : "400",
                      textDecoration: "none",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    <span
                    style={{
                     textDecoration: isBooked ? "line-through" : "none",
                     }}
                    >
                     {formatTime(slot.value)}
                    </span>

                    {isBooked && <span style={{ fontSize: "13px", opacity: 0.7 }}>Booked</span>}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {error && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "#fdecea",
            color: "#b71c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            disabled={isSubmitting}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "4px" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Footage Link (optional)</label>
          <input
            type="url"
            value={footageLink}
            disabled={isSubmitting}
            onChange={(e) => setFootageLink(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "4px" }}
          />
        </div>

        <button
          type="submit"
          disabled={!selectedSlot || isSubmitting}
          style={{
            padding: "12px 20px",
            fontWeight: "700",
            borderRadius: "8px",
            border: "none",
            background: isSubmitting ? "#9ca3af" : "#2A7A6F",
            color: "white",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {isSubmitting ? "Redirecting..." : "Book My Session"}
        </button>
      </form>
    </main>
  );
}