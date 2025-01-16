const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { asyncErrorHandler } = require("express-error-catcher");
const jsend = require("jsend");
const fs = require("fs");
const path = require("path");

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "/tmp/uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}.${file.mimetype.split("/")[1]}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage }).fields([
  { name: "file", maxCount: 1 }, // Corrected maxCount to a number
  { name: "files", maxCount: 20 },
]);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const clodinaryUpload = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json(jsend.fail("No file uploaded"));
  }

  const uploadResult = await cloudinary.uploader.upload(
    req.files.file[0].path,
    {
      resource_type: "auto",
    }
  );

  // Clean up: Delete the temporary file after upload
  fs.unlinkSync(req.files.file[0].path);

  res.status(200).json(jsend.success(uploadResult));
});

const cloudinaryBulkUpload = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.files) {
    return res.status(400).json(jsend.fail("No files uploaded"));
  }

  const files = req.files.files;
  const imagesUploads = await Promise.all(
    files.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      // Clean up: Delete the temporary file after upload
      fs.unlinkSync(image.path);
      return result;
    })
  );

  res.status(200).json(jsend.success(imagesUploads));
});

const clodinaryDelete = asyncErrorHandler(async (req, res, next) => {
  await cloudinary.uploader.destroy(req.params.publicId);
  res.status(201).json(jsend.success("Successfully deleted"));
});

module.exports = {
  upload,
  clodinaryUpload,
  clodinaryDelete,
  cloudinaryBulkUpload,
};
