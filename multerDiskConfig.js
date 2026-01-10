const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory:", uploadsDir);
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("\n=== MULTER DISK STORAGE ===");
    console.log("File fieldname:", file.fieldname);
    console.log("File originalname:", file.originalname);
    console.log("Destination:", uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = "listing-" + uniqueSuffix + ext;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log("File filter - mimetype:", file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    console.log("File type accepted");
    cb(null, true);
  } else {
    console.error("File type rejected - only images allowed");
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Error handler middleware
const handleMulterError = (err, req, res, next) => {
  console.log("\n=== MULTER ERROR HANDLER ===");
  console.log("Error type:", err.constructor.name);
  console.log("Error message:", err.message);
  
  if (err instanceof multer.MulterError) {
    console.log("Multer error code:", err.code);
    console.log("Multer error field:", err.field);
    return res.status(400).json({ error: `Multer error: ${err.code}` });
  } else if (err) {
    console.log("Upload error:", err.message);
    return res.status(400).json({ error: err.message });
  }
  
  console.log("No multer error - calling next()");
  next();
};

module.exports = { upload, handleMulterError };
