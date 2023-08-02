require('dotenv').config();
const express = require('express');
// const db = require('./db');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// connection=db.connection;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

app.post('/register', (req, res) => {
    const {username, password} = req.body;
    const query = 'INSERT INTO users(username, password) VALUES(?, ?) ON DUPLICATE KEY UPDATE password=VALUES(password)';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error inserting:', err.message);
            res.status(500).send('Error inserting');
            return;
        }
        res.status(200).send('Inserting succeeded');
        // res.json({message: 'Registration  succeeded'});
    });
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db:', err.message);
        return;
    }
    console.log('Connection established');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// app.post('/register', (req, res) => {
//     const {username, password} = req.body;
//     db.insertUser(username, password, (err, results) => {
//         if (err) {
//             console.error('Error inserting:', err.message);
//             res.status(500).send('Error inserting');
//             return;
//         }
//         res.status(200).send('Inserting succeeded');
//         res.json({message: 'Registration  succeeded'});
//     });
// });

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });

// db.createTable((err, results) => {
//     if (err) {
//         console.error('Error create table:', err.message);
//         return;
//     }
//     console.log('created table:', results);
// });

// db.insertUser('user1', '1234', (err, results) => {
//     if (err) {
//         console.error('Error inserting:', err.message);
//         return;
//     }
//     console.log('Inserting succeeded:', results);
// });

// db.queryUser((err, results) => {
//     if (err) {
//         console.error('Error querying:', err.message);
//         return;
//     }
//     console.log('Querying succeeded:', results);
// });

// db.dropTable((err, results) => {
//     if (err) {
//         console.error('Error dropping table:', err.message);
//         return;
//     }
//     console.log('Dropping succeeded:', results);
// });