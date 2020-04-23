const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

tokenSchema.index( { createdAt: 1 }, { expireAfterSeconds: 18000 } );

const RefreshToken = mongoose.model('refreshToken', tokenSchema);

module.exports = RefreshToken;
