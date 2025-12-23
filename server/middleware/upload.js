const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter: prefer PDF, but accept common PDF mimetypes and .pdf extension fallback
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    const allowed = ['application/pdf', 'application/x-pdf'];
    const isPdfMime = allowed.includes(file.mimetype);
    const hasPdfExt = path.extname(file.originalname || '').toLowerCase() === '.pdf';
    if (isPdfMime || hasPdfExt) return cb(null, true);
    return cb(new Error('Only PDF files are allowed for resumes'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
