"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import styles from "./profile.module.css";
import {
  FaCalendar,
  FaTrophy,
  FaGem,
  FaMobileScreen,
  FaTicket,
  FaGlobe,
  FaPhone,
  FaArrowRightFromBracket,
} from "react-icons/fa6";

import Link from "next/link";

import { ENDPOINTS } from "../../../lib/endpoints.js";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("customerToken");

    if (!token) {
      router.push("/users/auth/");
      return;
    }

    const res = await fetch(ENDPOINTS.CUSTOMER_PROFILE, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    const result = await res.json();

    if (result?.success) {
      setProfile(result.data);
    } else {
      router.push("/users/auth/");
    }
  } catch (err) {
    console.log(err);
  }
};

  /* =========================
     LOGOUT (REAL)
  ========================= */
const handleLogout = () => {
  localStorage.removeItem("customerToken");
  router.push("/users/auth/");
};

  return (
    <main className={styles.container}>

      {/* PROFILE CARD */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          <FaUser />
        </div>

        <div className={styles.profileInfo}>
          <h2>{profile?.name || "-"}</h2>
          <p>📞 {profile?.mobile || "-"}</p>
        </div>
      </div>

      {/* DETAILS */}
      <div className={styles.detailsCard}>

        <div className={styles.row}>
          <FaCalendar className={styles.icon} />
          <span>Member Since</span>
          <strong>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-GB")
              : "-"}
          </strong>
        </div>

        <div className={styles.row}>
          <FaTrophy className={styles.icon} />
          <span>Total Earned</span>
          <strong>{profile?.totalEarned || 0}</strong>
        </div>

        <div className={styles.row}>
          <FaGem className={styles.icon} />
          <span>Available Points</span>
          <strong>{profile?.availablePoints || 0}</strong>
        </div>

      </div>

      {/* APP */}
      <div className={styles.card}>
        <FaMobileScreen className={styles.icon} />
        <div>
          <h4>Official App</h4>
          <p>Explore latest gold offers</p>
        </div>
      </div>

      {/* CONTEST */}
      <Link href="/users/pages/contestpage/">
  <div className={styles.card}>
    <FaTicket className={styles.icon} />
    <div>
      <h4>Contest Zone</h4>
      <p>Win exciting gold rewards</p>
    </div>
  </div>
</Link>
      {/* WEBSITE */}
      <div className={styles.infoBox}>
        <FaGlobe className={styles.icon} />
        <div>
          <h4>Official Website</h4>
          <p>www.yourbrand.com</p>
        </div>
      </div>

      {/* CALL */}
      <div className={styles.infoBox}>
        <FaPhone className={styles.icon} />
        <div>
          <h4>Customer Care</h4>
          <p>1800-123-4567</p>
        </div>
      </div>

      {/* LOGOUT */}
      <button className={styles.logoutBtn} onClick={handleLogout}>
        <FaArrowRightFromBracket />
        Logout
      </button>

    </main>
  );
}