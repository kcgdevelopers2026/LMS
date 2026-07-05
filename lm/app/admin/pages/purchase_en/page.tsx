"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./purchase.module.css";
import { ENDPOINTS } from "../../../lib/endpoints.js";



type Customer = {
  id: string;
  customer_id: string;
  card_no: string;
  name: string;
  mobile: string;
};

type Tier = "GOLD" | "SILVER" | "DIAMOND";

const tierImages: Record<Tier, string> = {
  GOLD: "/ornaments/gold.jpg",
  SILVER: "/ornaments/silver.jpg",
  DIAMOND: "/ornaments/diamond.jpg",
};

/* ================= PRODUCT TYPE ================= */
type Product =
  | "CHAIN"
  | "RING"
  | "HARAM"
  | "NECKLACE"
  | "DROPS"
  | "BANGLES"
  | "BRACELET"
  | "EAR RINGS"
  | "OTHERS";

export default function PurchaseEntryPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<any>(null);

  const [mobile, setMobile] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [tier, setTier] = useState<Tier>("GOLD");

  /* ================= NEW PRODUCT STATE ================= */
  const [product, setProduct] = useState<Product>("CHAIN");

  const [form, setForm] = useState({
    bill_number: "",
    amount: "",
    reward_points: 0,
    notes: "",
  });

  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const [purchaseDate, setPurchaseDate] = useState(today);

  /* ================= LOAD CUSTOMERS ================= */
  useEffect(() => {
    fetch(ENDPOINTS.CUSTOMERS, {
  credentials: "include",
})
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.data;
        setCustomers(list || []);
      })
      .catch(() => setCustomers([]));
  }, []);

  /* ================= LOAD SETTINGS ================= */
  useEffect(() => {
    fetch(ENDPOINTS.SETTINGS, {
  credentials: "include",
})
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setSettings(null));
  }, []);

  /* ================= REWARD LOGIC ================= */
  const getRewardPoints = (amount: number, t: Tier) => {
    if (!settings || !amount) return 0;

    if (t === "GOLD") {
      return Math.round(
        (amount / settings.gold_min_purchase) *
          settings.gold_bonus_points
      );
    }

    if (t === "SILVER") {
      return Math.round(
        (amount / settings.silver_min_purchase) *
          settings.silver_bonus_points
      );
    }

    if (t === "DIAMOND") {
      return Math.round(
        (amount / settings.diamond_min_purchase) *
          settings.diamond_bonus_points
      );
    }

    return 0;
  };

  const updatePoints = (amountStr: string, t: Tier) => {
    const amt = Number(amountStr || 0);

    setForm((prev) => ({
      ...prev,
      amount: amountStr,
      reward_points: getRewardPoints(amt, t),
    }));
  };

  const selectCustomer = (val: string) => {
    setMobile(val);

    const found = customers.find((c) => c.mobile === val);

    setSelectedCustomer(found || null);
  };

  /* ================= SUBMIT ================= */
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const ok = window.confirm("Save purchase?");
  if (!ok) return;

  const res = await fetch(ENDPOINTS.PURCHASES, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({
      customer_id: selectedCustomer?.id,
      customer_name: selectedCustomer?.name,
      mobile,
      card_no: selectedCustomer?.card_no,
      product,
      tier,
      product_image: tierImages[tier],
      purchase_date: purchaseDate,
      bill_number: form.bill_number,
      amount: Number(form.amount),
      reward_points: form.reward_points,
      notes: form.notes,
    }),
  });

  const data = await res.json();
  console.log("RESPONSE:", data);

  if (!res.ok) {
    alert(data.message || "Failed to save purchase");
    return;
  }

  alert("Saved successfully!");


const now = new Date();

  const formattedDate = now.toLocaleDateString("en-IN");
  const formattedTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = [
    "✨ K Chinnadurai Gold House Private Limited | Tuticorin ✨",
    "",
    `📅 Date: ${formattedDate}`,
    `⏰ Time: ${formattedTime}`,
    "",
    `👤 Customer: ${selectedCustomer?.name ?? ""}`,
    `🧾 Bill No: ${form.bill_number}`,
    `💰 Amount: ₹${Number(form.amount).toLocaleString("en-IN")}`,
    `⭐ Loyalty Points: ${form.reward_points}`,
    `💳 Card No: ${selectedCustomer?.card_no ?? ""}`,
    "",
    "🙏 Thank you for shopping with us 💛"
  ].join("\n");

  const phone = `91${mobile}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (openInNewTab) {
    const win = window.open(url, "_blank", "noopener,noreferrer");

    // fallback if popup blocked
    if (!win) {
      window.location.href = url;
    }
  } else {
    window.location.href = url;
  }


  setMobile("");
  setSelectedCustomer(null);
  setProduct("CHAIN");

  setForm({
    bill_number: "",
    amount: "",
    reward_points: 0,
    notes: "",
  });
};

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Purchase Entry</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>

            {/* MOBILE */}
            <div className={styles.field}>
              <label>Customer Mobile</label>
              <input
                value={mobile}
                onChange={(e) =>
                  selectCustomer(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            {/* ID */}
            <div className={styles.field}>
              <label>Customer ID</label>
              <input value={selectedCustomer?.customer_id || ""} readOnly />
            </div>

            {/* NAME */}
            <div className={styles.field}>
              <label>Customer Name</label>
              <input value={selectedCustomer?.name || ""} readOnly />
            </div>

            {/* CARD */}
            <div className={styles.field}>
              <label>Card No</label>
              <input value={selectedCustomer?.card_no || ""} readOnly />
            </div>

            {/* TIER */}
            <div className={styles.field}>
              <label>Tier</label>
              <select
                value={tier}
                onChange={(e) => {
                  const t = e.target.value as Tier;
                  setTier(t);
                  updatePoints(form.amount, t);
                }}
              >
                <option>GOLD</option>
                <option>SILVER</option>
                <option>DIAMOND</option>
              </select>
            </div>

            {/* ================= NEW PRODUCT DROPDOWN ================= */}
            <div className={styles.field}>
              <label>Product</label>
              <select
                value={product}
                onChange={(e) =>
                  setProduct(e.target.value as Product)
                }
              >
                <option>CHAIN</option>
                <option>RING</option>
                <option>HARAM</option>
                <option>NECKLACE</option>
                <option>DROPS</option>
                <option>BANGLES</option>
                <option>BRACELET</option>
                <option>EAR RINGS</option>
                <option>OTHERS</option>
              </select>
            </div>

            {/* DATE */}
            <div className={styles.field}>
              <label>Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) =>
                  setPurchaseDate(e.target.value)
                }
              />
            </div>

            {/* BILL */}
            <div className={styles.field}>
              <label>Bill Number</label>
              <input
                value={form.bill_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bill_number: e.target.value,
                  })
                }
              />
            </div>

            {/* AMOUNT */}
            <div className={styles.field}>
              <label>Amount</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  updatePoints(e.target.value, tier)
                }
              />
            </div>

            {/* POINTS */}
            <div className={styles.field}>
              <label>Reward Points</label>
              <input value={form.reward_points} readOnly />
            </div>

          </div>

          {/* NOTES */}
          <div className={styles.fieldFull}>
            <label>Notes</label>
            <textarea className={styles.notes}
              value={form.notes}
              
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />
          </div>

          {/* IMAGE */}
          <div className={styles.imageBox}>
            <img src={tierImages[tier]} />
          </div>

          {/* BUTTON */}
          <div className={styles.actions}>
            <button type="submit">Save Purchase</button>
          </div>

        </form>
      </div>
    </div>
  );
}