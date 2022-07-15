const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies['session'];
    console.log(req.cookies, '1 cookies');
    console.log('2', req.cookies['session']);
    console.log('3', cookie);

    if (!cookie) throw new Error('No cookie found');

    const user = jwt.verify(cookie, process.env.JWT_SECRET);

    req.user = user;
    

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
