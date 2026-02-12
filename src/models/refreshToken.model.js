const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const revokeToken = async (token) => {
  
  const tokensResult = await pool.query(
    `SELECT * FROM refresh_token 
     WHERE revoked = false 
     AND expires_at > NOW()`
  );

  for (const tokenRow of tokensResult.rows) {
    const match = await bcrypt.compare(token, tokenRow.token_hash);
    if (match) {
      await pool.query(
        `UPDATE refresh_token 
         SET revoked = true 
         WHERE id_refresh_token = $1`,
        [tokenRow.id_refresh_token]
        );
        
      return true;
    }
  }
  
  return false; 
};


const cleanupExpiredTokens = async () => {
  await pool.query(
    `DELETE FROM refresh_token 
     WHERE expires_at <= NOW() OR revoked = true`
  );
};

module.exports = {
  revokeToken,
  cleanupExpiredTokens
};