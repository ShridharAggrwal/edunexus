const router = require('express').Router();
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const { stats, listUsers, updateUserRole, deleteUser, listAllCourses, listAllLectures, listAllAssignments, listAllSubmissions, listAllMessages, deleteLecture, deleteAssignment, deleteSubmission, deleteMessage } = require('../controllers/admin.controller');

router.use(verifyJWT, requireRole('admin'));

router.get('/stats', stats);
router.get('/users', listUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/courses', listAllCourses);
router.get('/lectures', listAllLectures);
router.get('/assignments', listAllAssignments);
router.get('/submissions', listAllSubmissions);
router.get('/messages', listAllMessages);
router.delete('/lectures/:id', deleteLecture);
router.delete('/assignments/:id', deleteAssignment);
router.delete('/submissions/:id', deleteSubmission);
router.delete('/messages/:id', deleteMessage);

module.exports = router;


