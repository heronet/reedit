const express = require('express');
require('colors');

const app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({success: true});
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.cyan.bold);
})