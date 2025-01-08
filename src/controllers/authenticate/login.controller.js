async function loginController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ statusCode: 400, message: "invalid data" });
  } else {
    try {
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: [{ email, password }],
      });
    } catch (error) {}
  }
}

module.exports = { loginController };
