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

function createUserTable(callback) {
    const query = 'CREATE TABLE IF NOT EXISTS users( \
        user_id INT PRIMARY KEY AUTO_INCREMENT, \
        username VARCHAR(255) NOT NULL, \
        password VARCHAR(255) NOT NULL )';
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

        // insert into table users
        const query_insert_user = 'INSERT INTO users(username, password) VALUES(?, ?)';
        const hashedPassword = await hash_handle.hashPassword(password);
        await connection.query(query_insert_user, [username, hashedPassword]);
        
        // insert into table favorite_items
        const newlyAddedUser = await queryUser(username);
        const user_id = newlyAddedUser[0].user_id;
        const [favorite_computer, favorite_fruit, favorite_phone, favorite_vegetable] = ['', '', '', ''];
        await insertEmptyFavoriteItem(user_id, favorite_computer, favorite_fruit, favorite_phone, favorite_vegetable);
        return;
    } catch (err) {
        if (err.message === duplicationMsg) {
            throw err;
        }
        throw new Error('Error inserting');
    }
}

async function deleteUser(user_id) {
    try {
        const query_delete_favorite_item = 'DELETE FROM favorite_items WHERE user_id=?';
        await connection.query(query_delete_favorite_item, [user_id]);
        const query_delete_user = 'DELETE FROM users WHERE user_id=?';
        await connection.query(query_delete_user, [user_id]);
        return;
    } catch (err) {
        console.error('Error deleting user:', err.message);
        throw new Error('Error deleting user');
    }
}

function insertEmptyFavoriteItem(user_id, favorite_computer, favorite_fruit, favorite_phone, favorite_vegetable) {
    const query = 'INSERT INTO favorite_items(user_id, favorite_computer, favorite_fruit, favorite_phone, favorite_vegetable) VALUES(?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        connection.query(query, [user_id, favorite_computer, favorite_fruit, favorite_phone, favorite_vegetable], (err, results) => {
            if (err) {
                console.error('Error inserting empty favorite item:', err.message);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
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

function createFavoriteItemTable (callback) {
    const query = 'CREATE TABLE IF NOT EXISTS favorite_items ( \
        user_id INT PRIMARY KEY, \
        favorite_fruit VARCHAR(255), \
        favorite_vegetable VARCHAR(255), \
        favorite_phone VARCHAR (255), \
        favorite_computer VARCHAR (255), \
        FOREIGN KEY (user_id) REFERENCES users(user_id) \
        )';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

// check the code below. show only after authentication
function queryFavoriteItem(user_id) {
    const query = 'SELECT * FROM favorite_items WHERE user_id=?';
    return new Promise((resolve, reject) => {
        connection.query(query, [user_id], (err, results) => {
            if (err) {
                console.error('Error in query favorite item:', err.message);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function updateFavoriteItem(user_id, favorites) {
    const query = 'UPDATE favorite_items SET favorite_computer=?, favorite_fruit=?, favorite_phone=?, favorite_vegetable=? WHERE user_id=?';
    return new Promise((resolve, reject) => {
        connection.query(query, [favorites.favorite_computer, favorites.favorite_fruit, favorites.favorite_phone, favorites.favorite_vegetable, user_id], (err, results) => {
            if (err) {
                console.error('Error in update favorite item:', err.message);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    connection,
    insertUser,
    queryUser,
    deleteUser,
    dropTable,
    queryFavoriteItem,
    updateFavoriteItem,
};