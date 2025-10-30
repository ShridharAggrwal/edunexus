const router = require('express').Router();
const { verifyJWT } = require('../middleware/auth.middleware');
const { cloudinary } = require('../config/cloudinary');

// Returns signature for client-side uploads to Cloudinary
router.get('/signature', verifyJWT, (req, res) => {
  const folder = req.query.folder || 'edunexus';
  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!apiSecret || !apiKey || !cloudName) return res.status(500).json({ message: 'Cloudinary not configured' });

  // Only include params that Cloudinary expects in signature
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);
  return res.json({ timestamp, signature, apiKey, cloudName, folder });
});

module.exports = router;


