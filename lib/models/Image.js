const pool = require('../utils/pool');

module.exports = class Image {
  id;
  url;
  item_id;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
    this.item_id = row.item_id;
  }

  static async insert({ url, item_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO images (url, item_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [url, item_id]
    );

    return new Image(rows[0]);
  }
};
