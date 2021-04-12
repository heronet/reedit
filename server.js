const express = require('express');
const colors = require('colors');
const cors = require('cors');
require('dotenv').config();

const connectDB = require("./db");
const path = require('path');
const postsRouter = require("./routes/posts");
const userRouter = require('./routes/user');
const messagesRouter = require('./routes/messages');

const app = express();
// Connect to database
connectDB();

global.__basedir = __dirname;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use("/images", express.static(path.join("images")));
// Handle Post requests
app.use('/api/posts', postsRouter);
app.use('/api/users', userRouter);
app.use('/api/messages', messagesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.yellow.bold.underline);
})