import { supabase } from "../../config/supabase.js";

/* =========================
   GET CUSTOMER POINTS
========================= */
const getCustomerPoints = async (customer_id) => {
  if (!customer_id) throw new Error("customer_id required");

  // TOTAL EARNED FROM PURCHASES
  const { data: purchases, error: pErr } = await supabase
    .from("purchases")
    .select("reward_points")
    .eq("customer_id", customer_id);

  if (pErr) throw new Error(pErr.message);

  // TOTAL USED FROM REDEEMS
  const { data: redeems, error: rErr } = await supabase
    .from("redeems")
    .select("points_used")
    .eq("customer_id", customer_id);

  if (rErr) throw new Error(rErr.message);

  const totalEarned = (purchases || []).reduce(
    (sum, p) => sum + Number(p.reward_points || 0),
    0
  );

  const totalUsed = (redeems || []).reduce(
    (sum, r) => sum + Number(r.points_used || 0),
    0
  );

  return {
    totalEarned,
    totalUsed,
    currentPoints: totalEarned - totalUsed,
  };
};

/* =========================
   CREATE REDEEM
========================= */
export const createRedeem = async (req, res) => {
  try {
    console.log("REDEEM REQUEST:", req.body);

    const {
      customer_id,
      customer_name,
      mobile,
      card_no,
      shop_id,
      coupon_value,
     
    } = req.body;

    const pointsToRedeem = Number(coupon_value);

    // VALIDATION
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "customer_id is required",
      });
    }

    if (!pointsToRedeem || pointsToRedeem <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon value",
      });
    }

    // GET CURRENT POINTS
    const points = await getCustomerPoints(customer_id);

    if (points.currentPoints < pointsToRedeem) {
      return res.status(400).json({
        success: false,
        message: "Not enough points",
        currentPoints: points.currentPoints,
        required: pointsToRedeem,
      });
    }

    const remaining_points =
      points.currentPoints - pointsToRedeem;

    // INSERT REDEEM
    const { data, error } = await supabase
      .from("redeems")
      .insert([
        {
          customer_id,
          customer_name,
          mobile,
          card_no,
          shop_id,
          coupon_value: pointsToRedeem,
          points_used: pointsToRedeem,
          current_points: points.currentPoints,
          remaining_points
          
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Redeem successful",
      data,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET ALL REDEEMS
========================= */
export const getRedeems = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("redeems")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET REDEEMS BY CUSTOMER
========================= */
export const getRedeemsByCustomer = async (req, res) => {
  try {
    const customer_id = req.params.customer_id;

    const { data, error } = await supabase
  .from("redeems")
  .select(`
    *,
    partner_shops (
      name,
      category
    )
  `)
  .eq("customer_id", customer_id)
  .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};