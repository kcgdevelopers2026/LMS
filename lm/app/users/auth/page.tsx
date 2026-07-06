"use client";

import { useState } from "react";
import styles from "./auth.module.css";
import { FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "../../lib/endpoints.js";

export default function LoginPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleLogin = async () => {
  setError("");

  if (mobile.length !== 10) {
    setError("Please enter a valid 10-digit mobile number.");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(ENDPOINTS.CUSTOMER_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile }),
    });

    const result = await res.json();

    if (!res.ok) {
      setError(result.message || "Login failed");
      return;
    }

    // ✅ SAVE TOKEN (IMPORTANT FIX)
    localStorage.setItem("customerToken", result.token);

    router.push("/users/pages/homepage");

  } catch (err) {
    console.error(err);
    setError("Unable to connect to server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className={styles.container}>
      <div className={styles.overlay}>
        <section className={styles.content}>
          <span className={styles.badge}>
            ✦ Exclusive Member Login
          </span>

          <h1 className={styles.title}>
            Welcome Back
          </h1>

          <p className={styles.subtitle}>
            Sign in to access your loyalty rewards,
            exclusive offers and premium jewellery benefits.
          </p>

          <div className={styles.inputBox}>
            <div className={styles.country}>
              <FaPhoneAlt />
              <span>+91</span>
            </div>

            <input
              type="tel"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, ""))
              }
              required
              maxLength={10}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#ff4d4f",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <button
            className={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Continue"}
            {!loading && <FaArrowRight />}
          </button>

          <div className={styles.secure}>
            <IoShieldCheckmarkOutline />
            <span>Secure Login</span>
          </div>
        </section>
      </div>
    </main>
  );
}