const router = require('express').Router();
const { register, login, me } = require('../controllers/auth.controller');
const { verifyJWT } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyJWT, me);

module.exports = router;


