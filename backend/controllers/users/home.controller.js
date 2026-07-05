import { supabase } from "../../config/supabase.js";

/* =========================
   CUSTOMER HOME
========================= */
export const getCustomerHome = async (req, res) => {
  try {
    const customerId = req.customer.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized customer",
      });
    }

    /* =========================
       CUSTOMER
    ========================== */
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customerId)
      .single();

    if (customerError || !customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    /* =========================
       PURCHASES (FULL DATA FOR CALCULATION)
    ========================== */
    const { data: purchases, error: purchaseError } = await supabase
      .from("purchases")
      .select("id, reward_points, product, amount, bill_number, purchase_date, product_image, tier")
      .eq("customer_id", customerId)
      .order("purchase_date", { ascending: false });

    if (purchaseError) {
      return res.status(500).json({
        success: false,
        message: purchaseError.message,
      });
    }

    /* =========================
       REDEEMS (FULL DATA FOR CALCULATION)
    ========================== */
    const { data: redeems, error: redeemError } = await supabase
      .from("redeems")
      .select(`
        id,
        points_used,
        coupon_value,
        issue_date,
        partner_shops (
          name,
          category,
          image
        )
      `)
      .eq("customer_id", customerId)
      .order("issue_date", { ascending: false });

    if (redeemError) {
      return res.status(500).json({
        success: false,
        message: redeemError.message,
      });
    }

    /* =========================
       POINTS CALCULATION (FULL DATA)
    ========================== */
    const totalEarned = (purchases || []).reduce((sum, p) => {
      return sum + Number(p.reward_points || 0);
    }, 0);

    const totalUsed = (redeems || []).reduce((sum, r) => {
      return sum + Number(r.points_used || 0);
    }, 0);

    const currentPoints = totalEarned - totalUsed;

    /* =========================
       RESPONSE
    ========================== */
    return res.json({
      success: true,
      data: {
        customer: {
          id: customer.id,
          customer_id: customer.customer_id,
          card_no: customer.card_no,
          name: customer.name,
          mobile: customer.mobile,
          email: customer.email,
          address: customer.address,
          joining_date: customer.created_at,
        },

        current_points: currentPoints,
        total_earned: totalEarned,
        total_used: totalUsed,

        recentPurchases: purchases || [],
        recentRedeems: redeems || [],
      },
    });
  } catch (err) {
    console.log("HOME ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};