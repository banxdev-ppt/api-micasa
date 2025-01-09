const fs = require('fs');
const path = require('path');

function uploadFile(folderName, filename, fileBuffer) {
  try {
    const baseUploadPath = path.join(__dirname, '../uploads');
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
    console.error('Error saving file:', error);
    throw new Error('Error saving file');
  }
}

module.exports = { uploadFile };
