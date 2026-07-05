import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/* =========================
   ADMIN ROUTES
========================= */
import adminRoutes from "./routes/admin/auth/auth.routes.js";
import customerRoutes from "./routes/admin/customer.routes.js";
import settingsRoutes from "./routes/admin/settings.routes.js";
import purchaseRoutes from "./routes/admin/purchase.routes.js";
import partnerShopRoutes from "./routes/admin/partner.routes.js";
import adminRedeemRoutes from "./routes/admin/redeem.routes.js";
import dashboardRoutes from "./routes/admin/dashboard.routes.js";
import reportRoutes from "./routes/admin/reports.routes.js";
import adminUnlockRoutes from "./routes/admin/adminUnlock.routes.js";

/* =========================
   CUSTOMER / USER ROUTES
========================= */
import customerAuthRoutes from "./routes/users/auth/auth.routes.js";
import customerHomeRoutes from "./routes/users/home.routes.js";
import customerPurchaseRoutes from "./routes/users/purchasehis.routes.js";
import customerRewardsRoutes from "./routes/users/rewards.routes.js";
import customerProfileRoutes from "./routes/users/profile.routes.js";
import userRedeemRoutes from "./routes/users/redeem.routes.js";

/* =========================
   CONTEST ROUTES
========================= */
import adminContestRoutes from "./routes/admin/admincontest.routes.js";
import userContestRoutes from "./routes/users/usercontest.routes.js";

/* =========================
   INIT APP
========================= */
const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* =========================
   ADMIN API ROUTES
========================= */
app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/shops", partnerShopRoutes);
app.use("/api/redeems", adminRedeemRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/reports", reportRoutes);
app.use("/api/admin", adminUnlockRoutes);

/* =========================
   CUSTOMER API ROUTES
========================= */
app.use("/api/customer", customerAuthRoutes);
app.use("/api/customer/home", customerHomeRoutes);
app.use("/api/customer", customerPurchaseRoutes);
app.use("/api/customer/rewards", customerRewardsRoutes);

/* =========================
   USER PROFILE + REDEEM
========================= */
app.use("/api/customer/profile", customerProfileRoutes);
app.use("/api/user", userRedeemRoutes);

/* =========================
   CONTEST API (IMPORTANT FIX)
========================= */
app.use("/api/admin/contests", adminContestRoutes);
app.use("/api/user/contests", userContestRoutes);

/* =========================
   EXPORT APP
========================= */
export default app;
