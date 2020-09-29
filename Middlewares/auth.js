const { userServiceEndpoint } = require("../Config/env");

const verifySession = (req) => {};

const auth = async (req, res, next) => {
  try {
    // const user = verifySession(req);
    // if (!user) throw authenticationError("User isn't logged in");
    const user = {
      id: "hsdflgdf98dfffv778t",
    };
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const adminRoles = ["admin", "superadmin"];

module.exports = { auth, adminRoles };
