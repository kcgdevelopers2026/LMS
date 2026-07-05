import jwt from "jsonwebtoken";

/* =========================
   AUTH MIDDLEWARE
   (LOGIN CHECK)
========================= */
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   ADMIN ONLY MIDDLEWARE
   (ROLE CHECK)
========================= */
export const onlyAdmin = (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};