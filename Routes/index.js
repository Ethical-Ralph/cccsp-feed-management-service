const express = require("express");
const router = express.Router();
const feedRoutes = require("./feedRoutes");
const commentRoutes = require("./commentRoutes");

module.exports = (db) => {
  router.use(feedRoutes(db));
  router.use(commentRoutes(db));
  return router;
};
