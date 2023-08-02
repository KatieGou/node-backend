const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'Meinan',
    password: 'Gmn699847',
    database: 'user_info'
});

// mysql -u root -p

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db:', err.message);
        return;
    }
    console.log('Connection established');
});

function createTable(callback) {
    const query = 'CREATE TABLE IF NOT EXISTS users( \
        username VARCHAR(30) NOT NULL PRIMARY KEY, \
        password VARCHAR(30) NOT NULL )';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function insertUser(username, password, callback) {
    const query = 'INSERT INTO users(username, password) VALUES(?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error inserting:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function queryUser(callback) {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error in query user:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

function dropTable(callback) {
    const query = 'DROP TABLE users';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error dropping table:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

module.exports = {
    connection,
    createTable,
    insertUser,
    queryUser,
    dropTable
};