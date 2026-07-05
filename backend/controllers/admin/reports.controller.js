import { supabase } from "../../config/supabase.js";

/* ================= HELPERS ================= */

const isSameDay = (a, b) =>
  new Date(a).toDateString() === new Date(b).toDateString();

const diffDays = (a, b) =>
  Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

const inRange = (date, days, base) =>
  Math.floor((base - new Date(date)) / 86400000) < days;

const sum = (arr) =>
  arr.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

/* ================= MAIN CONTROLLER ================= */

export const getReport = async (req, res) => {
  try {
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const data = purchases || [];

    /* ================= BASE DATE ================= */
    const baseDate = new Date();

    /* ================= FILTER GROUPS ================= */

    const todayData = data.filter((p) =>
      isSameDay(p.purchase_date, baseDate)
    );

    const yesterdayDate = new Date(baseDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterdayData = data.filter((p) =>
      isSameDay(p.purchase_date, yesterdayDate)
    );

    const weekData = data.filter((p) =>
      inRange(p.purchase_date, 7, baseDate)
    );

    const lastWeekData = data.filter((p) => {
      const d = diffDays(new Date(p.purchase_date), baseDate);
      return d > 7 && d <= 14;
    });

    const monthData = data.filter((p) =>
      inRange(p.purchase_date, 30, baseDate)
    );

    const lastMonthData = data.filter((p) => {
      const d = diffDays(new Date(p.purchase_date), baseDate);
      return d > 30 && d <= 60;
    });

    const yearData = data.filter((p) =>
      inRange(p.purchase_date, 365, baseDate)
    );

    const lastYearData = data.filter((p) => {
      const d = diffDays(new Date(p.purchase_date), baseDate);
      return d > 365 && d <= 730;
    });

    /* ================= KPI ================= */

    const kpi = {
      today: { sales: sum(todayData), count: todayData.length },
      week: { sales: sum(weekData), count: weekData.length },
      month: { sales: sum(monthData), count: monthData.length },
      year: { sales: sum(yearData), count: yearData.length },
    };

    /* ================= PERCENT ================= */

    const percent = (curr, prev) => {
      if (curr === 0 && prev === 0) return 0;
      if (prev === 0) return 100;
      return ((curr - prev) / prev) * 100;
    };

    /* ================= COMPARISON ================= */

    const comparison = {
      todayVsYesterday: {
        current: kpi.today.sales,
        previous: sum(yesterdayData),
        percent: percent(kpi.today.sales, sum(yesterdayData)).toFixed(2),
      },
      weekVsLastWeek: {
        current: kpi.week.sales,
        previous: sum(lastWeekData),
        percent: percent(kpi.week.sales, sum(lastWeekData)).toFixed(2),
      },
      monthVsLastMonth: {
        current: kpi.month.sales,
        previous: sum(lastMonthData),
        percent: percent(kpi.month.sales, sum(lastMonthData)).toFixed(2),
      },
      yearVsLastYear: {
        current: kpi.year.sales,
        previous: sum(lastYearData),
        percent: percent(kpi.year.sales, sum(lastYearData)).toFixed(2),
      },
    };

    /* ================= TOP CUSTOMERS ================= */

    const customerMap = {};

    data.forEach((p) => {
      if (!customerMap[p.mobile]) {
        customerMap[p.mobile] = {
          customer_name: p.customer_name,
          mobile: p.mobile,
          count: 0,
          amount: 0,
        };
      }

      customerMap[p.mobile].count += 1;
      customerMap[p.mobile].amount += Number(p.amount || 0);
    });

    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    /* ================= TOP PRODUCTS ================= */

    const productMap = {};

    data.forEach((p) => {
      if (!productMap[p.product]) {
        productMap[p.product] = {
          product: p.product,
          count: 0,
          amount: 0,
        };
      }

      productMap[p.product].count += 1;
      productMap[p.product].amount += Number(p.amount || 0);
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    /* ================= RECENT PURCHASES ================= */

    const recentPurchases = data.slice(0, 5).map((p) => ({
      customer: p.customer_name,
      mobile: p.mobile,
      category: p.tier,
      product: p.product,
      amount: p.amount,
      date: p.created_at,
    }));

    /* ================= FULL EXPORT DATA ================= */

    const customerPurchases = data.map((p) => ({
      customer: p.customer_name,
      mobile: p.mobile,
      bill: p.bill_number,
      category: p.tier,
      product: p.product,
      amount: p.amount,
      reward_points: p.reward_points,
      date: p.purchase_date,
    }));

    /* ================= RESPONSE ================= */

    return res.json({
      success: true,
      kpi,
      comparison,
      topCustomers,
      topProducts,
      recentPurchases,
      customerPurchases,
      totalRecords: data.length,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};