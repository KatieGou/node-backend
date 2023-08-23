const express = require('express');
const { json } = require('express');
const router = express.Router();
const db = require('../db');
const cors = require('cors');

router.use(cors());
router.use(json());

router.get('/users/:userid', async (req, res) => {
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

router.post('/users/:userid', async (req, res) => {
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

module.exports = router;