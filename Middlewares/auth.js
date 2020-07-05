const {userServiceEndpoint} = require("../Config/env");

const verifySession = (req) => {
  
};

const auth = async (req, res, next) => {
  try {
    const user = verifySession(req);
    if (!user) throw Error("User isn't logged in");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
