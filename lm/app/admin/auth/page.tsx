"use client";

import { useState } from "react";
import styles from "./auth.module.css";
import { FaGem, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../../lib/api.js";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      alert("Login successful");

      window.location.href = "/admin/pages/dashboard";
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      {/* LEFT PANEL */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <FaGem />
        </div>

        <h1>JEWEL LOYALTY</h1>
        <h3>ADMIN PANEL</h3>

        <p>Manage members, purchases and reward points easily.</p>

        <div className={styles.rings}>💍</div>
      </div>

      {/* RIGHT PANEL */}
      <div className={styles.right}>
        <h2>Welcome Back!</h2>
        <span>Please login to your account.</span>

        {/* EMAIL */}
        <label>Email</label>
        <div className={styles.inputBox}>
          <FaUser />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <label>Password</label>
        <div className={styles.inputBox}>
          <FaLock />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.copy}>© 2025 Jewel Loyalty System</p>
      </div>
    </main>
  );
}