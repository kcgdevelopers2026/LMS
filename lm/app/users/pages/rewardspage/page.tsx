"use client";

import { useEffect, useState } from "react";
import styles from "./rewardspage.module.css";
import { FaGem } from "react-icons/fa6";

import { ENDPOINTS } from "../../../lib/endpoints.js";



type Shop = {
  id: string;
  name: string;
  category: string;
  image: string;
  points_required: number;
  description: string;
};

export default function RewardsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    fetchRewards();
    fetchPoints();
  }, []);
const fetchRewards = async () => {
  try {
    const res = await fetch(ENDPOINTS.CUSTOMER_REWARDS, {
      credentials: "include",
    });

    const result = await res.json();

    if (result.success) {
      setShops(result.data);
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchPoints = async () => {
  try {
    const res = await fetch(ENDPOINTS.CUSTOMER_HOME, {
      credentials: "include",
    });

    const result = await res.json();

    if (result.success) {
      setPoints(result.data.current_points);
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <main className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <div>
          <h1>Rewards</h1>
          <p>Unlock premium offers with your points</p>
        </div>

        <div className={styles.points}>
          <FaGem />
          <div>
            <strong>{points}</strong>
            <span>Points</span>
          </div>
        </div>
      </header>

      {/* LIST */}
      <section className={styles.list}>
        {shops.map((shop) => (
          <div className={styles.card} key={shop.id}>
            {/* LEFT IMAGE FULL HEIGHT */}
            <div className={styles.imageBox}>
              <img src={shop.image} alt={shop.name} />
            </div>

            {/* RIGHT CONTENT */}
            <div className={styles.info}>
              <h3>{shop.name}</h3>
              <p className={styles.category}>{shop.category}</p>
              <p className={styles.price}>{shop.points_required} pts</p>
              <p className={styles.desc}>{shop.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* COMING SOON */}
      <div className={styles.comingSoon}>
        <div className={styles.gift}>🎁</div>
        <div>
          <h4>More rewards coming soon</h4>
          <p>Exclusive drops & premium offers</p>
        </div>
      </div>
    </main>
  );
}