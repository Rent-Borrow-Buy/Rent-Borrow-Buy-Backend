const Item = require('../models/Item');

module.exports = async (req, res, next) => {
  try {
    const item = await Item.getById(req.params.id);
    if(!item || item.user_id !== req.user.id) {
      throw new Error('You do not have access to this item');
    }
    next();
  } catch (e){
    e.status = 403;
  }
};
