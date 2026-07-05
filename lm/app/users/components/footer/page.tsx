"use client";

import styles from "./footer.module.css";
import { usePathname, useRouter } from "next/navigation";
import { FaCoins, FaCrow, FaCrown } from "react-icons/fa";

import { FaHouse, FaGift, FaUser, FaClock } from "react-icons/fa6";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className={styles.footer}>

      <button
        onClick={() => router.push("/users/pages/homepage")}
        className={`${styles.item} ${
          pathname === "/users/pages/homepage" ? styles.active : ""
        }`}
      >
        <div className={styles.iconBox}>
          <FaHouse className={styles.icon} />
        </div>
        <span>Home</span>
      </button>

      <button
        onClick={() => router.push("/users/pages/rewardspage")}
        className={`${styles.item} ${
          pathname === "/users/pages/rewardspage" ? styles.active : ""
        }`}
      >
        <div className={styles.iconBox}>
          <FaGift className={styles.icon} />
        </div>
        <span>Rewards</span>
      </button>

      <button
        onClick={() => router.push("/users/pages/purchasehis")}
        className={`${styles.item} ${
          pathname === "/users/pages/purchasehis" ? styles.active : ""
        }`}
      >
        <div className={styles.iconBox}>
          <FaClock className={styles.icon} />
        </div>
        <span>History</span>
      </button>

      <button
        onClick={() => router.push("/users/pages/contestpage")}
        className={`${styles.item} ${
          pathname === "/users/pages/contestpage" ? styles.active : ""
        }`}
      >
        <div className={styles.iconBox}>
          <FaCrown className={styles.icon} />
        </div>
        <span>Contest</span>
      </button>

      <button
        onClick={() => router.push("/users/pages/profile")}
        className={`${styles.item} ${
          pathname === "/users/pages/profile" ? styles.active : ""
        }`}
      >
        <div className={styles.iconBox}>
          <FaUser className={styles.icon} />
        </div>
        <span>Profile</span>
      </button>

    </nav>
  );
}