const commentService = require("../Database/Service/commentService");
const response = require("../Utils/response");
const {
  serializeCommentforUpdate,
  serializeComment,
} = require("../Utils/dataSerializer");

exports.getAllCommentsByFeedId = (db) => async (req, res) => {
  try {
    const feedId = req.params.feedId;
    const comments = await commentService.getByFeedId(db, feedId);

    response.success(res, comments);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.createComment = (db) => async (req, res) => {
  try {
    const [valError, data] = await serializeComment(req.body);

    if (valError) return response.error(res, 400, valError);

    const userId = req.user.id;
    const feedId = req.feed._id;

    data.authorId = userId;
    data.feedId = feedId;
    await commentService.createComment(db, data);
    return response.success(res, 201, data);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.editComment = (db) => async (req, res) => {
  try {
    const { feedId, commentId } = req.params;
    const [valError, data] = await serializeCommentforUpdate(req.body);
    if (valError) return response.error(res, 400, valError);

    await commentService.editComment(db, data, feedId, commentId);
    const comment = await commentService.getComment(db, commentId, feedId);
    return response.success(res, comment);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.deleteComment = (db) => async (req, res) => {
  try {
    const { feedId, commentId } = req.params;
    await commentService.deleteComment(db, commentId, feedId);
    const message = "Comment deleted successfully";

    return response.success(res, { message });
  } catch (error) {
    response.error(res, 500, error);
  }
};
