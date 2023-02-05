const pg = require('pg');
let pool;
if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    database: 'weekend_to_do_app',
  });
}

module.exports = pool;
