import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

/* ================= STORAGE ================= */
const uploadDir = path.resolve('uploads/procurement');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
  } else {
    cb(null, true);
  }
};

/* ================= MULTER INSTANCE ================= */
export const uploadProofMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});
