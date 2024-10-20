const path = require("path");
const multer = require("multer");

// Profile Photo Storage
const diskStorageProfile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../profilePhotos"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Banner Photo Storage
const diskStorageBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../bannerPhotos"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Post Photo Storage
const diskStoragePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/postPhoto"));
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

// Profile Photo Upload Middleware
const profilePhotoUpload = multer({
  storage: diskStorageProfile,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file formate" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 }, // 1 megabyte
});

// Banner Photo Upload Middleware
const bannerPhotoUpload = multer({
  storage: diskStorageBanner,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file formate" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2 megabyte
});

// Post Photo Upload Middleware
const postPhotoUpload = multer({
  storage: diskStoragePost,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb({ message: "Unsupported file formate" }, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2 megabyte
});

module.exports = {
  profilePhotoUpload,
  bannerPhotoUpload,
  postPhotoUpload,
};
