const { formatFilename } = require("../../helper/convertFilename");
const { uploadFile } = require("../../helper/uploadFile");
const path = require("path");
const fs = require("fs");
const { db } = require("../../config/database");
const { json } = require("body-parser");

exports.getFamilyController = async (req, res) => {
  try {
    const { famCode } = req.params;

    const [row] = await db
      .promise()
      .query("SELECT * FROM families WHERE famCode = ?", [famCode]);

    if (row.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        taskStatus: false,
        message: "ไม่พบข้อมูลครอบครัว",
      });
    }
    const data = row[0];
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const profileUrl = data.famProfile
      ? `${baseUrl}/families/${data.famProfile}`
      : null;

    const families = {
      id: data.id,
      famName: data.famName,
      profile: profileUrl,
      famCode: data.famCode,
      famMember: JSON.parse(data.famMember),
      created_at: data.created_at,
    };

    return res.status(200).json({
      statusCode: 200,
      taskStatus: true,
      message: "พบข้อมูลครอบครัว",
      data: families,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ statusCode: 500, taskStatus: false, message: error.message });
  }
};
