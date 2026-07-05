import jwt from "jsonwebtoken";

export const customerAuth = (req, res, next) => {
  try {
    console.log("ALL COOKIES:", req.cookies); // 🔥 IMPORTANT

    const token = req.cookies?.customerToken;
    console.log("TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded); // 🔥 VERY IMPORTANT

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload (no id)",
      });
    }

    req.customer = {
      id: decoded.id,
    };

    console.log("REQ CUSTOMER:", req.customer); // 🔥 FINAL CHECK

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};