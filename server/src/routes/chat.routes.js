const router = require('express').Router({ mergeParams: true });
const { verifyJWT } = require('../middleware/auth.middleware');
const { listMessages, postMessage } = require('../controllers/chat.controller');

router.get('/:courseId', verifyJWT, listMessages);
router.post('/:courseId', verifyJWT, postMessage);

module.exports = router;


