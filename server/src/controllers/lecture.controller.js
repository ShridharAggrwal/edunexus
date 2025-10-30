const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

async function listLectures(req, res) {
  const { courseId } = req.params;
  const lectures = await Lecture.find({ course: courseId }).sort({ order: 1 });
  res.json({ lectures });
}

async function createLecture(req, res) {
  const { courseId } = req.params;
  const { title, videoUrl, durationSec, order } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const lecture = await Lecture.create({ course: courseId, title, videoUrl, durationSec, order });
  res.status(201).json({ lecture });
}

async function updateLecture(req, res) {
  const { id } = req.params;
  const lecture = await Lecture.findById(id).populate('course');
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
  // Allow admin and instructors to update
  Object.assign(lecture, req.body);
  await lecture.save();
  res.json({ lecture });
}

async function deleteLecture(req, res) {
  const { id } = req.params;
  const lecture = await Lecture.findById(id).populate('course');
  if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
  await lecture.deleteOne();
  res.json({ success: true });
}

module.exports = { listLectures, createLecture, updateLecture, deleteLecture };


