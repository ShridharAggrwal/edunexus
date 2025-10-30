const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

async function listAssignments(req, res) {
  const { courseId } = req.params;
  const items = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });
  res.json({ assignments: items });
}

async function createAssignment(req, res) {
  const { courseId } = req.params;
  const { title, description, dueAt, attachmentUrl } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const assignment = await Assignment.create({ course: courseId, title, description, dueAt, attachmentUrl });
  res.status(201).json({ assignment });
}

async function submitAssignment(req, res) {
  const { assignmentId } = req.params;
  const { fileUrl } = req.body;
  const submission = await Submission.findOneAndUpdate(
    { assignment: assignmentId, student: req.user._id },
    { fileUrl },
    { new: true, upsert: true }
  );
  res.status(201).json({ submission });
}

async function gradeSubmission(req, res) {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;
  const sub = await Submission.findById(submissionId).populate({ path: 'assignment', populate: { path: 'course' } });
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  if (
    req.user.role === 'instructor' && String(sub.assignment.course.instructor) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "Only this assignment's instructor or an admin may grade submissions." });
  }
  sub.grade = grade;
  sub.feedback = feedback;
  await sub.save();
  res.json({ submission: sub });
}

async function listSubmissions(req, res) {
  const { assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId).populate('course');
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (
    req.user.role === 'instructor' && String(assignment.course.instructor) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "Only this assignment's instructor or an admin may access submissions." });
  }
  const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name email');
  res.json({ submissions });
}

async function getMySubmission(req, res) {
  const { assignmentId } = req.params;
  const sub = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
  if (!sub) return res.status(404).json({ message: 'Submission not found' });
  res.json({ submission: sub });
}

module.exports = { listAssignments, createAssignment, submitAssignment, gradeSubmission, listSubmissions, getMySubmission };


