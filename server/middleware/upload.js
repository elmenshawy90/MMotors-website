const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Vercel/Lambda filesystems are read-only except /tmp — and even /tmp is
// ephemeral. Uploads won't persist on serverless; use S3/Cloudinary for prod.
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadDir = isServerless
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, '..', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('Upload dir not writable, file uploads disabled:', uploadDir, err.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpg|jpeg|png|webp|gif)$/i;
  const extOk = allowedExt.test(path.extname(file.originalname));
  const mimeOk = file.mimetype.startsWith('image/');

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;