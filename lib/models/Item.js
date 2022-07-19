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
  }

  
  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM items ORDER BY listed_date DESC'  
    );
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
    const { rows } = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    if(!rows[0]) {
      return null;
    }
 
    const item = new Item(rows[0]);
   
    return item;
  }
};
