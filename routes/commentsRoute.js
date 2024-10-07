const router = require("express").Router();
const {
  getAllCommentsCtrl,
  getOneCommentCtrl,
  createCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require("../controllers/commentController");

const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");

const validateObjectId = require("../middlewares/validateObjectId");

// /api/comments
router.route("/").get(getAllCommentsCtrl).post(verifyToken, createCommentCtrl);

// /api/comments/comment
router
  .route("/comment/:id")
  .get(validateObjectId, getOneCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl)
  .delete(validateObjectId, verifyToken, deleteCommentCtrl);

module.exports = router;
