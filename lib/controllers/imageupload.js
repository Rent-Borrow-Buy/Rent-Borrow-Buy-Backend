const { Router } = require('express');

module.exports = Router()
  .get('/')
  .post('/', (req, res, next) => {
    try {
      const fileStr = req.body.data;
      console.log(fileStr);
    } catch (error) {
      next(error);
    }
  });
