const bcrypt = require('bcrypt');
const User = require('../models/User');
// const jwt = require('jsonwebtoken');

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
};
