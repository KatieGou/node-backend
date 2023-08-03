const express = require('express');
const { json } = require('express');
const db = require('./db');
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
        res.status(500).send('Error inserting');
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

