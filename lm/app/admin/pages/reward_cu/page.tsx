"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./rewardcu.module.css";


import { API_BASE_URL } from "../../../lib/api.js";
import { ENDPOINTS } from "../../../lib/endpoints.js";
/* =========================
   TYPES
========================= */
type Customer = {
  id: string;
  name: string;
  mobile: string;
  card_no: string;
};

type Shop = {
  id: string;
  name: string;
  coupons?: number; // 👈 IMPORTANT (added)
};

/* =========================
   COMPONENT
========================= */
export default function RewardCouponPage() {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);

  const [shops, setShops] = useState<Shop[]>([]);
  const [shopId, setShopId] = useState("");

  const [shopCoupon, setShopCoupon] = useState<number>(0); // ✅ FIXED (ONLY ONCE)

  const [totalEarned, setTotalEarned] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);

  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const issue_date = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  /* =========================
     LOAD SHOPS
  ========================= */
  useEffect(() => {
    const loadShops = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/shops`, {
          credentials: "include",
        });

        const data = await res.json();
        setShops(data?.data || []);
      } catch {
        setShops([]);
      }
    };

    loadShops();
  }, []);

  /* =========================
     FETCH CUSTOMER
  ========================= */
  const fetchCustomer = async (mobile: string) => {
    if (mobile.length !== 10) return;

    try {
      setLoadingCustomer(true);

      const res = await fetch(
  `${API_BASE_URL}/api/customers/points-by-mobile?mobile=${mobile}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok || !data?.data) {
        setCustomer(null);
        setTotalEarned(0);
        setTotalUsed(0);
        return;
      }

      setCustomer({
        id: data.data.id,
        name: data.data.name,
        mobile: data.data.mobile,
        card_no: data.data.card_no,
      });

      setTotalEarned(Number(data.data.total_earned || 0));
      setTotalUsed(Number(data.data.total_used || 0));
    } catch (err) {
      console.error(err);
      setCustomer(null);
      setTotalEarned(0);
      setTotalUsed(0);
    } finally {
      setLoadingCustomer(false);
    }
  };

  /* =========================
     PHONE INPUT
  ========================= */
  const handlePhoneChange = (value: string) => {
    const clean = value.replace(/\D/g, "");
    setPhone(clean);

    if (clean.length === 10) {
      fetchCustomer(clean);
    } else {
      setCustomer(null);
      setTotalEarned(0);
      setTotalUsed(0);
    }
  };

  /* =========================
     POINTS
  ========================= */
  const currentPoints = useMemo(() => {
    return Math.max(totalEarned - totalUsed, 0);
  }, [totalEarned, totalUsed]);

  const remainingPoints = useMemo(() => {
    return Math.max(currentPoints - shopCoupon, 0);
  }, [currentPoints, shopCoupon]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer?.id) return alert("Customer not found");
    if (!shopId) return alert("Select shop");
    if (!shopCoupon) return alert("Select shop coupon");

    if (currentPoints < shopCoupon) {
      return alert(
        `Not enough points ❌ You have ${currentPoints}, need ${shopCoupon}`
      );
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/api/redeems`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customer.id,
          shop_id: shopId,
          customer_name: customer.name,
          mobile: customer.mobile,
          card_no: customer.card_no,
          coupon_value: shopCoupon,
          notes: "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Redeem failed");
      }

      alert("Coupon Issued Successfully ✅");

      setPhone("");
      setCustomer(null);
      setShopId("");
      setShopCoupon(0);
      setTotalEarned(0);
      setTotalUsed(0);
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     UI (NO DESIGN CHANGE)
  ========================= */
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Issue Reward Coupon</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grid}>

            {/* PHONE */}
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                value={phone}
                maxLength={10}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={styles.input}
              />
              {loadingCustomer && <small>Searching...</small>}
            </div>

            {/* NAME */}
            <div className={styles.formGroup}>
              <label>Name</label>
              <input value={customer?.name || ""} readOnly className={styles.input} />
            </div>

            {/* CARD */}
            <div className={styles.formGroup}>
              <label>Card No</label>
              <input value={customer?.card_no || ""} readOnly className={styles.input} />
            </div>

            {/* POINTS */}
            <div className={styles.formGroup}>
              <label>Current Points</label>
              <input value={currentPoints} readOnly className={styles.input} />
            </div>

            {/* SHOP */}
            <div className={styles.formGroup}>
              <label>Shop</label>
              <select
                value={shopId}
                onChange={(e) => {
                  const id = e.target.value;
                  setShopId(id);

                  const selectedShop = shops.find((s) => s.id === id);
                  setShopCoupon(Number(selectedShop?.coupons || 0));
                }}
                className={styles.input}
              >
                <option value="">Select Shop</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>


            
          

            {/* COUPON DISPLAY */}
            <input
              value={shopCoupon ? `₹${shopCoupon}` : ""}
              readOnly
              className={styles.input}
            />

            {/* REMAINING */}
            <div className={styles.formGroup}>
              <label>Remaining Points</label>
              <input value={remainingPoints} readOnly className={styles.input} />
            </div>

            {/* DATE */}
            <div className={styles.formGroup}>
              <label>Date</label>
              <input value={issue_date} readOnly className={styles.input} />
            </div>

          </div>

          <button type="submit" className={styles.issueBtn} disabled={submitting}>
            {submitting ? "Processing..." : "Issue Coupon"}
          </button>
        </form>
      </div>
    </div>
  );
}