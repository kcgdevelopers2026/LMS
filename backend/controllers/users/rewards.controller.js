import { supabase } from "../../config/supabase.js";

/* =========================
   GET CUSTOMER REWARDS (SHOPS)
========================= */
export const getCustomerRewards = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("partner_shops")
      .select("id, name, category, coupons, image, status")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // map DB → frontend format
    const formatted = (data || []).map((shop) => ({
      id: shop.id,
      name: shop.name,
      category: shop.category,
      image: shop.image,
      points_required: Number(shop.coupons), // 🔥 FIX HERE
      description: `${shop.coupons} pts redemption offer`,
    }));

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};