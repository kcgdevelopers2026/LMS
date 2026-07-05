"use client";

import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";

const API = "http://localhost:5001/dashboard";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await fetch(API, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("API Error: " + res.status);
      }

      const json = await res.json();

      console.log("DASHBOARD DATA:", json);

      setData(json.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No Data Found</div>;

  const stats = [
    {
      title: "Customers",
      value: data.stats.customers,
      color: "#22c55e",
      icon: "👥",
    },
    {
      title: "Shops",
      value: data.stats.shops,
      color: "#f59e0b",
      icon: "🏪",
    },
    {
      title: "Purchases",
      value: data.stats.purchases,
      color: "#3b82f6",
      icon: "🛒",
    },
    {
      title: "Redeems",
      value: data.stats.redeems,
      color: "#ef4444",
      icon: "🎁",
    },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.title} className={styles.statCard}>
            <div className={styles.statTop}>
              <span>{s.title}</span>
              <div className={styles.icon} style={{ background: s.color }}>
                {s.icon}
              </div>
            </div>
            <h2>{s.value}</h2>
          </div>
        ))}
      </section>

      <section className={styles.bottomGrid}>
        <div className={styles.summary}>
          <h3>Summary</h3>

          <div className={styles.row}>
            <span>Total Sales</span>
            <strong>₹{data.stats.totalSales}</strong>
          </div>

          <div className={styles.row}>
            <span>Points Issued</span>
            <strong>{data.stats.totalPointsIssued}</strong>
          </div>

          <div className={styles.row}>
            <span>Points Used</span>
            <strong>{data.stats.totalPointsUsed}</strong>
          </div>

          <div className={styles.row}>
            <span>Current Points</span>
            <strong>{data.stats.currentPoints}</strong>
          </div>
        </div>

        <div className={styles.activity}>
          <h3>Recent Customers</h3>

          {data.recentCustomers?.map((c: any, i: number) => (
            <div key={i} className={styles.activityItem}>
              <div className={styles.dot}></div>
              <div>
                <h4>{c.name}</h4>
                <p>{c.mobile}</p>
              </div>
              <small>{c.card_no}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}