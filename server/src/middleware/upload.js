import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from './errorHandler.js';
import { config } from '../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_BASE = path.join(__dirname, '..', '..', 'uploads');

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(UPLOAD_BASE, folder)),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
  });

const imageFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) return cb(new AppError('Only image files are allowed (jpg, png, webp)', 400));
  cb(null, true);
};

const pdfFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') return cb(new AppError('Only PDF files are allowed', 400));
  cb(null, true);
};

const docFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) return cb(new AppError('Only PDF and Word documents are allowed', 400));
  cb(null, true);
};

const MAX = config.MAX_FILE_SIZE; // 5MB default

export const uploadProfilePhoto = multer({ storage: storage('profiles'), fileFilter: imageFilter, limits: { fileSize: MAX } }).single('photo');
export const uploadLogo = multer({ storage: storage('logos'), fileFilter: imageFilter, limits: { fileSize: MAX } }).single('logo');
export const uploadCV = multer({ storage: storage('cvs'), fileFilter: pdfFilter, limits: { fileSize: MAX } }).single('cv');
export const uploadDocument = multer({ storage: storage('documents'), fileFilter: docFilter, limits: { fileSize: MAX } }).single('document');

// Wrap multer to convert its errors to AppError
export const handleUpload = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return next(new AppError('File too large. Maximum size is 5MB.', 400));
      return next(new AppError(err.message, 400));
    }
    next(err);
  });
};
