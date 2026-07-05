import { supabase } from "../../../config/supabase.js";
import jwt from "jsonwebtoken";

/* =========================
   CUSTOMER LOGIN
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

    const token = jwt.sign(
      {
        id: customer.id,
        
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("customerToken", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
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
   CUSTOMER LOGOUT
========================= */
export const customerLogout = (req, res) => {

  res.clearCookie("customerToken");

  return res.json({
    success: true,
    message: "Logged out successfully",
  });

};