const jwt = require('jsonwebtoken');
const User = require('../db/user/user.model');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
    req.user = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

module.exports = { authenticateUser };
