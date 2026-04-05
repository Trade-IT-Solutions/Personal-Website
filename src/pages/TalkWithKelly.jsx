import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./TalkWithKelly.module.css";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://personal-website-backend-e74k.onrender.com"
    : process.env.REACT_APP_API_URL || "http://localhost:5000";

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmdLocal(ymd) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isAllowedBookingDate(ymd) {
  const weekday = parseYmdLocal(ymd).getDay();
  return weekday === 2 || weekday === 3 || weekday === 5;
}

function nextAllowedBookingDate(startYmd = todayYmd()) {
  const next = parseYmdLocal(startYmd);

  for (let i = 0; i < 14; i += 1) {
    const y = next.getFullYear();
    const m = String(next.getMonth() + 1).padStart(2, "0");
    const day = String(next.getDate()).padStart(2, "0");
    const ymd = `${y}-${m}-${day}`;

    if (isAllowedBookingDate(ymd)) {
      return ymd;
    }
    next.setDate(next.getDate() + 1);
  }

  return startYmd;
}

const DURATIONS = [
  { minutes: 15, label: "15 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 hour" },
];

const TalkWithKelly = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [dateStr, setDateStr] = useState(() => nextAllowedBookingDate(todayYmd()));
  const [timezone, setTimezone] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotStart, setSlotStart] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  const bookingStatus = searchParams.get("booking");

  useEffect(() => {
    if (bookingStatus === "success" || bookingStatus === "cancelled") {
      const t = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 12000);
      return () => clearTimeout(t);
    }
  }, [bookingStatus, setSearchParams]);

  const loadSlots = useCallback(async () => {
    setError("");
    setLoadingSlots(true);
    setSlotStart(null);

    if (!isAllowedBookingDate(dateStr)) {
      setSlots([]);
      setLoadingSlots(false);
      setError("Bookings are available on Tuesdays, Wednesdays, and Fridays only.");
      return;
    }

    try {
      const q = new URLSearchParams({
        date: dateStr,
        durationMinutes: String(durationMinutes),
      });
      const res = await fetch(`${API_URL}/api/booking/slots?${q}`);
      const data = await res.json();
      if (!data.success) {
        setSlots([]);
        setError(data.message || "Could not load times.");
        return;
      }
      setTimezone(data.timezone || "");
      setSlots(data.slots || []);
      if (data.message) {
        setError(data.message);
      }
    } catch (e) {
      setSlots([]);
      setError("Network error loading availability.");
    } finally {
      setLoadingSlots(false);
    }
  }, [dateStr, durationMinutes]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const canPay = useMemo(
    () =>
      Boolean(
        slotStart &&
          email.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ),
    [slotStart, email]
  );

  const goToCheckout = async (e) => {
    e.preventDefault();
    if (!canPay) return;
    setError("");
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/booking/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes,
          slotStart,
          email: email.trim(),
          name: name.trim(),
          phone: phone.trim(),
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.message || "Checkout could not be started.");
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.container} id="talk-booking-main">
        <header className={styles.header}>
          <h1 className={styles.title}>Talk with Kelly</h1>
          <p className={styles.subtitle}>
            This call is designed to help you break down your current
            challenges, identify your skill set, and build a clear path to
            scaling and accelerating your income.
          </p>
          <p className={styles.subtitleLead}>
            Book your session, choose a time, and receive your Google Meet link
            after secure payment.
          </p>
        </header>

        {bookingStatus === "success" && (
          <div className={styles.bannerOk} role="status">
            Payment received. Your Google Meet link is being created —
            check your inbox in the next minute or two. If you don&apos;t see
            it, check spam or contact{" "}
            <a
              href="mailto:contact@kellyohgee.info"
              className={styles.bannerLink}
            >
              contact@kellyohgee.info
            </a>
            .
          </div>
        )}
        {bookingStatus === "cancelled" && (
          <div className={styles.bannerWarn} role="status">
            Checkout was cancelled. No charge was made. You can pick another
            time below.
          </div>
        )}

        <form
          className={styles.form}
          onSubmit={goToCheckout}
          autoComplete="on"
        >
          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          <h2 className={styles.sectionTitle}>Session length</h2>
          <div className={styles.durationRow}>
            {DURATIONS.map((d) => (
              <button
                key={d.minutes}
                type="button"
                className={`${styles.durationBtn} ${
                  durationMinutes === d.minutes ? styles.durationBtnActive : ""
                }`}
                onClick={() => setDurationMinutes(d.minutes)}
              >
                {d.label}
                <span className={styles.durationHint}>Stripe checkout</span>
              </button>
            ))}
          </div>

          <h2 className={styles.sectionTitle}>Date &amp; time</h2>
          {timezone && (
            <p className={styles.tzNote}>Times are shown in {timezone}.</p>
          )}
          <div className={`${styles.fieldBlock} ${styles.fieldBlockDate}`}>
            <div className={styles.dateInputWrap}>
              <input
                type="date"
                className={`${styles.input} ${styles.inputDate}`}
                value={dateStr}
                min={nextAllowedBookingDate(todayYmd())}
                onChange={(e) => {
                  const nextDate = e.target.value;
                  if (!isAllowedBookingDate(nextDate)) {
                    setDateStr(nextAllowedBookingDate(nextDate));
                    setError(
                      "Bookings are available on Tuesdays, Wednesdays, and Fridays only."
                    );
                    return;
                  }
                  setDateStr(nextDate);
                }}
              />
            </div>
          </div>
          <p className={styles.tzNote}>
            Booking days are limited to Tuesdays, Wednesdays, and Fridays.
          </p>

          <div className={styles.fieldBlock}>
            {loadingSlots ? (
              <p className={styles.slotsMuted}>Loading open times…</p>
            ) : slots.length === 0 ? (
              <p className={styles.slotsMuted}>
                No open slots that day for this session length. Try another
                date.
              </p>
            ) : (
              <div className={styles.slotGrid}>
                {slots.map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    className={`${styles.slotBtn} ${
                      slotStart === s.start ? styles.slotBtnActive : ""
                    }`}
                    onClick={() => setSlotStart(s.start)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h2 className={styles.sectionTitle}>Your details</h2>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              enterKeyHint="next"
              id="booking-name"
            />
            <input
              type="email"
              className={styles.input}
              placeholder="Email for Meet invite *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              enterKeyHint="next"
              id="booking-email"
              inputMode="email"
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.visuallyHidden} htmlFor="booking-phone">
              Phone number
            </label>
            <input
              type="tel"
              className={styles.input}
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              enterKeyHint="next"
              id="booking-phone"
              inputMode="tel"
              maxLength={32}
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.labelText} htmlFor="booking-description">
              What would you like to focus on?
            </label>
            <textarea
              id="booking-description"
              className={styles.textarea}
              placeholder="Short description (optional, max 450 characters)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={450}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!canPay || checkoutLoading}
          >
            {checkoutLoading ? "Redirecting to Stripe…" : "Continue to payment"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default TalkWithKelly;
