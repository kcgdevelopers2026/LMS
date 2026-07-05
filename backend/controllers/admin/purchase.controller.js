import { supabase } from "../../config/supabase.js";

/* =========================
   CREATE PURCHASE
========================= */
export const createPurchase = async (req, res) => {
  try {
    console.log("REQUEST BODY:", req.body);

    const {
      customer_id, // UUID (IMPORTANT)
      customer_name,
      mobile,
      card_no,
      tier,
      product,
      product_image,
      bill_number,
      amount,
      reward_points,
      purchase_date,
      notes,
    } = req.body;

    // VALIDATION
    if (!customer_id || !bill_number || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "customer_id, bill_number, amount are required",
      });
    }

    const { data, error } = await supabase
      .from("purchases")
      .insert([
        {
          customer_id,
          customer_name,
          mobile,
          card_no,
          tier,
          product,
          product_image,
          bill_number,
          amount,
          reward_points,
          purchase_date,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("SUPABASE INSERT ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.status(201).json({
      success: true,
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
   GET ALL PURCHASES
========================= */
export const getPurchases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
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
   GET PURCHASES BY CUSTOMER (UUID)
========================= */
export const getPurchaseByCustomer = async (req, res) => {
  try {
    const customer_id = req.params.customer_uuid; // MUST MATCH ROUTE

    console.log("PARAMS:", req.params);

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
        error,
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