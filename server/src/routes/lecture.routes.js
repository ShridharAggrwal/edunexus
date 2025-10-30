const router = require('express').Router({ mergeParams: true });
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const { listLectures, createLecture, updateLecture, deleteLecture } = require('../controllers/lecture.controller');

router.get('/:courseId', verifyJWT, listLectures);
router.post('/:courseId', verifyJWT, requireRole('instructor', 'admin'), createLecture);
router.put('/:id', verifyJWT, requireRole('instructor', 'admin'), updateLecture);
router.delete('/:id', verifyJWT, requireRole('instructor', 'admin'), deleteLecture);

module.exports = router;


