import { supabase } from "../../config/supabase.js";

/* =========================
   GET SETTINGS
========================= */
export const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE SETTINGS
========================= */
export const updateSettings = async (req, res) => {
  try {
    const {
      rule,
      gold_min_purchase,
      silver_min_purchase,
      diamond_min_purchase,        // 🔥 ADDED
      gold_bonus_points,
      silver_bonus_points,
      diamond_bonus_points,        // 🔥 ADDED
    } = req.body;

    if (!rule) {
      return res.status(400).json({
        field: "rule",
        message: "Rule is required",
      });
    }

    const updateData = {
      rule,
      gold_min_purchase,
      silver_min_purchase,
      diamond_min_purchase,       // 🔥 ADDED
      gold_bonus_points,
      silver_bonus_points,
      diamond_bonus_points,       // 🔥 ADDED
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("settings")
      .update(updateData)
      .eq("id", "DEFAULT")
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        field: "general",
        message: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Settings updated successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      field: "general",
      message: err.message,
    });
  }
};


