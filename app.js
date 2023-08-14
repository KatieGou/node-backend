const express = require('express');
const { json } = require('express');
const db = require('./db');
const hash_handle = require('./hash_handle');
const cors = require('cors');

const app = express();
app.use(json());
app.use(cors());

app.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        await db.insertUser(username, password);
        res.json({message: 'Registration  succeeded'});
    } catch (err) {
        console.error('Error inserting:', err.message);
        res.status(500).send(`Error creating user: ${err.message}`);
    }
});

app.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const results = await db.queryUser(username);
        if (results.length === 0) {
            res.status(401).send('User does not exist');
            return;
        }
        const hashedPassword = results[0].password;
        const isMatch = await hash_handle.comparePassword(password, hashedPassword);
        if (isMatch) {
            // res.json({message: 'Login succeeded'});
            res.status(200).send('Login succeeded');
        } else {
            res.status(401).send('Wrong password');
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).send(`Error logging in: ${err.message}`);
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

