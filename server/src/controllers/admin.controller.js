const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Lecture = require('../models/Lecture');
const Message = require('../models/Message');

async function stats(_req, res) {
  const [users, courses, assignments, submissions] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Assignment.countDocuments(),
    Submission.countDocuments(),
  ]);
  res.json({ users, courses, assignments, submissions });
}

async function listUsers(_req, res) {
  const users = await User.find().select('-passwordHash');
  res.json({ users });
}

async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true });
}

module.exports = { stats, listUsers, updateUserRole, deleteUser };

async function listAllCourses(_req, res) {
  const courses = await Course.find().populate('instructor', 'name email');
  res.json({ courses });
}

async function listAllLectures(_req, res) {
  const lectures = await Lecture.find().populate({ path: 'course', select: 'title' });
  res.json({ lectures });
}

async function listAllAssignments(_req, res) {
  const assignments = await Assignment.find().populate({ path: 'course', select: 'title' });
  res.json({ assignments });
}

async function listAllSubmissions(_req, res) {
  const submissions = await Submission.find().populate('student', 'name email').populate({ path: 'assignment', populate: { path: 'course', select: 'title' } });
  res.json({ submissions });
}

async function listAllMessages(_req, res) {
  const messages = await Message.find().populate('sender', 'name role').populate('course', 'title');
  res.json({ messages });
}

async function deleteLecture(req, res) {
  const { id } = req.params;
  const doc = await Lecture.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'Lecture not found' });
  res.json({ success: true });
}

async function deleteAssignment(req, res) {
  const { id } = req.params;
  const doc = await Assignment.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'Assignment not found' });
  res.json({ success: true });
}

async function deleteSubmission(req, res) {
  const { id } = req.params;
  const doc = await Submission.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'Submission not found' });
  res.json({ success: true });
}

async function deleteMessage(req, res) {
  const { id } = req.params;
  const doc = await Message.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: 'Message not found' });
  res.json({ success: true });
}

module.exports.listAllCourses = listAllCourses;
module.exports.listAllLectures = listAllLectures;
module.exports.listAllAssignments = listAllAssignments;
module.exports.listAllSubmissions = listAllSubmissions;
module.exports.listAllMessages = listAllMessages;
module.exports.deleteLecture = deleteLecture;
module.exports.deleteAssignment = deleteAssignment;
module.exports.deleteSubmission = deleteSubmission;
module.exports.deleteMessage = deleteMessage;


