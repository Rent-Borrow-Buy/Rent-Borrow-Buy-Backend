const Item = require('../models/Item');

module.exports = async (req, res, next) => {
  console.log(req.params.id);
  try {
    const item = await Item.getById(req.params.id);
    console.log('item', item);

    if(!item || item.user_id !== req.user.id) {
      throw new Error('You do not have access to this item');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
