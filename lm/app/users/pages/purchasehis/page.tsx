"use client";

import { useEffect, useState } from "react";
import styles from "./purchase.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Purchase = {
  id: string;
  product: string;
  product_image: string;
  tier: string;
  purchase_date: string;
  bill_number: string;
  amount: number;
  reward_points: number;
};

export default function HistoryPage() {
  const router = useRouter();

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filtered, setFiltered] = useState<Purchase[]>([]);

  const [month, setMonth] = useState("All");
  const [date, setDate] = useState("");
  const [tier, setTier] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);


  const API_URL = "http://localhost:5001";

  const fetchData = async () => {
    try {
      const res = await fetch(
  `${API_URL}/api/customer/purchases`,
  { credentials: "include" }
);

      const result = await res.json();

      if (result?.success) {
        setPurchases(result.data || []);
        setFiltered(result.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* FILTER LOGIC */
  useEffect(() => {
    let data = [...purchases];

    const today = new Date().toISOString().split("T")[0];

    if (month !== "All") {
      data = data.filter((item) => {
        const m = new Date(item.purchase_date).toLocaleString("default", {
          month: "long",
        });
        return m === month;
      });
    }

    if (date) {
      if (date > today) return;

      data = data.filter((item) => {
        const d = new Date(item.purchase_date)
          .toISOString()
          .split("T")[0];
        return d === date;
      });
    }

    if (tier !== "All") {
      data = data.filter((item) => item.tier === tier);
    }

    setFiltered(data);
  }, [month, date, tier, purchases]);

  const handleClear = () => {
    setMonth("All");
    setDate("");
    setTier("All");
    setFiltered(purchases);
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => router.back()}>
          <FiArrowLeft />
        </button>

        <h2>Purchase History</h2>

        <button className={styles.clearBtn} onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* SUMMARY */}
      <div className={styles.summary}>
        <div className={styles.cardBox}>
          <span>Total Purchases</span>
          <h3>{filtered.length}</h3>
        </div>

        <div className={styles.cardBox}>
          <span>Total Earned</span>
          <h3>
            {filtered.reduce(
              (sum, i) => sum + (i.reward_points || 0),
              0
            )}
          </h3>
        </div>
      </div>

      {/* FILTERS */}
      <div className={styles.filter}>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="All">All Months</option>
          {[
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        
      </div>

      {/* LIST */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No purchases found</p>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* IMAGE LEFT FULL HEIGHT */}
              <div className={styles.imageBox}>
                <img
                  src={item.product_image || "/placeholder.png"}
                  alt={item.product}
                />
              </div>

              {/* DETAILS */}
              <div className={styles.details}>
                <h4>{item.product}</h4>

                <span className={styles.tier}>{item.tier}</span>

                <p>Bill: {item.bill_number}</p>

                <small>
                  {new Date(item.purchase_date).toLocaleDateString("en-GB")} • ₹
                  {item.amount}
                </small>
              </div>

              {/* POINTS */}
              <div className={styles.points}>
                +{item.reward_points || 0} pts
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.footerSpace}></div>
    </div>
  );
}