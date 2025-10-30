const router = require('express').Router();
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const {
  listCourses,
  listAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
} = require('../controllers/course.controller');

router.get('/', listCourses);
router.get('/all', verifyJWT, requireRole('instructor', 'admin'), listAllCourses);
router.get('/:id', getCourse);
router.post('/', verifyJWT, requireRole('instructor', 'admin'), createCourse);
router.put('/:id', verifyJWT, requireRole('instructor', 'admin'), updateCourse);
router.delete('/:id', verifyJWT, requireRole('instructor', 'admin'), deleteCourse);
router.post('/:id/publish', verifyJWT, requireRole('instructor', 'admin'), publishCourse);

module.exports = router;


