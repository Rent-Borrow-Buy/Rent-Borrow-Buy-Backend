const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  firstName;
  lastName;
  email;
  avatar;
  #passwordHash;
  zipcode;

  constructor(row) {
    this.id = row.id;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
    this.#passwordHash = row.password_hash;
    this.zipcode = row.zipcode;
  }

  static async insert({ username,  firstName,
    lastName, email, avatar, passwordHash, zipcode }) {
    const { rows } = await pool.query(
      `INSERT INTO users (
        username, 
        first_name, 
        last_name,
        email,
        avatar,
        password_hash,
        zipcode) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [username, firstName,
        lastName,  email, avatar, passwordHash, zipcode]
    );
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT * FROM users WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
