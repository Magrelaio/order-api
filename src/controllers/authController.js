const jwt = require("jsonwebtoken");

async function getBody(req) {
  return new Promise((resolve) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve(null);
      }
    });
  });
}

exports.login = async (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ message: "JWT secret is not configured" }));
  }

  const body = await getBody(req);

  if (!body || typeof body !== "object") {
    res.statusCode = 400;
    return res.end(JSON.stringify({ message: "Invalid JSON" }));
  }

  const { username, password } = body;
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ message: "Auth credentials are not configured" }));
  }

  if (username !== validUsername || password !== validPassword) {
    res.statusCode = 401;
    return res.end(JSON.stringify({ message: "Invalid credentials" }));
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn });

  res.statusCode = 200;
  return res.end(JSON.stringify({
    token,
    tokenType: "Bearer",
    expiresIn
  }));
};