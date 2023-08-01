const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const db = require('./db');
db.createTable((err, results) => {
    if (err) {
        console.error('Error fetching data:', err.message);
        return;
    }
    console.log('Fetched data:', results);
});

db.insertUser('Meinan', 'Gmn699847', (err, results) => {
    if (err) {
        console.error('Error inserting:', err.message);
        return;
    }
    console.log('Inserting succeeded:', results);
});

db.queryUser('Meinan', (err, results) => {
    if (err) {
        console.error('Error querying:', err.message);
        return;
    }
    console.log('Querying succeeded:', results);
});

// db.dropTable((err, results) => {
//     if (err) {
//         console.error('Error dropping table:', err.message);
//         return;
//     }
//     console.log('Dropping succeeded:', results);
// });