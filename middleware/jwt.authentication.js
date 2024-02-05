const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const Token = req.header("Authorization");
  if (!Token) {
    res.json({ error: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.userid = decoded.userid;
    next();
  } catch (error) {
    res.json({ error: "Invalid Token" });
  }
}

module.exports = verifyToken;
