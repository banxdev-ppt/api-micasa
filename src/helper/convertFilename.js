const bcrypt = require("bcrypt");
const path = require("path");

async function formatFilename(originalFilename, type, userid) {
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
    // case "products": {
    //   const date = new Date().toISOString().split("T")[0];
    //   return `${date}_${userid}${originalFilename}`;
    // }
    default:
      break;
  }
}

module.exports = { formatFilename };
