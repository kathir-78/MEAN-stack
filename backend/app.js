const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();
const  connectDB   = require('./config');
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/Auth');
require('dotenv').config()


connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/images", express.static(path.join( process.env.IMAGES_PATH)));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/', postRoutes)
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;