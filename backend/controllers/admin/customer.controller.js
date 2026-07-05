import { supabase } from "../../config/supabase.js";

/* =========================
   GET ALL CUSTOMERS
========================= */
export const getCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET SINGLE CUSTOMER (UUID ONLY)
========================= */
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE CUSTOMER
========================= */
export const createCustomer = async (req, res) => {
  try {
    const { name, mobile, email, address } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and mobile required" });
    }

    // get sequence number
    const { data: num, error: seqError } =
      await supabase.rpc("get_next_customer_number");

    if (seqError) {
      return res.status(500).json(seqError);
    }

    // generate IDs
    const customer_id = `KCG${num}`;
    const card_no = `KCG${String(num).padStart(9, "0")}`;

    // insert into DB
    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          customer_id,
          card_no,
          name,
          mobile,
          email,
          address,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("INSERT ERROR:", error);
      return res.status(500).json(error);
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE CUSTOMER (UUID ONLY)
========================= */
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, address } = req.body;

    const { data, error } = await supabase
      .from("customers")
      .update({ name, mobile, email, address })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE CUSTOMER (UUID ONLY)
========================= */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE ALL CUSTOMERS
========================= */
export const deleteAllCustomers = async (req, res) => {
  try {
    const { error } = await supabase
      .from("customers")
      .delete()
      .gte("created_at", "1900-01-01");

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.json({ message: "All customers deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getCustomerByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("mobile", mobile); // ⚠️ confirm column name

    if (error) {
      console.log("SUPABASE ERROR:", error);
      return res.status(500).json({ message: error.message });
    }

    return res.json({ data: data?.[0] || null });
  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getCustomerPointsByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile required" });
    }

    // 1. GET CUSTOMER
    const { data: customer, error: cErr } = await supabase
      .from("customers")
      .select("*")
      .eq("mobile", mobile)
      .single();

    if (cErr || !customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer_id = customer.id; // ✅ UUID

    // 2. TOTAL EARNED (FIXED)
    const { data: purchases } = await supabase
      .from("purchases")
      .select("reward_points")
      .eq("customer_id", customer_id); // ✅ FIXED

    // 3. TOTAL USED (FIXED)
    const { data: redeems } = await supabase
      .from("redeems")
      .select("points_used")
      .eq("customer_id", customer_id); // ✅ FIXED

    const total_earned = (purchases || []).reduce(
      (sum, p) => sum + Number(p.reward_points || 0),
      0
    );

    const total_used = (redeems || []).reduce(
      (sum, r) => sum + Number(r.points_used || 0),
      0
    );

    const current_points = total_earned - total_used;

    return res.json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        card_no: customer.card_no,
        current_points,
        total_earned,
        total_used,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};