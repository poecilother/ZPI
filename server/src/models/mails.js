const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mailSchema = new Schema({
    from: {
        type: Array,
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

    },
    unseen: {
        type: Boolean
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
    }
}, {
    timestamps: true
});

const mail = mongoose.model('mail', mailSchema);

module.exports = mail;
