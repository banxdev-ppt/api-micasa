const { Router } = require('express');
const { loginController } = require('../controllers/authenticate/login.controller');
const { registerController } = require('../controllers/authenticate/register.controller');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const router = Router();
const upload = uploadMiddleware().single('usrImg');

router.post('/login', loginController);
router.post('/register', upload, registerController);

module.exports = router;
