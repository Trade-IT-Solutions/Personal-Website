import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./TalkWithKelly.module.css";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://personal-website-backend-e74k.onrender.com"
    : "http://localhost:5000";

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DURATIONS = [
  { minutes: 15, label: "15 min" },
  { minutes: 30, label: "30 min" },
  { minutes: 60, label: "1 hour" },
];

const TalkWithKelly = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [dateStr, setDateStr] = useState(todayYmd);
  const [timezone, setTimezone] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotStart, setSlotStart] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Talk with Kelly</h1>
          <p className={styles.subtitle}>
            Book a private video call. Choose a length, pick a time, complete
            payment securely with Stripe, then you&apos;ll receive a Google Meet
            link by email. Available times reflect Kelly&apos;s calendar when
            Google Calendar is connected on the server.
          </p>
        </header>

        {bookingStatus === "success" && (
          <div className={styles.bannerOk} role="status">
            Payment received. Your Google Meet link is being created —
            check your inbox in the next minute or two. If you don&apos;t see
            it, check spam or contact{" "}
            <a
              href="mailto:contact@kellyohgee.info"
              style={{ color: "#dff7ea" }}
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

        <form className={styles.form} onSubmit={goToCheckout}>
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
          <div className={styles.fieldBlock}>
            <input
              type="date"
              className={styles.input}
              value={dateStr}
              min={todayYmd()}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>

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
            />
            <input
              type="email"
              className={styles.input}
              placeholder="Email for Meet invite *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
      </div>
    </div>
  );
};

export default TalkWithKelly;
