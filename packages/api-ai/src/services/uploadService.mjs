import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the "uploads" directory exists
const uploadsDir = path.join(new URL('../', import.meta.url).pathname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up Multer for file upload handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const fileName = `lastUpload${path.extname(file.originalname)}`;//file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

// Define a file filter to allow only certain types of files (e.g., images)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

// Initialize the upload handler
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('image'); // 'image' is the name of the form field

// Export the upload service function
export { upload as uploadImage };