const express = require("express");
const router = express.Router();

const {
  getFeed,
  getFeeds,
  createFeed,
  editFeed,
  deleteFeed,
  likeOrUnlikeFeed,
  countFeedShare,
} = require("../Controllers/feedController");
const { feedExist, isFeedOwner } = require("../Middlewares/feed");
const { auth } = require("../Middlewares/auth");

module.exports = (db) => {
  router.get("/", feedExist(db), getFeeds(db));
  router.post("/", auth, createFeed(db));

  router.get("/:feedId", feedExist(db), getFeed(db));
  router.put("/:feedId", auth, feedExist(db), isFeedOwner, editFeed(db));
  router.delete("/:feedId", auth, feedExist(db), isFeedOwner, deleteFeed(db));
  router.patch(
    "/:feedId/likeorunlike",
    auth,
    feedExist(db),
    likeOrUnlikeFeed(db)
  );
  router.patch("/:feedId/sharecount", auth, feedExist(db), countFeedShare(db));

  return router;
};
