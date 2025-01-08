async function registerController(req, res) {
  const { email, password, fname, lname, gender, role } = req.body;
  if (!email || !password || !fname || !lname || !gender || !role) {
    res.status(400).json({ statusCode: 400, message: "invalid data" });
  } else {
    try {
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: [{ email, password, fname, lname, gender, role }],
      });
    } catch (error) {}
  }
}

module.exports = { registerController };
