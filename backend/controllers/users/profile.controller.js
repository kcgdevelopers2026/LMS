import { supabase } from "../../config/supabase.js";

/* =========================
   GET CUSTOMER PROFILE
   (JWT HEADER SYSTEM)
========================= */
export const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.customer?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // GET CUSTOMER
    const { data: customer, error: cErr } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (cErr || !customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // TOTAL POINTS EARNED
    const { data: purchases } = await supabase
      .from("purchases")
      .select("reward_points")
      .eq("customer_id", customerId);

    // TOTAL POINTS USED
    const { data: redeems } = await supabase
      .from("redeems")
      .select("points_used")
      .eq("customer_id", customerId);

    const totalEarned = (purchases || []).reduce(
      (a, b) => a + Number(b.reward_points || 0),
      0
    );

    const totalUsed = (redeems || []).reduce(
      (a, b) => a + Number(b.points_used || 0),
      0
    );

    const availablePoints = totalEarned - totalUsed;

    return res.json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        created_at: customer.created_at,
        totalEarned,
        availablePoints,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};