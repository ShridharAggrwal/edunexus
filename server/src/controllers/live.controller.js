const LiveSession = require('../models/LiveSession');
const Course = require('../models/Course');
const mongoose = require('mongoose');
const { createMeetEvent, deleteEvent } = require('../services/google');

async function listUpcomingByCourse(req, res) {
  const { courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) return res.status(400).json({ message: 'Invalid course id' });
  // Include a small buffer to account for timezone/local conversion differences
  const bufferMs = 5 * 60 * 1000; // 5 minutes
  const now = new Date(Date.now() - bufferMs);
  const items = await LiveSession.find({ course: courseId, startAt: { $gte: now } })
    .sort({ startAt: 1 });
  res.json({ sessions: items });
}

async function schedule(req, res) {
  const { courseId } = req.params;
  const { title, startAt, meetUrl } = req.body;
  if (!title || !startAt) return res.status(400).json({ message: 'Missing fields' });
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  let finalMeetUrl = meetUrl;
  let eventId = undefined;
  try {
    const created = await createMeetEvent({ title: `${course.title}: ${title}`, startAt });
    finalMeetUrl = created.meetUrl;
    eventId = created.eventId;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Google Meet creation failed:', err?.message || err);
    return res.status(500).json({ message: err?.message || 'Failed to generate Meet link' });
  }
  const session = await LiveSession.create({ course: courseId, title, startAt, meetUrl: finalMeetUrl, eventId, createdBy: req.user._id });
  res.status(201).json({ session });
}

async function cancel(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid session id' });
  const deleted = await LiveSession.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: 'Session not found' });
  if (deleted.eventId) {
    try { await deleteEvent(deleted.eventId); } catch (_) {}
  }
  res.json({ success: true });
}

module.exports = { listUpcomingByCourse, schedule, cancel };


