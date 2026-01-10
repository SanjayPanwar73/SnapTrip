const cloudinary = require("cloudinary");
const {CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wanderlust_DEV",
    allowedFormats: ["png","jpg","jpeg","webp"],
    transformation: [{
      quality: "auto:good",
      fetch_format: "auto"
    }]
  }
});

// DEBUG: Log every file that multer processes
const storageUpload = storage._handleFile.bind(storage);
storage._handleFile = function(req, file, cb) {
  console.log("\n=== MULTER DEBUG ===");
  console.log("file.fieldname:", file.fieldname);
  console.log("file.originalname:", file.originalname);
  console.log("file.mimetype:", file.mimetype);
  console.log("file.size:", file.size);
  console.log("UPLOAD STARTED:", new Date().toISOString());
  
  // Set a 60-second timeout to detect hanging uploads
  const timeout = setTimeout(() => {
    console.error("!!! CLOUDINARY UPLOAD TIMEOUT AFTER 60 SECONDS !!!");
    console.error("File:", file.originalname);
    console.error("This means Cloudinary is not responding");
  }, 60000);
  
  storageUpload(req, file, (err, info) => {
    clearTimeout(timeout);
    console.log("UPLOAD COMPLETED:", new Date().toISOString());
    if (err) {
      console.error("MULTER/CLOUDINARY ERROR:", err.message);
      console.error("err.name:", err.name);
      console.error("err.code:", err.code);
    } else {
      console.log("CLOUDINARY UPLOAD SUCCESS:");
      console.log("  - path:", info.path);
      console.log("  - filename:", info.filename);
      console.log("  - public_id:", info.public_id);
    }
    cb(err, info);
  });
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log("MULTER: Processing file:", file.originalname);
    if (file.mimetype.startsWith('image/')) {
      console.log("MULTER: File type OK");
      cb(null, true);
    } else {
      console.log("MULTER: Invalid file type");
      cb(new Error("Only image files are allowed."), false);
    }
  }
});

const handleMulterError = (err, req, res, next) => {
  console.log("\n=== MULTER ERROR HANDLER ===");
  console.log("err type:", err.constructor.name);
  console.log("err message:", err.message);
  
  if (err instanceof multer.MulterError) {
    console.log("MULTER ERROR CODE:", err.code);
    console.log("MULTER ERROR FIELD:", err.field);
    console.log("MULTER ERROR LIMIT:", err.limit);
    
    // Common multer error codes
    const errorMessages = {
      LIMIT_FILE_SIZE: `File too large. Max size: 5MB`,
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field"
    };
    const msg = errorMessages[err.code] || err.message;
    return res.status(400).json({ error: msg });
  } else if (err) {
    console.log("UPLOAD ERROR:", err.message);
    console.log("UPLOAD ERROR STACK:", err.stack);
    return res.status(400).json({ error: err.message });
  }
  
  console.log("No multer error detected");
  next();
};

module.exports = { cloudinary, storage, upload, handleMulterError };
