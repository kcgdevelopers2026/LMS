export const unlockAdminPage = async (req, res) => {
  try {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PAGE_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    return res.json({
      success: true,
      message: "Unlocked",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};