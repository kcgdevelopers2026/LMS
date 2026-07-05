"use client";

import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { ENDPOINTS } from "../../../lib/endpoints.js";

/* =========================
   TYPES
========================= */
type Settings = {
  rule: string;
  gold_min_purchase: number;
  silver_min_purchase: number;
  diamond_min_purchase: number;
  gold_bonus_points: number;
  silver_bonus_points: number;
  diamond_bonus_points: number;
};

/* =========================
   COMPONENT
========================= */
export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    rule: "",
    gold_min_purchase: 0,
    silver_min_purchase: 0,
    diamond_min_purchase: 0,
    gold_bonus_points: 0,
    silver_bonus_points: 0,
    diamond_bonus_points: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");

  /* =========================
     FETCH SETTINGS
  ========================= */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch(ENDPOINTS.SETTINGS, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data) {
          setSettings({
            rule: data.rule || "",
            gold_min_purchase: data.gold_min_purchase ?? 0,
            silver_min_purchase: data.silver_min_purchase ?? 0,
            diamond_min_purchase: data.diamond_min_purchase ?? 0,
            gold_bonus_points: data.gold_bonus_points ?? 0,
            silver_bonus_points: data.silver_bonus_points ?? 0,
            diamond_bonus_points: data.diamond_bonus_points ?? 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  /* =========================
     UNLOCK ADMIN SETTINGS
  ========================= */
  const handleUnlock = async () => {
    try {
      const res = await fetch(ENDPOINTS.ADMIN_UNLOCK, {
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
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  /* =========================
     SAVE SETTINGS
  ========================= */
  const handleSave = async () => {
    const confirmSave = window.confirm(
      "Are you sure you want to save these settings?"
    );

    if (!confirmSave) return;

    setSaving(true);

    try {
      const res = await fetch(ENDPOINTS.SETTINGS, {
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

  /* =========================
     LOCK SCREEN
========================= */
  if (!unlocked) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>🔒 Settings Locked</h2>

          <input
            type="password"
            className={styles.input}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          />

          <button className={styles.saveBtn} onClick={handleUnlock}>
            Unlock
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     LOADING
========================= */
  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  /* =========================
     UI
========================= */
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Points Settings</h2>

        {/* RULE */}
        <div className={styles.section}>
          <label>System Rule</label>
          <input
            className={styles.input}
            value={settings.rule}
            onChange={(e) =>
              setSettings({ ...settings, rule: e.target.value })
            }
          />
        </div>

        {/* GOLD */}
        <div className={styles.section}>
          <h3>Gold</h3>

          <label>Min Purchase</label>
          <input
            type="number"
            className={styles.input}
            value={settings.gold_min_purchase}
            onChange={(e) =>
              setSettings({
                ...settings,
                gold_min_purchase: Number(e.target.value),
              })
            }
          />

          <label>Bonus Points</label>
          <input
            type="number"
            className={styles.input}
            value={settings.gold_bonus_points}
            onChange={(e) =>
              setSettings({
                ...settings,
                gold_bonus_points: Number(e.target.value),
              })
            }
          />
        </div>

        {/* SILVER */}
        <div className={styles.section}>
          <h3>Silver</h3>

          <label>Min Purchase</label>
          <input
            type="number"
            className={styles.input}
            value={settings.silver_min_purchase}
            onChange={(e) =>
              setSettings({
                ...settings,
                silver_min_purchase: Number(e.target.value),
              })
            }
          />

          <label>Bonus Points</label>
          <input
            type="number"
            className={styles.input}
            value={settings.silver_bonus_points}
            onChange={(e) =>
              setSettings({
                ...settings,
                silver_bonus_points: Number(e.target.value),
              })
            }
          />
        </div>

        {/* DIAMOND */}
        <div className={styles.section}>
          <h3>Diamond</h3>

          <label>Min Purchase</label>
          <input
            type="number"
            className={styles.input}
            value={settings.diamond_min_purchase}
            onChange={(e) =>
              setSettings({
                ...settings,
                diamond_min_purchase: Number(e.target.value),
              })
            }
          />

          <label>Bonus Points</label>
          <input
            type="number"
            className={styles.input}
            value={settings.diamond_bonus_points}
            onChange={(e) =>
              setSettings({
                ...settings,
                diamond_bonus_points: Number(e.target.value),
              })
            }
          />
        </div>

        {/* SAVE */}
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}