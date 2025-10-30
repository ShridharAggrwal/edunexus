const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    durationSec: { type: Number },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Lecture = mongoose.model('Lecture', LectureSchema);
module.exports = Lecture;


