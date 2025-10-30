const router = require('express').Router({ mergeParams: true });
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const { listUpcomingByCourse, schedule, cancel } = require('../controllers/live.controller');

router.get('/:courseId', verifyJWT, listUpcomingByCourse);
router.post('/:courseId', verifyJWT, requireRole('instructor', 'admin'), schedule);
router.delete('/:id', verifyJWT, requireRole('instructor', 'admin'), cancel);

module.exports = router;


