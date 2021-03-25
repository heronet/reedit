const express = require('express');
const colors = require('colors');

const connectDB = require("./db");
const cors = require('./middlewares/cors');
const postsRouter = require("./routes/posts");
const userRouter = require('./routes/user');

const app = express();
// Connect to database
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors);
// Handle Post requests
app.use('/api/posts', postsRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.yellow.bold.underline);
})