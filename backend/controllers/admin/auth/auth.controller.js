import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../../../config/supabase.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // MUST be true in production (HTTPS)
  sameSite: "none",    // REQUIRED for cross-domain (Vercel ↔ Render)
  maxAge: 24 * 60 * 60 * 1000,
});

    return res.json({
      message: "Login successful",
      admin: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};