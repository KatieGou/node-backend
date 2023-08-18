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
        // console.log('results:', results)
        if (results.length === 0) {
            res.status(401).send('User does not exist');
            return;
        }
        const hashedPassword = results[0].password;
        // console.log('hashedPassword:', hashedPassword);
        const isMatch = await hash_handle.comparePassword(password, hashedPassword);
        if (isMatch) {
            res.json(results);
            // res.status(200).send('Login succeeded');
        } else {
            res.status(401).send('Wrong password');
        }
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).send(`Error logging in: ${err.message}`);
    }
});

// app.post('/changePassword', async (req, res) => {});
// app.post('/deleteUser', async (req, res) => {});

app.get('/users/:userid', async (req, res) => {
    try {
        const userid = req.params.userid;
        const results = await db.queryFavoriteItem(userid);
        // console.log('results:', results);
        res.json(results);
    } catch (err) {
        console.error('Error getting favorite items:', err.message);
        res.status(500).send(`Error getting favorite items: ${err.message}`);
    }
});

app.post('/users/:userid', async (req, res) => {
    try {
        const {user_id, favorite_fruit, favorite_vegetable, favorite_phone, favorite_computer} = req.body;
        const favorites = {
            'favorite_fruit': favorite_fruit,
            'favorite_vegetable': favorite_vegetable,
            'favorite_phone': favorite_phone,
            'favorite_computer': favorite_computer
        }
        const results = await db.updateFavoriteItem(user_id, favorites);
        // console.log('results:', results);
        res.json(results);
    } catch (err) {
        console.error('Error updating favorite items:', err.message);
        res.status(500).send(`Error updating favorite items: ${err.message}`);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

