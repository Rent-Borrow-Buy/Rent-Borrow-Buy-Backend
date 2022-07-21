const { Router } = require('express');
const Item = require('../models/Item');
const Image = require('../models/Image');
const authenticate = require('../middleware/authenticate');
const { cloudinary } = require('../utils/cloudinaryConfig');
const authorizeItem = require('../middleware/authorizeItem');
module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const item = await Item.insert({ ...req.body, user_id: req.user.id });
      // Take the encode image and post to cloudinary
      const fileStr = req.body.encodedImage;
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'ml_default',
      });
      // Get the url of the image from cloudinary
      const { secure_url } = uploadedResponse;

      // Add url and item_id to our image table
      const image = await Image.insert({ url: secure_url, item_id: item.id });
      res.json({ item, image });
    } catch (e) {
      next(e);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const item = await Item.getById(req.params.id);
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
  })
  .put('/:id', authenticate, authorizeItem, async (req, res, next) => {
    try {
      const item = await Item.updateById(req.params.id, req.body);

      
      res.json(item);
  
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', authenticate, authorizeItem, async (req, res, next) => {
    try {
      const item = await Item.deleteById(req.params.id);
      console.log('items controller: item deleted', item);
      res.json(item);
    } catch (e) {
      console.log('e.message', e.message);
      next(e);
    }
  });
