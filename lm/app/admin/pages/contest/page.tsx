"use client";

import { useEffect, useState } from "react";
import styles from "./contest.module.css";

const API = "http://localhost:5001";

/* ================= TYPES ================= */

type Contest = {
  id: string;
  title: string;
  description: string;
  prize_text: string;
};

type Customer = {
  id: string;
  name?: string;
  email?: string;
  mobile?: string;
};

type Entry = {
  id: string;
  created_at?: string;
  customer?: Customer;
};

type Winner = {
  id: string;
  created_at?: string;
  customer?: Customer;
  contest?: { title: string };
};

/* ================= COMPONENT ================= */

export default function ContestAdmin() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState("");

  const [unlocked, setUnlocked] = useState(false);
const [password, setPassword] = useState("");

  const [entries, setEntries] = useState<Entry[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);

  const [tab, setTab] = useState<"participants" | "winners">("participants");

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [prize, setPrize] = useState("");

  /* ================= LOAD ================= */

  const handleUnlock = async () => {
  try {
    const res = await fetch(`${API}/api/admin/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.message || "Incorrect password");
      return;
    }

    setUnlocked(true);
    setPassword("");
  } catch (err) {
    alert("Server error");
  }
};

  const loadContests = async () => {
    const res = await fetch(`${API}/api/admin/contests`, {
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) setContests(data.data || []);
  };

  useEffect(() => {
    loadContests();
  }, []);


  const exportAllParticipants = async () => {
  const allData: any[] = [];

  for (const contest of contests) {
    const res = await fetch(
      `${API}/api/admin/contests/entries/${contest.id}`,
      { credentials: "include" }
    );

    const data = await res.json();

    if (data.success) {
      (data.data || []).forEach((e: any) => {
        allData.push({
          contest: contest.title,
          name: e.customer?.name,
          email: e.customer?.email,
          mobile: e.customer?.mobile,
          entry_date: e.created_at,
        });
      });
    }
  }

  if (!allData.length) return;

  const csv =
    Object.keys(allData[0]).join(",") +
    "\n" +
    allData
      .map((r) =>
        Object.values(r)
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      )
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `ALL_CONTEST_PARTICIPANTS.csv`;
  a.click();
};

  /* ================= SELECT ================= */

  const selectContest = async (id: string) => {
    setSelectedContest(id);
    setTab("participants");

    const [eRes, wRes] = await Promise.all([
      fetch(`${API}/api/admin/contests/entries/${id}`, {
        credentials: "include",
      }),
      fetch(`${API}/api/admin/contests/winners/${id}`, {
        credentials: "include",
      }),
    ]);

    const eData = await eRes.json();
    const wData = await wRes.json();

    if (eData.success) setEntries(eData.data || []);
    if (wData.success) setWinners(wData.data ? [wData.data] : []);
    else setWinners([]);
  };

  /* ================= CREATE ================= */

  const createContest = async () => {
    const res = await fetch(`${API}/api/admin/contests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        description: desc,
        prize_text: prize,
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 30 * 86400000)
          .toISOString()
          .split("T")[0],
      }),
    });

    const data = await res.json();

    if (data.success) {
      setTitle("");
      setDesc("");
      setPrize("");
      loadContests();
    }
  };

  /* ================= SAVE WINNER ================= */

  const saveWinner = async (entry: Entry) => {
    const res = await fetch(`${API}/api/admin/contests/winner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        contest_id: selectedContest,
        customer_id: entry.customer?.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Winner selected 🎉");
      selectContest(selectedContest);
    } else {
      alert(data.message || "Error");
    }
  };

  /* ================= EXPORT ================= */

  const exportCSV = (type: "participants" | "winners") => {
    const data =
      type === "participants"
        ? entries.map((e) => ({
            name: e.customer?.name,
            email: e.customer?.email,
            mobile: e.customer?.mobile,
            entry_date: e.created_at,
          }))
        : winners.map((w) => ({
            name: w.customer?.name,
            email: w.customer?.email,
            mobile: w.customer?.mobile,
            contest: w.contest?.title,
            
          }));

    if (!data.length) return;

    const csv =
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((r) =>
        Object.values(r)
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.csv`;
    a.click();
  };


  if (!unlocked) {
  return (
    <div className={styles.lockContainer}>
      <div className={styles.lockCard}>
        <h2>🔒 Contest Panel Locked</h2>

        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleUnlock();
          }}
        />

        <button className={styles.btn} onClick={handleUnlock}>
          Unlock
        </button>
      </div>
    </div>
  );
}


  return (
    <div className={styles.page}>
      {/* LEFT */}
      <div className={styles.left}>
        <h2>🏆 Contest Manager</h2>

        <div className={styles.createBox}>
          <input
            className={styles.input}
            placeholder="Contest Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Prize"
            value={prize}
            onChange={(e) => setPrize(e.target.value)}
          />

          <button className={styles.btn} onClick={createContest}>
            Create Contest
          </button>
        </div>

        {contests.map((c) => (
          <div
            key={c.id}
            className={styles.item}
            onClick={() => selectContest(c.id)}
          >
            <b>{c.title}</b>
            <p>{c.description}</p>
            <span>🏆 {c.prize_text}</span>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className={styles.right}>

         <button className={styles.exportAllBtn} onClick={exportAllParticipants}>
  ⬇ Export All Participants
</button>
        {!selectedContest && (
          <div className={styles.empty}>Select a contest</div>
        )}

       

        {selectedContest && (
          <>
            {/* HEADER */}
            <div className={styles.header}>
              <div className={styles.tabs}>
                <button
                  className={tab === "participants" ? styles.activeTab : ""}
                  onClick={() => setTab("participants")}
                >
                  Participants ({entries.length})
                </button>

                <button
                  className={tab === "winners" ? styles.activeTab : ""}
                  onClick={() => setTab("winners")}
                >
                  Winner ({winners.length})
                </button>
              </div>

              <button
                className={styles.exportBtn}
                onClick={() => exportCSV(tab)}
              >
                ⬇ Export CSV
              </button>
            </div>

            {/* PARTICIPANTS */}
            {tab === "participants" && (
              <div className={styles.grid}>
                {entries.map((e) => (
                  <div key={e.id} className={styles.card}>
                    <div className={styles.row}>
                      <b>{e.customer?.name}</b>
                      <span>{e.customer?.email}</span>
                    </div>

                    <div className={styles.meta}>📱 {e.customer?.mobile}</div>

                    <div className={styles.meta}>
                      📅 {e.created_at
                        ? new Date(e.created_at).toLocaleString()
                        : "-"}
                    </div>

                    <button
                      className={styles.winBtn}
                      onClick={() => saveWinner(e)}
                    >
                      Make Winner
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* WINNER */}
            {tab === "winners" && (
              <div className={styles.grid}>
                {winners.map((w) => (
                  <div key={w.id} className={styles.winnerCard}>
                    <h3>🏆 Winner</h3>

                    <div className={styles.row}>
                      <b>{w.customer?.name}</b>
                      <span>{w.customer?.email}</span>
                    </div>

                    <div className={styles.meta}>
                      📱 {w.customer?.mobile}
                    </div>

                    <div className={styles.meta}>
                      🎯 {w.contest?.title}
                    </div>

                   
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}