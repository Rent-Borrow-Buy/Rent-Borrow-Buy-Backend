const pool = require('../utils/pool');



module.exports = class User {
  id;
  username;
  email;
  avatar;
  #passwordHash;
  zipcode;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
    this.#passwordHash = row.password_hash;
    this.zipcode = row.zipcode;
  }

  static async insert({
    username,
    email,
    avatar,
    passwordHash,
    zipcode }) {
    const { rows } = await pool.query(
      `INSERT INTO users (username,
        email,
        avatar,
        passwordHash,
        zipcode) 
        VALUES ($1, $2, $3, $4 ) RETURNING *`, 
      [username,
        email,
        avatar,
        passwordHash,
        zipcode] 

    );
    return new User(rows[0]);
  }
};
