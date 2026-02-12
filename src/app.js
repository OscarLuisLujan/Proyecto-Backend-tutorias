const express = require('express');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', userRoutes);


module.exports = app;
