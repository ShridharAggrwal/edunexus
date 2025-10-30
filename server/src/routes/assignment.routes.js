const router = require('express').Router({ mergeParams: true });
const { verifyJWT, requireRole } = require('../middleware/auth.middleware');
const { listAssignments, createAssignment, submitAssignment, gradeSubmission, listSubmissions,getMySubmission } = require('../controllers/assignment.controller');

router.get('/:courseId', verifyJWT, listAssignments);
router.post('/:courseId', verifyJWT, requireRole('instructor', 'admin'), createAssignment);
router.post('/submit/:assignmentId', verifyJWT, requireRole('student', 'instructor', 'admin'), submitAssignment);
router.post('/grade/:submissionId', verifyJWT, requireRole('instructor', 'admin'), gradeSubmission);
router.get('/submissions/:assignmentId', verifyJWT, requireRole('instructor', 'admin'), listSubmissions);
router.get('/submit/:assignmentId', verifyJWT, requireRole('student', 'instructor', 'admin'), getMySubmission);
module.exports = router;