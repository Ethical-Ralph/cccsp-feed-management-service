const response = require("../Utils/response");
const commentService = require("../Database/Service/commentService");
const { adminRoles } = require("./auth");

exports.commentExist = (db) => async (req, res, next) => {
  try {
    const { feedId, commentId } = req.params;
    const comment = await commentService.getComment(db, commentId, feedId);
    if (!comment)
      return response.error(res, 404, "Comment not found or has been deleted");
    req.comment = comment;
    next();
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.isCommentOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const comment = req.comment;
    if (comment.authorId == userId || adminRoles.includes(user.role)) {
      req.comment = comment;
      return next();
    }
    return response.error(res, 401, "Unauthorized");
  } catch (error) {
    response.error(res, 500, error);
  }
};
