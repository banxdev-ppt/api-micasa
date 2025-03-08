const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

function uploadFile(folderName, filename, fileBuffer) {
  try {
    const baseUploadPath = path.join(__dirname, "../uploads");
    const folderPath = path.join(baseUploadPath, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, filename);

    if (fs.existsSync(filePath)) {
      return true;
    }

    fs.writeFileSync(filePath, fileBuffer);
    return true;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Error saving file");
  }
}

async function formatFilename(originalFilename, type) {
  const fileExtension = path.extname(originalFilename);
  switch (type) {
    case "profiles": {
      const hash_orgFilename = await bcrypt.hash(originalFilename, 10);
      const filName = hash_orgFilename.replace(/[^a-zA-Z0-9]/g, "_");
      const date = new Date().toISOString().split("T")[0];
      return `${date}_${filName}${fileExtension}`;
    }
    case "families": {
      const hash_orgFilename = await bcrypt.hash(originalFilename, 10);
      const filName = hash_orgFilename.replace(/[^a-zA-Z0-9]/g, "_");
      const date = new Date().toISOString().split("T")[0];
      return `${date}_${filName}${fileExtension}`;
    }
    case "posts": {
      const hash_orgFilename = await bcrypt.hash(originalFilename, 10);
      const filName = hash_orgFilename.replace(/[^a-zA-Z0-9]/g, "_");
      const date = new Date().toISOString().split("T")[0];
      return `${date}_${filName}${fileExtension}`;
    }
    case "menus": {
      const hash_orgFilename = await bcrypt.hash(originalFilename, 10);
      const filName = hash_orgFilename.replace(/[^a-zA-Z0-9]/g, "_");
      const date = new Date().toISOString().split("T")[0];
      return `${date}_${filName}${fileExtension}`;
    }
    default:
      break;
  }
}

module.exports = { uploadFile, formatFilename };
