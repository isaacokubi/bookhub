import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    if (!allowedTypes.has(file.mimetype)) {
      return cb(
        new Error("Only JPEG, PNG, and WebP images are allowed."),
      );
    }

    cb(null, true);
  },
});

export default upload;
