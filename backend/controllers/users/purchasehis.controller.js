import { supabase } from "../../config/supabase.js";

export const getCustomerPurchases = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("customer_id", customerId)
      .order("purchase_date", { ascending: false });

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