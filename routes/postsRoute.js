const router = require("express").Router();
const {
  getAllPostsCtrl,
  getOnePostCtrl,
  createPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  postPhotoUploadCtrl,
  updatePostImageCtrl,
} = require("../controllers/postController");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

const { postPhotoUpload } = require("../middlewares/uploadPhoto");

// /api/posts/getAllPosts
router.route("/").get(getAllPostsCtrl);

// /api/posts/post
router
  .route("/post")
  .post(verifyToken, postPhotoUpload.single("postImage"), createPostCtrl);
router
  .route("/post/:id")
  .get(validateObjectId, getOnePostCtrl)
  .put(validateObjectId, verifyToken, updatePostCtrl)
  .delete(validateObjectId, verifyToken, deletePostCtrl);

// /api/posts/update-image/:id
router
  .route("/update-image/:id")
  .put(
    validateObjectId,
    verifyToken,
    postPhotoUpload.single("postImage"),
    updatePostImageCtrl
  );

// /api/posts/post-photo-upload
router
  .route("/post-photo-upload")
  .post(verifyToken, postPhotoUpload.single("postImage"), postPhotoUploadCtrl);

module.exports = router;
