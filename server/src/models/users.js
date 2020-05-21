const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google'],
        required: true
    },
    local: {
        username: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String
        },
        username: {
            type: String
        },
    },
    mailBoxes: {
        type: Array,
        protocol: {
            type: String
        },
        user: {
            type: String
        },
        password: {
            type: String
        },
        host: {
            type: String
        },
        level: {
            type: Number,
            enum: [1, 2, 3]
        },
        mails: {
            type: Array,
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
        },
        blacklist: {
            mails: {
                type: Array
            },
            words: {
                type: Array
            }
        }
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    try {
        if (this.method !== 'local') {
            next();
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHash;
        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('user', userSchema);
 
module.exports = User;
