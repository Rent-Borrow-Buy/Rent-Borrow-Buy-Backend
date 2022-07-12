const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    const user = await UserService.create(req.body);
    console.log('user', user);
    res.json(user);
  } catch (e) {
    next(e);
  }
});
