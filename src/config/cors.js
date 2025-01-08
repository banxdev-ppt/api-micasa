const cors = require('cors');
const corsOption = {
  origin: '*',
  method: ['GET', 'POST', 'PUSH', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};
const configCors = cors(corsOption);
module.exports = { configCors };
