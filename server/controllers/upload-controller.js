const multer = require("multer");
const cloudinary = require("cloudinary");
const { asyncErrorHandler } = require("express-error-catcher");
const jsend = require("jsend");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "var/task/server/controllers/uploads/"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}.${file.mimetype.split("/")[1]}`;

    cb(null, fileName);
  },
});
const upload = multer({ storage }).fields([
  { name: "file", maxCount: "1" },
  { name: "files", maxCount: "20" },
]);

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const clodinaryUpload = asyncErrorHandler(async (req, res, next) => {
  console.log(req.files);

  const uploadResult = await cloudinary.v2.uploader.upload(
    req.files.file[0].path,
    {
      resource_type: "auto",
    }
  );

  console.log(uploadResult);

  res.status(200).json(jsend.success(uploadResult));
});

const cloudinaryBulkUpload = asyncErrorHandler(async (req, res, next) => {
  const files = req.files.files;
  let imagesUploads = [];

  await Promise.all(
    files.map(async (image) => {
      const result = await cloudinary.v2.uploader.upload(image.path, {
        resource_type: "auto",
      });
      imagesUploads.push(result);
    })
  );

  res.status(200).json(jsend.success(imagesUploads));
});

const clodinaryDelete = asyncErrorHandler(async (req, res, next) => {
  await cloudinary.v2.uploader.destroy(req.params.publicId);
  res.status(201).json(jsend.success("success deleted"));
});

module.exports = {
  upload,
  clodinaryUpload,
  clodinaryDelete,
  cloudinaryBulkUpload,
};
