const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies['session'];

    if (!cookie) throw new Error('No cookie found');

    const user = jwt.verify(cookie, process.env.JWT_SECRET);

    req.user = user;
    

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
