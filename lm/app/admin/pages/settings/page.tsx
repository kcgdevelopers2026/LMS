"use client";

import { useEffect, useState } from "react";
import styles from "./settings.module.css";

const API_URL = "http://localhost:5001/api/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    rule: "",
    gold_min_purchase: 0,
    silver_min_purchase: 0,
    diamond_min_purchase: 0,   // 🔥 ADDED
    gold_bonus_points: 0,
    silver_bonus_points: 0,
    diamond_bonus_points: 0,   // 🔥 ADDED
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [unlocked, setUnlocked] = useState(false);
const [password, setPassword] = useState("");
  /* =========================
     LOAD SETTINGS
  ========================= */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data) {
          setSettings({
            rule: data.rule || "",
            gold_min_purchase: data.gold_min_purchase ?? 0,
            silver_min_purchase: data.silver_min_purchase ?? 0,
            diamond_min_purchase: data.diamond_min_purchase ?? 0, // 🔥 ADDED
            gold_bonus_points: data.gold_bonus_points ?? 0,
            silver_bonus_points: data.silver_bonus_points ?? 0,
            diamond_bonus_points: data.diamond_bonus_points ?? 0, // 🔥 ADDED
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

 const handleUnlock = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/admin/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Incorrect password");
      return;
    }

    setUnlocked(true);
    setPassword(""); // optional cleanup
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  /* =========================
     SAVE SETTINGS (WITH CONFIRM)
  ========================= */
  const handleSave = async () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save these settings?"
    );

    if (!confirmSave) return;

    setSaving(true);

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save settings");
        return;
      }

      alert("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

 


  if (!unlocked) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🔒 Settings Locked</h2>

        <input
          className={styles.input}
          type="password"
          placeholder="Enter Settings Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUnlock();
            }
          }}
        />

        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleUnlock}
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}


 if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Points Settings</h2>

        {/* RULE */}
        <div className={styles.ruleBox}>
          <div className={styles.ruleTitle}>System Rule</div>

          <input
            className={styles.input}
            value={settings.rule}
            onChange={(e) => handleChange("rule", e.target.value)}
          />
        </div>

        {/* GOLD */}
        <div className={styles.section}>
          <h3>Gold Customers</h3>

          <label>Minimum Purchase (₹)</label>
          <input
            className={styles.input}
            type="number"
            value={settings.gold_min_purchase}
            onChange={(e) =>
              handleChange("gold_min_purchase", Number(e.target.value))
            }
          />

          <label>Bonus Points</label>
          <input
            className={styles.input}
            type="number"
            value={settings.gold_bonus_points}
            onChange={(e) =>
              handleChange("gold_bonus_points", Number(e.target.value))
            }
          />

          <div className={styles.note}>
            Gold → <b>{settings.gold_bonus_points}</b> pts after ₹
            {settings.gold_min_purchase}
          </div>
        </div>

        {/* SILVER */}
        <div className={styles.section}>
          <h3>Silver Customers</h3>

          <label>Minimum Purchase (₹)</label>
          <input
            className={styles.input}
            type="number"
            value={settings.silver_min_purchase}
            onChange={(e) =>
              handleChange("silver_min_purchase", Number(e.target.value))
            }
          />

          <label>Bonus Points</label>
          <input
            className={styles.input}
            type="number"
            value={settings.silver_bonus_points}
            onChange={(e) =>
              handleChange("silver_bonus_points", Number(e.target.value))
            }
          />

          <div className={styles.note}>
            Silver → <b>{settings.silver_bonus_points}</b> pts after ₹
            {settings.silver_min_purchase}
          </div>
        </div>

        {/* 💎 DIAMOND (ADDED) */}
        <div className={styles.section}>
          <h3>Diamond Customers</h3>

          <label>Minimum Purchase (₹)</label>
          <input
            className={styles.input}
            type="number"
            value={settings.diamond_min_purchase}
            onChange={(e) =>
              handleChange("diamond_min_purchase", Number(e.target.value))
            }
          />

          <label>Bonus Points</label>
          <input
            className={styles.input}
            type="number"
            value={settings.diamond_bonus_points}
            onChange={(e) =>
              handleChange("diamond_bonus_points", Number(e.target.value))
            }
          />

          <div className={styles.note}>
            Diamond → <b>{settings.diamond_bonus_points}</b> pts after ₹
            {settings.diamond_min_purchase}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}