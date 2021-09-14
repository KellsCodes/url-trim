
const mongoose = require('mongoose');

const urlSchema = mongoose.Schema({
    mainUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;