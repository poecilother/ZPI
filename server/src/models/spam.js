const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const spamSchema = new Schema({
    word: {
        type: String
    },
    freq: {
        type: Number
    },
    amm: {
        type: Number
    },
    len: {
        type: Number
    }
});

const Spam = mongoose.model('spam', spamSchema);

module.exports = Spam;
