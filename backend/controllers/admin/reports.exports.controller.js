import ExcelJS from "exceljs";
import { supabase } from "../../config/supabase.js";

const diffDays = (a, b) =>
  Math.floor((new Date(b) - new Date(a)) / 86400000);

export const exportFullReport = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = data || [];

    /* ================= EXCEL ================= */
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Full Report");

    sheet.columns = [
      { header: "Date", key: "date", width: 18 },
      { header: "Customer", key: "customer", width: 20 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Category", key: "category", width: 12 },
      { header: "Product", key: "product", width: 20 },
      { header: "Bill No", key: "bill", width: 15 },
      { header: "Amount", key: "amount", width: 12 },
      { header: "Reward Points", key: "points", width: 15 },
    ];

    rows.forEach((p) => {
      sheet.addRow({
        date: p.purchase_date,
        customer: p.customer_name,
        mobile: p.mobile,
        category: p.tier,
        product: p.product,
        bill: p.bill_number,
        amount: p.amount,
        points: p.reward_points,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=full-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const exportTopCustomers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("purchases")
      .select("*");

    if (error) throw error;

    const map = {};

    data.forEach((p) => {
      if (!map[p.mobile]) {
        map[p.mobile] = {
          customer: p.customer_name,
          mobile: p.mobile,
          count: 0,
          amount: 0,
        };
      }

      map[p.mobile].count += 1;
      map[p.mobile].amount += Number(p.amount || 0);
    });

    const rows = Object.values(map).sort(
      (a, b) => b.amount - a.amount
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Top Customers");

    sheet.columns = [
      { header: "Customer", key: "customer", width: 20 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Count", key: "count", width: 10 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    rows.forEach((r) => sheet.addRow(r));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=top-customers.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};