const express = require('express');
const colors = require('colors');

const connectDB = require("./db");
const postsRouter = require("./routes/posts");

const app = express();
// Connect to database
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Handle Post requests
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.yellow.bold);
})