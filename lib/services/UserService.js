const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = class UserService {
  static async create(userInfo) {

    if (userInfo.email.length <= 6) {
      throw new Error('Invalid email');
    }
    if (userInfo.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const passwordHash = await bcrypt.hash(
      userInfo.password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      ...userInfo,
      passwordHash,
    });

    return user;
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);
      if (!user) throw new Error('1 Invalid email or password');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('2 Invalid email or password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      return token;
    } catch (e) {
      e.status = 401;
      throw e;
    }
  }
};
