const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
module.exports = Enrollment;


