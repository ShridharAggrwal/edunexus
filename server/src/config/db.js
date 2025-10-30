const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('Missing MongoDB URI');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}

module.exports = { connectDB };


