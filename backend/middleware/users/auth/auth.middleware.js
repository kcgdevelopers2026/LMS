import jwt from "jsonwebtoken";

export const customerAuth = (req, res, next) => {
  try {

    const token = req.cookies?.customerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload (no id)",
      });
    }

    req.customer = {
      id: decoded.id,
    };


    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};