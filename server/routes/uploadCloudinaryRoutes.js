const express = require("express");
const {
  upload,
  clodinaryUpload,
  clodinaryDelete,
  cloudinaryBulkUpload,
} = require("../controllers/upload-controller");
const { protectAuth, allowedTo } = require("../controllers/auth-controller");
const router = express.Router();

router
  .route("/upload-Cloud")
  .post(protectAuth, allowedTo("instructor"), upload, clodinaryUpload);
router
  .route("/upload-bulk-Cloud")
  .post(protectAuth, allowedTo("instructor"), upload, cloudinaryBulkUpload);

router
  .route("/uploadVideo/:publicId")
  .delete(protectAuth, allowedTo("instructor"), clodinaryDelete);

module.exports = router;
