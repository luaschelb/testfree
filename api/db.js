const mariadb = require('mariadb');

// Create a connection pool to MariaDB
const pool = mariadb.createPool({
  host: 'localhost', 
  user: 'root', 
  password: '',
  database: 'testfree',
  port: 3306,
  connectionLimit: 5
});

module.exports = pool