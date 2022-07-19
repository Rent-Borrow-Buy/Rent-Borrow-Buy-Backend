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
      `SELECT *
      FROM images
      INNER JOIN items
      ON images.item_id = items.id
      ORDER BY listed_date DESC`  
    );
    return rows.map((item) => new Item(item));
  }

  static async insert({ user_id, title, description, buy, rent, borrow, zipcode, sold }) {
    const { rows } = await pool.query(
      `
      INSERT INTO items (user_id, title, description, buy, rent, borrow, zipcode, sold)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [user_id, title, description, buy, rent, borrow, zipcode, sold]
    );

    return new Item(rows[0]);
  }
};
