"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./homepage.module.css";
import {
  FaRing,
  FaShirt,
  FaUtensils,
  FaTags,
} from "react-icons/fa6";
import { useRouter } from "next/navigation";

import card from "../../../../public/credit_card.jpeg";
import { ENDPOINTS } from "../../../lib/endpoints.js";

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [customer, setCustomer] = useState<any>(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [recentRedeems, setRecentRedeems] = useState<any[]>([]);
  
  useEffect(() => {
    fetchHome();
  }, []);



  const fetchHome = async () => {
    try {
      const res = await fetch(ENDPOINTS.CUSTOMER_HOME,
        {
          credentials: "include",
        }
      );

      if (res.status === 401) {
        router.push("/users/pages/login");
        return;
      }

      


      const result = await res.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      setCustomer(result.data.customer);
      setCurrentPoints(result.data.current_points);
      setRecentPurchases(result.data.recentPurchases || []);
      setRecentRedeems(result.data.recentRedeems || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

    const formatCardNumber = (cardNo: string) => {
  if (!cardNo) return "";

  const prefix = cardNo.slice(0, 3); // KCG
  const number = cardNo.slice(3);    // 000000001

  return `${prefix} ${number.match(/.{1,3}/g)?.join(" ")}`;
};

  if (loading) {
    return (
      <main className={styles.container}>
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>
            Hello, <span>{customer?.name}</span>
          </h1>

          <p>✨ Gold House Premium Loyalty Member ✨</p>
        </div>
      </div>

      {/* Membership Card */}

      <div className={`${styles.memberCard} ${styles.flipIn}`}>
        <Image
          src={card}
          alt="Membership Card"
          className={styles.cardImage}
          priority
        />

        <div className={styles.cardNo}>
  {formatCardNumber(customer?.card_no)}
</div>

        <div className={styles.joining}>
          <p>DATE OF JOINING</p>

          <h5>
            {customer?.joining_date
              ? new Date(customer.joining_date).toLocaleDateString(
                  "en-GB"
                )
              : "-"}
          </h5>
        </div>

        <div className={styles.points}>
          <p>REMAINING POINTS</p>

          <h2>{currentPoints}</h2>
        </div>
      </div>

      {/* Recent Purchase */}

      <div className={styles.sectionHeader}>
        <h3>Recent Purchase</h3>

        <button
          onClick={() =>
            router.push("/users/pages/purchasehis")
          }
        >
          View All
        </button>
      </div>

      {recentPurchases.length === 0 && (
        <div className={styles.listCard}>
          <div className={styles.item}>
            No purchases found.
          </div>
        </div>
      )}

      {recentPurchases.slice(0,2).map((purchase) => (
        <div className={styles.listCard} key={purchase.id}>
          <div className={styles.item}>
          <div className={styles.imageIcon}>
  <Image
  src={purchase.product_image}
  alt={purchase.product}
  fill
  className={styles.itemImage}
/>
</div>

            <div className={styles.info}>
              <h4>{purchase.product}</h4>

              <p className={styles.category}>
  {purchase.tier}
</p>

              <p>
                {purchase.purchase_date
                  ? new Date(
                      purchase.purchase_date
                    ).toLocaleDateString("en-GB")
                  : "-"}
              </p>

              <p className={styles.billNo}>
                Bill No : {purchase.bill_number}
              </p>

              <p>Amt : ₹{purchase.amount}</p>
            </div>

            <div className={styles.points}>
              <h4 className={styles.greenText}>
                +{purchase.reward_points}
              </h4>

              <span>Points</span>
            </div>
          </div>
        </div>
      ))}

      {/* Recent Redeem */}

      <div className={styles.sectionHeader}>
        <h3>Recent Redeem</h3>

        <button
          onClick={() =>
            router.push("/users/pages/redeemhis")
          }
        >
          View All
        </button>
      </div>

      {recentRedeems.length === 0 && (
        <div className={styles.listCard}>
          <div className={styles.item}>
            No redeems found.
          </div>
        </div>
      )}

      {recentRedeems.slice(0,2).map((redeem) => (
        <div className={styles.listCard} key={redeem.id}>
          <div className={styles.item}>
          <div className={styles.imageIcon}>
  <Image
  src={redeem.partner_shops?.image}
  alt={redeem.partner_shops?.name}
  fill
  className={styles.itemImage}
/>
</div>

            <div className={styles.info}>
              <h4>
                {redeem.partner_shops?.name || "Coupon Redeemed"}
              </h4>

              <p>
                {redeem.issue_date
                  ? new Date(
                      redeem.issue_date
                    ).toLocaleDateString("en-GB")
                  : "-"}
              </p>
            </div>

            <div className={styles.points}>
              <h4 className={styles.redText}>
                -{redeem.points_used}
              </h4>

              <span>Points</span>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}