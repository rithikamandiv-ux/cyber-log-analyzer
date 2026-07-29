import multer from "multer";
import path from "path";

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, "../../../uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow common log file types
  const allowedMimeTypes = [
    "text/plain",
    "text/csv",
    "application/octet-stream",
    "application/json",
    "text/x-log",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "50000000", 10);

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});
