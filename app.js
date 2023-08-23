const express = require('express');

const app = express();

const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
