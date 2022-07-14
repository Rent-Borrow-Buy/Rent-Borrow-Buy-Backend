const pool = require('../utils/pool');

module.exports = class Item {
  id;
  user_id;
  title;
  description;
  buy;
  rent;
  borrow;
  zipcode;
  sold;
  listed_date;
  
  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.title = row.title;
    this.description = row.description;
    this.buy = row.buy;
    this.rent = row.rent;
    this.borrow = row.borrow;
    this.zipcode = row.zipcode;
    this.sold = row.sold;
    this.listed_date = row.listed_date;
  }

  
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM items ORDER BY listed_date DESC'  
    );
    return rows.map((item) => new Item(item));
  }
};
