const router = require("express").Router();

const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  profilePhotoUploadCtrl,
  bannerPhotoUploadCtrl,
  getProfilePhotoCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const {
  profilePhotoUpload,
  bannerPhotoUpload,
} = require("../middlewares/uploadPhoto");

const validateObjectId = require("../middlewares/validateObjectId");

// /api/users/allUsers
router.route("/").get(verifyTokenAndAdmin, getAllUsersCtrl);

// api/users/profile
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUserProfileCtrl);

// /api/users/profile/profile-photo-upload
router
  .route("/profile/profile-photo-upload")
  .post(
    verifyToken,
    profilePhotoUpload.single("profileImage"),
    profilePhotoUploadCtrl
  );

// /api/users/profile/banner-photo-upload
router
  .route("/profile/banner-photo-upload")
  .post(
    verifyToken,
    bannerPhotoUpload.single("bannerImage"),
    bannerPhotoUploadCtrl
  );

module.exports = router;
