const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    thumbnailUrl: { type: String },
    isPublished: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;


