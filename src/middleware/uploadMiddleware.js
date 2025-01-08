const multer = require("multer");

function uploadMiddleware() {
  const storage = multer.memoryStorage();
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  };
  return multer({ storage, fileFilter });
}

module.exports = { uploadMiddleware };
