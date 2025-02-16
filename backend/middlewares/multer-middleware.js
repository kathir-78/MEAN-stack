const multer = require('multer');

const ALLOWED_MIME_TYPES = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true
  };

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        let error = new Error("Invalid file type"); 
        const filenameOr = file.originalname.toLowerCase().split(' ').join('-');
        const mimeType = file.mimetype;
        if (ALLOWED_MIME_TYPES[mimeType]) {
            error = null;
            const extension = mimeType.split('/')[1]; // Get actual file extension
            const filename = filenameOr + '_' + Date.now() + '.' + extension;
            cb(error, filename);
        } else {
            cb(error);
        }
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5 // 5MB max file size
    }
});

module.exports = upload.single('image');