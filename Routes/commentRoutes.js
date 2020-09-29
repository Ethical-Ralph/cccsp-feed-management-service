const express = require("express");
const router = express.Router();
const {
  getAllCommentsByFeedId,
  createComment,
  editComment,
  deleteComment,
} = require("../Controllers/commentController");
const { feedExist } = require("../Middlewares/feed");
const { commentExist, isCommentOwner } = require("../Middlewares/comment");
const { auth } = require("../Middlewares/auth");

module.exports = (db) => {
  router.get("/:feedId/comment", feedExist(db), getAllCommentsByFeedId(db));

  router.post("/:feedId/comment", auth, feedExist(db), createComment(db));

  router.patch(
    "/:feedId/comment/:commentId",
    auth,
    feedExist(db),
    commentExist(db),
    isCommentOwner,
    editComment(db)
  );

  router.delete(
    "/:feedId/comment/:commentId",
    auth,
    feedExist(db),
    commentExist(db),
    isCommentOwner,
    deleteComment(db)
  );

  return router;
};
