import { supabase } from "../../../config/supabase.js";
import jwt from "jsonwebtoken";

/* =========================
   CUSTOMER LOGIN (JWT HEADER SYSTEM)
========================= */
export const customerLogin = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("mobile", mobile)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // ✅ CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: customer.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ❌ REMOVE COOKIE (IMPORTANT)
    // res.cookie(...) ← DELETE THIS

    // ✅ SEND TOKEN TO FRONTEND
    return res.json({
      success: true,
      message: "Login successful",
      token,   // 👈 IMPORTANT CHANGE

      customer: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        customer_id: customer.customer_id,
        card_no: customer.card_no,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   CUSTOMER LOGOUT (UPDATED)
========================= */
export const customerLogout = (req, res) => {
  // JWT system → no cookie to clear
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};