require('dotenv').config();
const hash_handle = require('./hash_handle');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// mysql -u root -p

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db:', err.message);
        return;
    }
    console.log('Connection established');
});

// TODO: encrypt password, add id as primary key?, update insertUser (non multiple insert), user login, user choose computer, headphone etc.

function createTable(callback) {
    const query = 'CREATE TABLE IF NOT EXISTS users( \
        username VARCHAR(30) NOT NULL PRIMARY KEY, \
        password VARCHAR(30) NOT NULL )';
    // password string 
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

async function insertUser(username, password) {
    const duplicationMsg = 'User already exists';
    try {
        const existingUser = await queryUser(username);
        if (existingUser.length > 0) {
            // console.error('Error inserting: username already exists');
            throw new Error(duplicationMsg);
        }
        const query = 'INSERT INTO users(username, password) VALUES(?, ?)';
        const hashedPassword = await hash_handle.hashPassword(password);
        await connection.query(query, [username, hashedPassword]);
        // console.log('Records inserted successfully:', results.message);
        return;
    } catch (err) {
        if (err.message === duplicationMsg) {
            throw err;
        }
        throw new Error('Error inserting');
    }
}

function queryUser(username) {
    const query = 'SELECT * FROM users WHERE username=?';
    return new Promise((resolve, reject) => {
        connection.query(query, [username], (err, results) => {
            if (err) {
                console.error('Error in query user:', err.message);
                reject(err);
            } else {
                resolve(results);
            }
        });
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