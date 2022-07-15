const { Router } = require('express');
const Item = require('../models/Item');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const item = await Item.insert({ ...req.body, user_id: req.user.id });
      // const image = await Image.insert({ ...req.body, blahlbalhblahba })
      res.json(item);  
    } catch (e) {
      next(e);  
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const items = await Item.getAll();
      res.json(items);   
    } catch (e) {
      next(e); 
    }
  });
