"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./report.module.css";

type Report = any;

export default function Dashboard() {
  const [report, setReport] = useState<Report | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tier, setTier] = useState("all");

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (tier) params.append("category", tier);

      const res = await fetch(
        `http://localhost:5001/api/admin/reports?${params.toString()}`,
        { credentials: "include" }
      );

      const json = await res.json();
      setReport(json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [from, to, tier]);

  /* ================= SAFE DATA ================= */
  const data = report || {};

  /* ================= EXPORT CSV ================= */
  const exportCSV = (filename: string, rows: any[]) => {
    if (!rows?.length) return;

    const header = Object.keys(rows[0]).join(",");
    const body = rows.map((r) => Object.values(r).join(",")).join("\n");

    const blob = new Blob([header + "\n" + body], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  /* ================= SAFE ARRAYS ================= */
  const topCustomers = data.topCustomers || [];
  const topProducts = data.topProducts || [];
  const recentPurchases = data.recentPurchases || [];
  const categorySales = data.categorySales || [];
  const customerPurchases = data.customerPurchases || [];

  /* ================= SORT CUSTOMERS ================= */
  const customersByAmount = [...topCustomers].sort(
    (a, b) => b.amount - a.amount
  );

  const customersByCount = [...topCustomers].sort(
    (a, b) => b.count - a.count
  );

  /* ================= PRODUCTS BY TIER ================= */
  const productsByTier = useMemo(() => {
    const map: any = {};

    topProducts.forEach((p: any) => {
      const t = p.tier || "Unknown";

      if (!map[t]) map[t] = [];

      map[t].push(p);
    });

    return map;
  }, [topProducts]);

  /* ================= LOADING ================= */
  if (!report) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>Sales Dashboard</h1>
       
      </div>

  

      {/* KPI */}
      <div className={styles.kpiRow}>
        <div>Today ₹{data.kpi?.today?.sales || 0}</div>
        <div>Week ₹{data.kpi?.week?.sales || 0}</div>
        <div>Month ₹{data.kpi?.month?.sales || 0}</div>
        <div>Year ₹{data.kpi?.year?.sales || 0}</div>
      </div>

     
      {/* ================= TOP CUSTOMERS BY AMOUNT ================= */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Top Customers (Amount)</h2>
          <button onClick={() => exportCSV("customers_amount", customersByAmount)}>
            Export
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {customersByAmount.map((c: any, i: number) => (
              <tr key={i}>
                <td>{c.customer_name}</td>
                <td>{c.mobile}</td>
                <td>{c.count}</td>
                <td>₹{c.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= TOP CUSTOMERS BY COUNT ================= */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Top Customers (Count)</h2>
          <button onClick={() => exportCSV("customers_count", customersByCount)}>
            Export
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {customersByCount.map((c: any, i: number) => (
              <tr key={i}>
                <td>{c.customer_name}</td>
                <td>{c.mobile}</td>
                <td>{c.count}</td>
                <td>₹{c.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* ================= RECENT PURCHASES ================= */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Purchases</h2>

          <button onClick={() => exportCSV("all_purchases", customerPurchases)}>
            Export All Purchases
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Tier</th>
              <th>Product</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentPurchases.map((p: any, i: number) => (
              <tr key={i}>
                <td>{p.customer}</td>
                <td>{p.mobile}</td>
                <td>{p.category}</td>
                <td>{p.product}</td>
                <td>₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= FULL EXPORT ================= */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Full Export</h2>

          <button
            onClick={() =>
              exportCSV("FULL_EXPORT", customerPurchases)
            }
          >
            Download All Data
          </button>
        </div>

        <p>Total Records: {data.totalRecords || 0}</p>
      </div>
    </div>
  );
}