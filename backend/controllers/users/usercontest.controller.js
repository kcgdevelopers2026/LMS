import { supabase } from "../../config/supabase.js";

/* =========================================================
   🟦 ACTIVE CONTESTS
========================================================= */
export const getActiveContest = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("contests")
      .select("id, title, description, status, start_date, end_date, prize_text")
      .eq("status", "active")
      .lte("start_date", today)
      .gte("end_date", today)
      .order("created_at", { ascending: false });

    if (error) throw error;

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

/* =========================================================
   🟩 JOIN CONTEST (NO FORM, SIMPLE SAVE)
========================================================= */
export const joinContest = async (req, res) => {
  try {
    const customer_id = req.customer?.id;
    const { contest_id } = req.body;

    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!contest_id) {
      return res.status(400).json({
        success: false,
        message: "contest_id required",
      });
    }

    // 🔥 get customer details
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("id, name, email, mobile")
      .eq("id", customer_id)
      .single();

    if (custErr || !customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // 🔥 check duplicate entry
    const { data: existing } = await supabase
      .from("contest_entries")
      .select("id")
      .eq("contest_id", contest_id)
      .eq("customer_id", customer_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already joined",
      });
    }

    // 🔥 insert entry (FULL DATA SAVED)
    const { error } = await supabase
      .from("contest_entries")
      .insert([
        {
          contest_id,
          customer_id,
          data: {
            name: customer.name,
            email: customer.email,
            mobile: customer.mobile,
            joined_at: new Date().toISOString(),
          },
        },
      ]);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Contest joined successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   🟪 MY CONTEST HISTORY
========================================================= */
export const myContests = async (req, res) => {
  try {
    const customer_id = req.customer?.id;

    if (!customer_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { data, error } = await supabase
      .from("contest_entries")
      .select(`
        id,
        data,
        created_at,
        contests (
          id,
          title,
          prize_text,
          status,
          start_date,
          end_date
        )
      `)
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

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