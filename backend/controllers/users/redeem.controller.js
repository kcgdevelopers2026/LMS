import { supabase } from "../../config/supabase.js";

export const getCustomerRedeems = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const { data, error } = await supabase
      .from("redeems")
      .select(`
  id,
  coupon_value,
  points_used,
  current_points,
  remaining_points,
  issue_date,
  created_at,
  shop_id,
  partner_shops (
    name,
    category,
    image
  )
`)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
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