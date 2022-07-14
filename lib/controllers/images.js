const { Router } = require('express');
const { cloudinary } = require('../utils/cloudinary');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const { resources } = await cloudinary.search
        .expression('folder:dev_setups')
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
      const publicIds = resources.map((file) => file.public_id);
      res.json(publicIds);
    } catch (error) {
      next(error);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const fileStr = req.body.data;
      const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
        upload_preset: 'ml_default',
      });
      console.log(uploadedResponse);
      res.json({ msg: 'woohoo' });
    } catch (error) {
      next(error);
    }
  });
