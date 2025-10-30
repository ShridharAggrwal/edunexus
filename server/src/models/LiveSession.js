const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    startAt: { type: Date, required: true, index: true },
    meetUrl: { type: String, required: true },
    eventId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const LiveSession = mongoose.model('LiveSession', LiveSessionSchema);
module.exports = LiveSession;


