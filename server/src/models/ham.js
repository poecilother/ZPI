const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hamSchema = new Schema({
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

const Ham = mongoose.model('ham', hamSchema);

module.exports = Ham;
