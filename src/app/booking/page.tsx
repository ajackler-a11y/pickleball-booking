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
  if (diff <= 0) diff += 7;
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
  const timeSlots = rawTimeSlots.filter((slot) => new Date(slot.value) >= minBookableTime);
 
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
        const slots: string[] = Array.isArray(data) ? data.map((b: BookingRecord) => b.slot) : [];
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot: selectedSlot, name, email, footageLink }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setTimeout(() => { window.location.href = data.url; }, 300);
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
    <>
      <style>{`
        * { box-sizing: border-box; }
 
        .booking-page {
          min-height: 100vh;
          background: #f0f4f3;
          font-family: 'Georgia', serif;
          padding: 48px 20px 80px;
        }
 
        .booking-container {
          max-width: 640px;
          margin: 0 auto;
        }
 
        .booking-header {
          margin-bottom: 36px;
        }
 
        .booking-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #0f2b27;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }
 
        .booking-header p {
          font-size: 14px;
          color: #5a7972;
          margin: 0;
          font-family: 'Helvetica Neue', sans-serif;
        }
 
        .session-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2A7A6F;
          color: white;
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
          letter-spacing: 0.3px;
        }
 
        .session-badge span {
          width: 6px;
          height: 6px;
          background: #7de8d8;
          border-radius: 50%;
          display: inline-block;
        }
 
        /* Day group */
        .day-group {
          margin-bottom: 28px;
        }
 
        .day-label {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #2A7A6F;
          margin-bottom: 10px;
        }
 
        .slots-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
 
        .slot-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1.5px solid #c8dbd8;
          background: white;
          cursor: pointer;
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #1a3d37;
          transition: all 0.15s ease;
          position: relative;
        }
 
        .slot-btn:hover:not(:disabled) {
          border-color: #2A7A6F;
          background: #f0faf8;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(42,122,111,0.12);
        }
 
        .slot-btn.selected {
          border-color: #2A7A6F;
          background: #2A7A6F;
          color: white;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(42,122,111,0.3);
        }
 
        .slot-btn.booked {
          border-color: #e0e7e6;
          background: #f7faf9;
          color: #b0c4c1;
          cursor: not-allowed;
          text-decoration: line-through;
        }
 
        .slot-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2A7A6F;
          flex-shrink: 0;
        }
 
        .slot-btn.selected .slot-dot {
          background: rgba(255,255,255,0.7);
        }
 
        .slot-btn.booked .slot-dot {
          background: #d0dedd;
        }
 
        .booked-tag {
          font-size: 11px;
          font-weight: 500;
          color: #b0c4c1;
          margin-left: 4px;
        }
 
        /* Divider */
        .divider {
          height: 1px;
          background: #dce8e6;
          margin: 32px 0;
        }
 
        /* Form */
        .form-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f2b27;
          margin: 0 0 20px;
          font-family: 'Helvetica Neue', sans-serif;
        }
 
        .form-group {
          margin-bottom: 18px;
        }
 
        .form-label {
          display: block;
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #3d6b63;
          margin-bottom: 6px;
        }
 
        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #c8dbd8;
          border-radius: 8px;
          font-size: 15px;
          font-family: 'Helvetica Neue', sans-serif;
          color: #0f2b27;
          background: white;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
 
        .form-input:focus {
          border-color: #2A7A6F;
          box-shadow: 0 0 0 3px rgba(42,122,111,0.1);
        }
 
        .form-input::placeholder {
          color: #a8c0bc;
        }
 
        .form-hint {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 12px;
          color: #7a9e99;
          margin-top: 5px;
        }
 
        .error-box {
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 8px;
          color: #b91c1c;
          font-size: 14px;
          font-family: 'Helvetica Neue', sans-serif;
          margin-bottom: 18px;
        }
 
        .submit-btn {
          width: 100%;
          padding: 15px 20px;
          background: #2A7A6F;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Helvetica Neue', sans-serif;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 8px;
        }
 
        .submit-btn:hover:not(:disabled) {
          background: #236860;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(42,122,111,0.3);
        }
 
        .submit-btn:disabled {
          background: #a8c4c0;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
 
        .submit-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
 
        .lock-icon {
          opacity: 0.8;
          font-size: 13px;
        }
 
        .secure-note {
          text-align: center;
          font-size: 12px;
          color: #7a9e99;
          font-family: 'Helvetica Neue', sans-serif;
          margin-top: 12px;
        }
 
        .selected-summary {
          background: #eef7f5;
          border: 1.5px solid #b8d9d4;
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
 
        .selected-summary-label {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #2A7A6F;
          margin-bottom: 2px;
        }
 
        .selected-summary-value {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #0f2b27;
        }
 
        .selected-summary-price {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #2A7A6F;
        }
      `}</style>
 
      <div className="booking-page">
        <div className="booking-container">
 
          <div className="booking-header">
            <div className="session-badge">
              <span></span>
              45-min · Remote
            </div>
            <h1>Choose Your Session Time</h1>
            <p>Sessions booked at least 48 hours in advance so there's time to review your footage.</p>
          </div>
 
          {/* Time Slots */}
          {sortedGroupedSlots.length === 0 ? (
            <p style={{ color: "#5a7972", fontFamily: "Helvetica Neue, sans-serif" }}>
              No available sessions right now. New times open up regularly — check back soon.
            </p>
          ) : (
            sortedGroupedSlots.map(([dayKey, slots]) => (
              <div key={dayKey} className="day-group">
                <div className="day-label">{formatDateHeading(slots[0].value)}</div>
                <div className="slots-row">
                  {slots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot.value);
                    const isSelected = selectedSlot === slot.value;
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
                        className={`slot-btn ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                      >
                        <div className="slot-dot" />
                        {formatTime(slot.value)}
                        {isBooked && <span className="booked-tag">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
 
          <div className="divider" />
 
          {/* Selected slot summary */}
          {selectedSlot && (
            <div className="selected-summary">
              <div>
                <div className="selected-summary-label">Selected Session</div>
                <div className="selected-summary-value">
                  {formatDateHeading(selectedSlot)} · {formatTime(selectedSlot)}
                </div>
              </div>
              <div className="selected-summary-price">$120</div>
            </div>
          )}
 
          {error && <div className="error-box">{error}</div>}
 
          <form onSubmit={handleSubmit}>
            <div className="form-title">Your Details</div>
 
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                disabled={isSubmitting}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="form-input"
              />
            </div>
 
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>
 
            <div className="form-group">
              <label className="form-label">Footage Link <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#7a9e99" }}>(optional)</span></label>
              <input
                type="url"
                value={footageLink}
                disabled={isSubmitting}
                onChange={(e) => setFootageLink(e.target.value)}
                placeholder="YouTube, Google Drive, Dropbox..."
                className="form-input"
              />
              <div className="form-hint">You can also send this after booking.</div>
            </div>
 
            <button
              type="submit"
              disabled={!selectedSlot || isSubmitting}
              className="submit-btn"
            >
              <div className="submit-btn-inner">
                <span className="lock-icon">🔒</span>
                {isSubmitting ? "Redirecting to checkout..." : "Book My Session"}
              </div>
            </button>
 
            <p className="secure-note">Secure checkout via Stripe</p>
          </form>
 
        </div>
      </div>
    </>
  );
}