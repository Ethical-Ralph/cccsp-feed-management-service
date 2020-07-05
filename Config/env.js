require("dotenv").config();

const config = {
  databaseUrl: {
    prod: process.env.MONGODB_PROD_URL,
    dev: process.env.MONGODB_DEV_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  userServiceEndpoint: process.env.USER_SERVICE_API,
};

module.exports = config;
