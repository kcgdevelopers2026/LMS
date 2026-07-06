"use client";

import { useEffect, useState } from "react";
import styles from "./contestpage.module.css";

import { ENDPOINTS } from "../../../lib/endpoints.js";

type Contest = {
  id: string;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  prize_text?: string;
};

export default function ContestPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  /* ================= FETCH CONTESTS ================= */
  useEffect(() => {
    fetch(ENDPOINTS.USER_CONTESTS_ACTIVE)
      .then((res) => res.json())
      .then((data) => {
        setContests(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= LIVE CLOCK ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000); // updates UI every second

    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER ACTIVE CONTEST ================= */
  const activeContests = contests.filter((c) => {
    return new Date(c.end_date).getTime() >= now;
  });

  const contest = activeContests.length > 0 ? activeContests[0] : null;

  /* ================= JOIN CONTEST ================= */
  const joinContest = async (contestId: string) => {
    try {
      setSubmitting(true);
      setMessage("");

     const res = await fetch(ENDPOINTS.USER_CONTEST_JOIN, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("customerToken")}`
  },
  body: JSON.stringify({
    contest_id: contestId,
  }),
});

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setMessage("✔ Successfully Submitted");
      } else {
        setMessage(data.message || "Failed");
      }
    } catch (err) {
      setSubmitting(false);
      setMessage("Something went wrong");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>🏆 Contest Arena</h1>
        <p>Join exciting contests & win rewards</p>
      </div>

      {/* CONTEST CARD */}
      <div className={styles.grid}>

        {!contest && (
          <div className={styles.empty}>
            No active contests
          </div>
        )}

        {contest && (
          <div className={styles.card}>

            <div className={styles.badge}>LIVE</div>

            <div className={styles.section}>
              <h2>{contest.title}</h2>
              <p className={styles.desc}>{contest.description}</p>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionTitle}>🏆 Reward</div>
              <div className={styles.prize}>
                💰 {contest.prize_text || "No Prize"}
              </div>
            </div>

            <div className={styles.dateBox}>
              <div>
                <div className={styles.label}>Start Date</div>
                <div className={styles.date}>{contest.start_date}</div>
              </div>

              <div className={styles.line}></div>

              <div>
                <div className={styles.label}>End Date</div>
                <div className={styles.date}>
                  {contest.end_date}
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              className={styles.btn}
              onClick={() => joinContest(contest.id)}
              disabled={submitting}
            >
              {submitting ? "Joining..." : "Join Contest"}
            </button>

          </div>
        )}
      </div>

      {/* INFO */}
      <div className={styles.winnerLogic}>
        🏆 Winner Selection
        <div className={styles.logicText}>
          Based on your <b>recent purchases from our shops</b>.
        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={styles.success}>
          {message}
        </div>
      )}

    </div>
  );
}