const { Router } = require('express');
const Item = require('../models/Item');
const Image = require('../models/Image');
const authenticate = require('../middleware/authenticate');
const { cloudinary } = require('../utils/cloudinaryConfig');

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
