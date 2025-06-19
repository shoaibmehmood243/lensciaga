const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileBuffer = file.buffer;
    const ext = path.extname(file.originalname);
    const hash = crypto.createHash('md5').update(file.originalname).digest('hex');
    const uniqueName = `${hash}${ext}`;
    const fullPath = path.join('uploads', uniqueName);

    // Avoid re-uploading identical file if it already exists
    if (fs.existsSync(fullPath)) {
      cb(null, uniqueName);
    } else {
      cb(null, uniqueName);
    }
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB per image
};

const multerInstance = multer(multerOptions);
module.exports = multerInstance.array('images', 5);