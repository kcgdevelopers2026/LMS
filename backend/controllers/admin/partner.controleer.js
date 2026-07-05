import { supabase } from "../../config/supabase.js";

/* =========================
   CREATE SHOP
========================= */
export const createShop = async (req, res) => {
  try {
    const { name, category, coupons, image, status } = req.body;

    if (!name || !category || !coupons) {
      return res.status(400).json({
        message: "Name, category, coupons required",
      });
    }

    const { data, error } = await supabase
      .from("partner_shops")
      .insert([
        {
          name,
          category,
          coupons,
          image,
          status: status || "Active",
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL SHOPS
========================= */
export const getShops = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("partner_shops")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE SHOP
========================= */
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, coupons, image, status } = req.body;

    const { data, error } = await supabase
      .from("partner_shops")
      .update({
        name,
        category,
        coupons,
        image,
        status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE SHOP
========================= */
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("partner_shops")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};