const express = require('express');
const { json } = require('express');
const router = express.Router();
const db = require('../db');
const hash_handle = require('../hash_handle');
const cors = require('cors');

router.use(cors());
router.use(json());

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        await db.insertUser(username, password);
        res.json({message: 'Registration succeeded'});
    } catch (err) {
        console.error('Error inserting:', err.message);
        res.status(500).send(`Error creating user: ${err.message}`);
    }
});

router.post('/login', async (req, res) => {
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

// router.post('/changePassword', async (req, res) => {});
// router.post('/deleteUser', async (req, res) => {});

module.exports = router;