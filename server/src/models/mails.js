const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mailSchema = new Schema({
    messageId: {
        type: String
    },
    from: {
        address: {
            type: String
        },
        name: {
            type: String
        }
    },
    subject: {
        type: String
    },
    body: {
        type: String
    },
    unseen: {
        type: Number,
        enum: [0, 1]
    },
    folder: {
        type: Number,
        enum: [1, 2, 3]
    },
    owner: {
        type: String
    },
    address: {
        type: String
    },
    date: {
        type: String
    }
});

const Mail = mongoose.model('mail', mailSchema);

module.exports = Mail;
