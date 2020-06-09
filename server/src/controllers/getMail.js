const User = require('../models/users');
const Mail = require('../models/mails');
const jwt = require('jsonwebtoken');

async function getMail (req, res, next) {
    if (!req.query.messageId) {
        return res.json({
            success: 0,
            msg: 'Brak ID maila'
        });
    }

    jwt.verify(req.header('authorization'), process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
            return res.json({ success: -1 });
        } else {
            req.userId = decodedToken.sub;

            const foundMail = await Mail.findOne({
                'owner': req.userId,
                'messageId': req.query.messageId 
            });

            if (foundMail) {
                return res.json({
                    success: 1,
                    mail: foundMail
                });
            } else {
                return res.json({
                    success: 0,
                    msg: 'Nie znaleziono wiadomości'
                });
            }
        }
    });
}

module.exports = getMail;
