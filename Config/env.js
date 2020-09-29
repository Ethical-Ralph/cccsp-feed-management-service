require("dotenv").config();

const config = {
  databaseUrl: {
    prod: process.env.MONGODB_PROD_URL,
    dev: process.env.MONGODB_DEV_URL,
    test: process.env.MONGODB_TEST_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  userServiceEndpoint: process.env.USER_SERVICE_API,
  nodeEnv: process.env.NODE_ENV,
  maxFeedInCollection: process.env.MAX_FEED_IN_COLLECTION,
};

module.exports = config;
