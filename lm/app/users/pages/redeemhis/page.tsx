"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./redeem.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

/* =========================
   API VARIABLE (SAME FILE)
========================= */
import { ENDPOINTS } from "../../../lib/endpoints.js";

export default function HistoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [redeems, setRedeems] = useState<any[]>([]);

  useEffect(() => {
    fetchRedeems();
  }, []);

const fetchRedeems = async () => {
  try {
    const res = await fetch(ENDPOINTS.USER_REDEEMS, {
      credentials: "include",
    });

    if (res.status === 401) {
      router.push("/users/auth/");
      return;
    }

    const result = await res.json();

    if (!result.success) {
      alert(result.message || "Something went wrong");
      return;
    }

    setRedeems(result.data || []);
  } catch (err) {
    console.log("FETCH ERROR:", err);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className={styles.container}>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {/* HEADER (NO CHANGE) */}
      <div className={styles.header}>
        <button
          className={styles.back}
          onClick={() => router.back()}
        >
          <FiArrowLeft />
        </button>

        <h2>Redeem History</h2>

        <div className={styles.placeholder}></div>
      </div>

      {/* TITLE */}
      <div className={styles.titleRow}>
        <h3>Redeemed Coupons</h3>
        <span>{redeems.length} records</span>
      </div>

      {/* EMPTY STATE */}
      {redeems.length === 0 && (
        <div className={styles.list}>
          <div className={styles.card}>
            <div className={styles.left}>
              <div className={styles.details}>
                <h4>No redeem history found</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      {redeems.map((item) => (
        <div key={item.id} className={styles.card}>

          {/* LEFT */}
          <div className={styles.left}>

            <div className={styles.imageBox}>
              <Image
                src={
                  item.partner_shops?.image ||
                  "/placeholder.png"
                }
                alt={item.partner_shops?.name || "Redeem"}
                width={60}
                height={60}
                onError={(e: any) => {
                  e.target.src = "/placeholder.png";
                }}
              />
            </div>

            <div className={styles.details}>
              <h4 className={styles.goldText}>
                {item.partner_shops?.name ||
                  "Coupon Redeemed"}
              </h4>

              <p className={styles.brand}>
                {item.partner_shops?.category || ""}
              </p>

              <div className={styles.meta}>
                <small>
                  {item.issue_date
                    ? new Date(
                        item.issue_date
                      ).toLocaleDateString("en-GB")
                    : "-"}
                </small>

                <small>
                  Coupon: ₹{item.coupon_value}
                </small>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <span>-{item.points_used} pts</span>
          </div>

        </div>
      ))}

      <div className={styles.footerSpace}></div>

    </div>
  );
}