const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    dueAt: { type: Date },
    attachmentUrl: { type: String },
  },
  { timestamps: true }
);

const Assignment = mongoose.model('Assignment', AssignmentSchema);
module.exports = Assignment;


