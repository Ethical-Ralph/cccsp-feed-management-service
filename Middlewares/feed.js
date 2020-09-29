const response = require("../Utils/response");
const feedService = require("../Database/Service/feedService");
const { adminRoles } = require("./auth");

exports.feedExist = (db) => async (req, res, next) => {
  try {
    const [documentId, collectionId] = req.params.feedId.split(".");
    const feed = await feedService.getFeed(db, documentId, collectionId);
    if (!feed)
      return response.error(res, 404, "Feed not found or has been deleted");
    req.feed = feed;
    next();
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.isFeedOwner = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const feed = req.feed;
    if (feed.authorId === userId || adminRoles.includes(user.role)) {
      req.feed = feed;
      return next();
    }
    return response.error(res, 401, "Unauthorized");
  } catch (error) {
    response.error(res, 500, error);
  }
};
