const router = require('express').Router();
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const { enroll, myEnrollments } = require('../controllers/enrollment.controller');

router.post('/:courseId', verifyJWT, requireRole('student', 'admin'), enroll);
router.get('/me', verifyJWT, myEnrollments);

module.exports = router;


