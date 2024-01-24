import multer, { Multer, StorageEngine } from 'multer';

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload: Multer = multer({ storage });
