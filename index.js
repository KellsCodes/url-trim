const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');

const urlRoute = require('./routes/url');
const Url = require('./model/urlShortner');

const app = express();
dotenv.config();

// app.use('/url', urlRoute);

// app.use('/add-url', urlRoute);

app.use(express.json({ limit: '3mb', extended: true }));
app.use(express.urlencoded({ limit: '3mb', extended: false }));

app.use(cors());

const PORT = process.env.PORT || config.PORT;

// console.log(config.CONNECTION_URL);

mongoose.connect(config.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology:true })
    .then(() => app.listen(PORT, () => console.log(`server connected on port ${PORT}...\nSuccessfully connected to DB!`)))
    .catch((err) => console.log(err.message));

mongoose.set('useFindAndModify', false);
// for testing purposes
// app.listen(PORT, () => console.log(`server running on port ${PORT}...`))
app.use(urlRoute);

app.get('/', (req, res) => {
    res.send("Welcome to url-trim")
})