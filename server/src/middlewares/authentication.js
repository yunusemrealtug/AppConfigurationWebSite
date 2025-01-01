const admin = require("firebase-admin");
require("dotenv").config();

async function authenticateToken(req, res, next) {
  const idToken = req.headers.authorization;

  if (!idToken) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid ID token" });
  }
}

const verifyApiToken = (req, res, next) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "No API token provided" });
  }

  if (token !== process.env.API_TOKEN) {
    return res.status(403).json({ message: "Invalid API token" });
  }

  next();
};

module.exports = { authenticateToken, verifyApiToken };
