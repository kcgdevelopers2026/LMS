import { supabase } from "../../config/supabase.js";

export const getDashboard = async (req, res) => {
  try {
    const [
      customersRes,
      shopsRes,
      purchasesRes,
      redeemsRes
    ] = await Promise.all([
      supabase.from("customers").select("*"),
      supabase.from("partner_shops").select("*"),
      supabase.from("purchases").select("*"),
      supabase.from("redeems").select("*"),
    ]);

    const customers = customersRes.data || [];
    const shops = shopsRes.data || [];
    const purchases = purchasesRes.data || [];
    const redeems = redeemsRes.data || [];

    // =========================
    // CALCULATIONS
    // =========================
    const totalSales = purchases.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    );

    const totalPointsIssued = purchases.reduce(
      (sum, p) => sum + Number(p.reward_points || 0),
      0
    );

    const totalPointsUsed = redeems.reduce(
      (sum, r) => sum + Number(r.points_used || 0),
      0
    );

    const currentPoints = totalPointsIssued - totalPointsUsed;

    return res.json({
      success: true,
      data: {
        stats: {
          customers: customers.length,
          shops: shops.length,
          purchases: purchases.length,
          redeems: redeems.length,
          totalSales,
          totalPointsIssued,
          totalPointsUsed,
          currentPoints,
        },
        recentCustomers: customers.slice(-5).reverse(),
        recentPurchases: purchases.slice(-5).reverse(),
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};