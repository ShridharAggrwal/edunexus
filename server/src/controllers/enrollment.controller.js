const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

async function enroll(req, res) {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course || !course.isPublished) return res.status(404).json({ message: 'Course not available' });
  const enrollment = await Enrollment.findOneAndUpdate(
    { course: courseId, student: req.user._id },
    {},
    { new: true, upsert: true }
  );
  res.status(201).json({ enrollment });
}

async function myEnrollments(req, res) {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
  res.json({ enrollments });
}

module.exports = { enroll, myEnrollments };


