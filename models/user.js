const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  }

  static async updatePassword(userId, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('UPDATE users SET password = ?, reset_code = NULL, reset_code_expires = NULL WHERE id = ?', [hashedPassword, userId]);
  }

  static async storeResetCode(email, resetCode) {
    await db.execute('UPDATE users SET reset_code = ?, reset_code_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?', [resetCode, email]);
  }

  static async verifyResetCode(email, resetCode) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND reset_code = ? AND reset_code_expires > NOW()', [email, resetCode]);
    return rows[0];
  }
}

module.exports = User;