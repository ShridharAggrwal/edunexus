const Message = require('../models/Message');

async function listMessages(req, res) {
  const { courseId } = req.params;
  const messages = await Message.find({ course: courseId }).populate('sender', 'name role').sort({ createdAt: 1 });
  res.json({ messages });
}

async function postMessage(req, res) {
  const { courseId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Content required' });
  const msg = await Message.create({ course: courseId, sender: req.user._id, content });
  res.status(201).json({ message: msg });
}

module.exports = { listMessages, postMessage };


