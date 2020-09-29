const feedService = require("../Database/Service/feedService");
const response = require("../Utils/response");
const {
  getAvailableCollection,
  createNewCollection,
  incFeedCollectionCount,
  getLatestFeedCollection,
  getAllFeedCollection,
  getPreviousCollection,
} = require("../Database/Service/feedCountService");
const {
  serializeFeed,
  serializeFeedforUpdate,
} = require("../Utils/dataSerializer");

exports.getFeed = (db) => async (req, res, next) => {
  const feed = req.feed;
  return response.success(res, feed);
};

exports.getFeeds = (db) => async (req, res) => {
  try {
    const lastestCollection = await getLatestFeedCollection(db);
    const allFeedCollection = await getAllFeedCollection(db);
    let feeds = await feedService.getFeeds(db, lastestCollection);
    if (feeds.length < 20 && allFeedCollection.length >= 2) {
      const prevFeeds = await feedService.getFeeds(
        db,
        getPreviousCollection(allFeedCollection)
      );
      feeds = feeds.concat(prevFeeds.reverse());
    }
    response.success(res, 200, feeds);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.createFeed = (db) => async (req, res) => {
  try {
    let [validationErr, feedData] = await serializeFeed(req.body);
    if (validationErr) return response.error(res, 400, validationErr);
    feedData.authorId = req.user.id;
    const availableCollection = await getAvailableCollection(db);
    if (availableCollection) {
      feedData = await feedService.createFeed(
        db,
        feedData,
        availableCollection
      );
      await incFeedCollectionCount(db, availableCollection._id);
      return response.success(res, 201, feedData);
    } else {
      const newFeedCollection = await createNewCollection(db);
      feedData = await feedService.createFeed(db, feedData, newFeedCollection);
      await incFeedCollectionCount(db, newFeedCollection._id);
      return response.success(res, 201, feedData);
    }
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.editFeed = (db) => async (req, res, next) => {
  try {
    let [valError, feedData] = await serializeFeedforUpdate(req.body);
    if (valError) return response.error(res, 400, valError);

    const [documentId, collectionId] = req.feed._id.split(".");

    await feedService.editFeed(db, feedData, documentId, collectionId);
    const feed = await feedService.getFeed(db, documentId, collectionId);
    return response.success(res, feed);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.deleteFeed = (db) => async (req, res) => {
  try {
    const [documentId, collectionId] = req.feed._id.split(".");
    1;

    await feedService.deleteFeed(db, documentId, collectionId);
    const messsage = "Feed deleted successfully";
    return response.success(res, { messsage });
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.likeOrUnlikeFeed = (db) => async (req, res, next) => {
  try {
    const userId = req.user.id;
    const feed = req.feed;
    const [documentId, collectionId] = feed._id.split(".");
    let shouldLike;

    if (feed.likes.includes(userId)) {
      shouldLike = false;
      feed.likes = feed.likes.filter((id) => id !== userId);
    } else {
      shouldLike = true;
      feed.likes.push(userId);
    }

    await feedService.likeOrUnlikeFeed(
      db,
      shouldLike,
      documentId,
      collectionId,
      userId
    );
    return response.success(res, feed);
  } catch (error) {
    response.error(res, 500, error);
  }
};

exports.countFeedShare = (db) => async (req, res) => {
  try {
    const feed = req.feed;
    const [documentId, collectionId] = feed._id.split(".");
    await feedService.countShare(db, documentId, collectionId);
    const messsage = "sharecount updated successfully";
    response.success(res, { messsage });
  } catch (error) {
    response.error(res, 500, error);
  }
};
