import { supabase } from "../../config/supabase.js";

/* =========================================================
   🟦 CONTESTS
========================================================= */

// GET ALL CONTESTS
export const getContests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// CREATE CONTEST
export const createContest = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      start_date,
      end_date,
      prize_text,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from("contests")
      .insert([
        {
          title,
          description,
          type: type || "monthly",
          start_date,
          end_date,
          prize_text,
          status: status || "draft",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// GET CONTEST BY ID
export const getContestById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   🟨 CONTEST FIELDS (FORM BUILDER)
========================================================= */

// ADD FIELDS
export const addFields = async (req, res) => {
  try {
    const { contest_id, fields } = req.body;

    if (!contest_id || !fields?.length) {
      return res.status(400).json({
        success: false,
        message: "contest_id and fields required",
      });
    }

    const rows = fields.map((f, index) => ({
      contest_id,
      label: f.label,
      field_key: f.field_key || f.label.toLowerCase().replace(/\s+/g, "_"),
      type: f.type,
      is_required: f.is_required ?? true,
      order_index: index,
    }));

    const { data, error } = await supabase
      .from("contest_fields")
      .insert(rows)
      .select();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// GET FIELDS
export const getFields = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contest_fields")
      .select("*")
      .eq("contest_id", id)
      .order("order_index", { ascending: true });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   🟩 ENTRIES (PARTICIPANTS)
========================================================= */

// GET ENTRIES
export const getEntries = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contest_entries")
      .select(`
        id,
        data,
        created_at,
        customer:customers (
          id,
          name,
          email,
          mobile
        )
      `)
      .eq("contest_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// GET SINGLE ENTRY
export const getEntryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contest_entries")
      .select(`
        *,
        customer:customers (
          id,
          name,
          email,
          mobile
        )
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// DELETE ENTRY
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("contest_entries")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Entry deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================================================
   🟥 WINNER SYSTEM (FIXED - ENTRY BASED)
========================================================= */

// SELECT WINNER
export const selectWinner = async (req, res) => {
  try {
    const { contest_id, customer_id } = req.body;

    if (!contest_id || !customer_id) {
      return res.status(400).json({
        success: false,
        message: "contest_id and customer_id required",
      });
    }

    // check if already winner exists
    const { data: existing } = await supabase
      .from("contest_winners")
      .select("id")
      .eq("contest_id", contest_id)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Winner already selected",
      });
    }

    const { data, error } = await supabase
      .from("contest_winners")
      .insert([
        {
          contest_id,
          customer_id,
          selected_at: new Date(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.json({
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


// GET WINNER
export const getWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("contest_winners")
      .select(`
        id,
        selected_at,
        customer:customers (
          id,
          name,
          email,
          mobile
        ),
        contest:contests (
          id,
          title,
          prize_text
        )
      `)
      .eq("contest_id", id)
      .single();

    if (error) throw error;

    return res.json({
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


// REMOVE WINNER
export const removeWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("contest_winners")
      .delete()
      .eq("contest_id", id);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Winner removed",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};