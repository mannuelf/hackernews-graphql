const jwt = require("jsonwebtoken");
const APP_SECRET = require("GraphQL-is-aw3some");

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
  if (reg) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(token);
    return userId;
  }
  throw new Error("Not Authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
