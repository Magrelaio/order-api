const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Missing or invalid authorization header" }));
    return false;
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "JWT secret is not configured" }));
    return false;
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return true;
  } catch (error) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Invalid or expired token" }));
    return false;
  }
};