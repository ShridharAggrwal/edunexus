const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lecture = require('../models/Lecture');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Message = require('../models/Message');
const mongoose = require('mongoose');

async function listCourses(_req, res) {
  const courses = await Course.find({ isPublished: true }).populate('instructor', 'name email');
  res.json({ courses });
}

async function listAllCourses(_req, res) {
  const courses = await Course.find().populate('instructor', 'name email');
  res.json({ courses });
}

async function getCourse(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid course id' });
  const course = await Course.findById(id).populate('instructor', 'name email');
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
}

async function createCourse(req, res) {
  const { title, description, thumbnailUrl, tags } = req.body;
  const course = await Course.create({
    title,
    description,
    instructor: req.user._id,
    thumbnailUrl,
    tags,
  });
  res.status(201).json({ course });
}

async function updateCourse(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid course id' });
  const query = (req.user.role === 'admin' || req.user.role === 'instructor') ? { _id: id } : { _id: id, instructor: req.user._id };
  const course = await Course.findOneAndUpdate(query, req.body, {
    new: true,
  });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
}

async function deleteCourse(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid course id' });
  const query = (req.user.role === 'admin' || req.user.role === 'instructor') ? { _id: id } : { _id: id, instructor: req.user._id };
  const course = await Course.findOneAndDelete(query);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  // Cascade cleanup: enrollments, lectures, assignments, submissions, messages
  const assignments = await Assignment.find({ course: id }).select('_id');
  const assignmentIds = assignments.map((a) => a._id);
  await Promise.all([
    Enrollment.deleteMany({ course: id }),
    Lecture.deleteMany({ course: id }),
    Assignment.deleteMany({ course: id }),
    Submission.deleteMany({ assignment: { $in: assignmentIds } }),
    Message.deleteMany({ course: id }),
  ]);
  res.json({ success: true });
}

async function publishCourse(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid course id' });
  const query = (req.user.role === 'admin' || req.user.role === 'instructor') ? { _id: id } : { _id: id, instructor: req.user._id };
  const course = await Course.findOneAndUpdate(query, { isPublished: true }, { new: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
}

module.exports = {
  listCourses,
  listAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
};


