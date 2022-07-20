const pool = require('../utils/pool');

module.exports = class Item {
  id;
  user_id;
  title;
  description;
  buy;
  rent;
  borrow;
  price;
  zipcode;
  sold;
  listed_date;
  url;
  
  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.title = row.title;
    this.description = row.description;
    this.buy = row.buy;
    this.rent = row.rent;
    this.borrow = row.borrow;
    this.price = row.price;
    this.zipcode = row.zipcode;
    this.sold = row.sold;
    this.listed_date = row.listed_date;
    this.url = row.url;
    this.images = row.images ?? [];
  }

  
  static async getAll() {
    const { rows } = await pool.query(
      `SELECT *
      FROM images
      INNER JOIN items
      ON images.item_id = items.id
      ORDER BY listed_date DESC`  
    );
    console.log('rows[0]', rows[0]);
    return rows.map((item) => new Item(item));
  }

  static async insert({ user_id, title, description, buy, rent, borrow, price, zipcode, sold }) {
    const { rows } = await pool.query(
      `
      INSERT INTO items (user_id, title, description, buy, rent, borrow, price, zipcode, sold)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [user_id, title, description, buy, rent, borrow, price, zipcode, sold]
    );

    return new Item(rows[0]);
  }

  static async updateById(id, attrs) {
  
    const item = await Item.getById(id);


    if(!item) return null;
    const { title, description, buy, rent, borrow, price, zipcode, sold } = { ...item, ...attrs };
    const { rows } = await pool.query('UPDATE items SET title=$2 , description=$3, buy=$4, rent=$5, borrow=$6, price=$7, zipcode=$8, sold=$9 WHERE id= $1 RETURNING *', [id, title, description, buy, rent, borrow, price, zipcode, sold] 
    );

    return new Item(rows[0]);
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT items.*,
      COALESCE(
          json_agg(to_jsonb(images))
          FILTER (WHERE images.id IS NOT NULL), '[]')
          AS images
        FROM items
        INNER JOIN images
        ON images.item_id = items.id
        WHERE items.id = $1
        GROUP BY items.id
        ORDER BY listed_date DESC`, [id]);
    if(!rows[0]) {
      return null;
    }
 
    const item = new Item(rows[0]);
   
    return item;
  }
};
